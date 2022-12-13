import { Request, Response } from "express";
// import path from "path";
// import { rmdir } from "fs/promises";
import { getWbot, removeWbot } from "../libs/wbot";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";
import { setValue } from "../libs/redisClient";
import { logger } from "../utils/logger";
import { getTbot, removeTbot } from "../libs/tbot";
import { getInstaBot, removeInstaBot } from "../libs/InstaBot";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";

const store = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { tenantId } = req.user;
  const whatsapp = await ShowWhatsAppService({
    id: whatsappId,
    tenantId,
    isInternal: true
  });

  StartWhatsAppSession(whatsapp);

  return res.status(200).json({ message: "Starting session." });
};

const update = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { tenantId } = req.user;
  const { whatsapp } = await UpdateWhatsAppService({
    whatsappId,
    whatsappData: { session: "" },
    tenantId
  });

  // await apagarPastaSessao(whatsappId);
  StartWhatsAppSession(whatsapp);
  return res.status(200).json({ message: "Starting session." });
};

const remove = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { tenantId } = req.user;
  const channel = await ShowWhatsAppService({ id: whatsappId, tenantId });

  const io = getIO();

  try {
    if (channel.type === "whatsapp") {
      const wbot = getWbot(channel.id);
      await setValue(`${channel.id}-retryQrCode`, 0);
      // await wbot.destroy(); // --> fecha o client e conserva a sessão para reconexão (criar função desconectar)
      await wbot.logout(); // --> encerra a sessão e desconecta o bot do whatsapp, geando um novo QRCODE
      removeWbot(channel.id);
    }

    if (channel.type === "telegram") {
      const tbot = getTbot(channel.id);
      await tbot.telegram.logOut();
      removeTbot(channel.id);
    }

    if (channel.type === "instagram") {
      const instaBot = getInstaBot(channel.id);
      await instaBot.destroy();
      removeInstaBot(channel);
    }

    await channel.update({
      status: "DISCONNECTED",
      session: "",
      qrcode: null,
      retries: 0
    });
  } catch (error) {
    logger.error(error);
    await channel.update({
      status: "DISCONNECTED",
      session: "",
      qrcode: null,
      retries: 0
    });

    io.emit(`${channel.tenantId}:whatsappSession`, {
      action: "update",
      session: channel
    });
    throw new AppError("ERR_NO_WAPP_FOUND", 404);
  }
  return res.status(200).json({ message: "Session disconnected." });
};

export default { store, remove, update };
