import * as Yup from "yup";

import AppError from "../../errors/AppError";
import Tenant from "../../models/Tenant";

interface Request {
  name: string;
  status: string;
  cnpj: string;

}

interface RequestUser {
  name: string;
  status: string;
  cnpj: string;
}

interface Response {
  name: string;
  id: number;
  status: string;
  cnpj: string;
}

export const CreateTenantService = async ({
  name,
  status,
  cnpj
}: Request): Promise<Response> => {
  const tenat = await Tenant.create({
    name,
    status,
    cnpj
  });

  const serializeTenant = {
    id: tenat.id,
    name: tenat.name,
    status: tenat.status,
    cnpj: tenat.cnpj,
  };

  return serializeTenant;
};


export const CreateTenantUserService = async ({
  name,
  cnpj,

}: RequestUser): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string().required().min(2),
  });

  try {
    await schema.validate({ name, });
  } catch (err) {
    throw new AppError(err.message);
  }

  const tenat = await Tenant.create({
    name,
    status,
    cnpj
  });

  const serializeTenant = {
    id: tenat.id,
    name: tenat.name,
    status: tenat.status,
    cnpj: tenat.cnpj,
  };

  return serializeTenant;
};