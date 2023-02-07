<template>
  <q-dialog
    persistent
    :value="modalUsuario"
    @hide="fecharModal"
    @show="abrirModal"
  >
    <q-card style="width: 600px">
      <q-card-section>
        <div class="text-h6">Cadastrar Empresa</div>
        <q-card-section class="q-col-gutter-sm">
        <div class="row q-col-gutter-sm">
          <div class="col-7">
            <c-input
              outlined
              v-model.trim="tenant.name"
              :validator="$v.tenant.name"
              @blur="$v.tenant.name.$touch"
              label="Nome"
            />
        </div>
        <div class="col-5">
            <c-input
              outlined
              v-model.trim="tenant.cnpj"
              :validator="$v.tenant.cnpj"
              @blur="$v.tenant.cnpj.$touch"
              label="CNPJ"
            />
          </div>
        </div>
      </q-card-section>
      </q-card-section>
      <v-divider></v-divider>
      <q-card-section>
        <div class="text-h6">Cadastrar Usuario de acesso</div>
      </q-card-section>
      <q-card-section class="q-col-gutter-sm">
        <div class="row q-col-gutter-sm">
          <div class="col-5">
            <c-input
              outlined
              v-model.trim="usuario.name"
              :validator="$v.usuario.name"
              @blur="$v.usuario.name.$touch"
              label="Nome"
            />
          </div>
          <div class="col-7">
            <c-input
              outlined
              :validator="$v.usuario.email"
              @blur="$v.usuario.email.$touch"
              v-model.trim="usuario.email"
              label="E-mail"
            />
          </div>
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col-5">
            <c-input
              outlined
              v-model="usuario.password"
              :validator="$v.usuario.password"
              @blur="$v.usuario.password.$touch"
              :type="isPwd ? 'password' : 'text'"
              label="Senha"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </c-input>
          </div>
          <div class="col-7">
            <q-select
              :disable="isProfile"
              outlined
              v-model="usuario.profile"
              :options="optionsProfile"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Perfil"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Sair"
          class="q-px-md q-mr-sm"
          color="negative"
          v-close-popup
        />
        <q-btn
          label="Salvar"
          class="q-px-md"
          color="primary"
          @click="handleUsuario"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script>
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import { CriarUsuario, AdminUpdateUsuarios } from 'src/service/user'
import { CriarTenant } from 'src/service/empresas'

export default {
  name: 'ModalUsuario',
  props: {
    modalUsuario: {
      type: Boolean,
      default: false
    },
    isProfile: {
      type: Boolean,
      default: false
    },
    usuario: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          password: '',
          profile: ''
        }
      }
    },
    tenant: {
      type: Object,
      default: () => {
        return {
          name: '',
          cnpj: '',
          status: 'active'
        }
      }
    }
  },
  data () {
    return {
      isPwd: true,
      optionsProfile: [
        { value: 'admin', label: 'Administrador' },
        { value: 'user', label: 'Usuario' }
      ]
    }
  },
  validations: {
    tenant: {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50)
      },
      cnpj: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50)
      }
    },
    usuario: {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50)
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(50)
      }
    }
  },
  methods: {
    async handleUsuario () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      const { name, email, password, profile } = this.usuario
      const { name: tenantName, cnpj } = this.tenant
      const data = {
        name,
        email,
        password,
        profile,
        tenantName,
        cnpj
      }
      if (this.isProfile) {
        await AdminUpdateUsuarios(data)
      } else {
        CriarUsuario && CriarTenant(data)
      }
      this.fecharModal()
    },
    fecharModal () {
      this.$emit('fecharModal')
    },
    abrirModal () {
      this.$emit('abrirModal')
    }
  }
}

</script>
<style lang="scss" scoped>
</style>
