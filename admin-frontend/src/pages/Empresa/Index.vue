<template>
  <div>
    <q-table
      class="my-sticky-dynamic q-ma-lg"
      title="Empresas"
      :data="empresas"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :pagination.sync="pagination"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      @virtual-scroll="onScroll"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top-right>
        <q-input
          style="width: 300px"
          filled
          dense
          class="col-grow"
          debounce="500"
          v-model="filter"
          clearable
          placeholder="Localize"
          @input="filtrarEmpresa"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          class="q-ml-md col"
          :class="{
            'q-ml-none q-mt-md q-mr-md': $q.screen.width < 500
          }"
          color="primary"
          label="Adicionar"
          @click="usuarioSelecionado = {}; modalUsuario = true"
        />
      </template>
      <template v-slot:body-cell-acoes="props">
        <q-td class="text-center">
          <q-btn
            flat
            round
            icon="edit"
            @click="editarUsuario(props.row)"
          />
        </q-td>
      </template>
      <template v-slot:pagination="{ pagination }">
        {{ empresas.length }}/{{ pagination.rowsNumber }}
      </template>
    </q-table>
    <ModalUsuario
      :modalUsuario.sync="modalUsuario"
      @modalUsuario:usuario-editado="UPDATE_EMPRESA"
      @modalUsuario:usuario-criado="usuarioCriado"
      :usuarioEdicao.sync="usuarioSelecionado"
    />
  </div>
</template>

<script>
// const userId = +localStorage.getItem('userId')
import { AdminListarEmpresas } from '../../service/empresas'
import ModalUsuario from './ModalUsuario'
export default {
  name: 'IndexUsuarios',
  components: { ModalUsuario },
  data () {
    return {
      empresas: [],
      usuarioSelecionado: {},
      filas: [],
      optionsStatus: [
        { value: 'active', label: 'Ativo' },
        { value: 'desactive', label: 'Desativado' }
      ],
      modalUsuario: false,
      filter: null,
      pagination: {
        rowsPerPage: 40,
        rowsNumber: 0,
        lastIndex: 0
      },
      params: {
        pageNumber: 1,
        searchParam: null,
        hasMore: true
      },
      loading: false,
      columns: [
        { name: 'tenant', label: 'Empresa', field: 'tenant', align: 'left', format: v => `${v.id} - ${v.name}` },
        { name: 'status', label: 'Status', field: 'status', align: 'left', format: (v) => this.optionsStatus.find(o => o.value == v).label },
        { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
      ]
    }
  },
  methods: {
    LOAD_EMPRESA (Tenants) {
      const newTenant = []
      Tenants.forEach(tenant => {
        const tenantIndex = this.empresas.findIndex(c => c.id === tenant.id)
        if (tenantIndex !== -1) {
          this.empresas[tenantIndex] = tenant
        } else {
          newTenant.push(tenant)
        }
      })
      const tenantObj = [...this.empresas, ...newTenant]
      this.empresas = tenantObj
    },
    UPDATE_EMPRESA (tenant) {
      let newTenant = [...this.empresas]
      const tenantIndex = newTenant.findIndex(c => c.id === tenant.id)
      if (tenantIndex !== -1) {
        newTenant[tenantIndex] = tenant
      } else {
        newTenant = [tenant, ...newTenant]
      }
      this.empresas = [...newTenant]
    },
    DELETE_EMPRESA (tenantId) {
      const newObj = [...this.empresas.filter(u => u.id !== tenantId)]
      this.empresas = [...newObj]
    },
    async listarEmpresas () {
      this.loading = true
      const { data } = await AdminListarEmpresas(this.params)
      console.log(data)
      this.params.hasMore = data.hasMore
      this.LOAD_EMPRESA(data.Tenants)
      this.loading = false
      this.pagination.lastIndex = this.empresas.length - 1
      this.pagination.rowsNumber = data.count
    },
    filtrarEmpresa (data) {
      this.empresas = []
      this.params.pageNumber = 1
      this.params.searchParam = data
      this.loading = true
      this.listarEmpresas()
    },
    onScroll ({ to, ref, ...all }) {
      if (this.loading !== true && this.params.hasMore === true && to === this.pagination.lastIndex) {
        this.params.pageNumber++
        this.listarEmpresas()
      }
    },
    usuarioCriado (usuario) {
      const obj = [...this.usuarios]
      obj.push(usuario)
      this.usuarios = [...obj]
    },
    editarUsuario (usuario) {
      this.usuarioSelecionado = usuario
      this.modalUsuario = true
    }
  },
  async mounted () {
    await this.listarEmpresas()
  }
}
</script>

<style lang="sass" >
.my-sticky-dynamic
  /* height or max-height is important */
  height: 85vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 63px
  thead tr:first-child th
    top: 0
</style>
