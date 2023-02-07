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
  name: 'Empresa',
  components: {
    ModalUsuario
  },
  data () {
    return {
      empresas: [],
      loading: false,
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      filter: '',
      modalUsuario: false,
      usuarioSelecionado: {}
    }
  },
  computed: {
    columns () {
      return [
        {
          name: 'name',
          label: 'Razão Social',
          field: 'name',
          align: 'left',
          sortable: true
        },
        {
          name: 'status',
          label: 'Status',
          field: 'status',
          align: 'left',
          sortable: true
        },
        {
          name: 'cnpj',
          label: 'CNPJ',
          field: 'cnpj',
          align: 'left',
          sortable: true
        },
        {
          name: 'acoes',
          label: 'Ações',
          field: 'acoes',
          align: 'center',
          sortable: true
        }
      ]
    }
  },
  methods: {
    async listarEmpresas () {
      this.loading = true
      const { data } = await AdminListarEmpresas()
      this.empresas = data
      this.loading = false
      console.log(data)
    },
    onScroll () {
      console.log('onScroll')
    },
    editarUsuario (usuario) {
      this.usuarioSelecionado = usuario
      this.modalUsuario = true
    },
    usuarioCriado (usuario) {
      this.empresas.push(usuario)
    },
    UPDATE_EMPRESA (empresa) {
      const index = this.empresas.findIndex(item => item.id === empresa.id)
      this.empresas.splice(index, 1, empresa)
    },
    filtrarEmpresa () {
      console.log(this.filter)
    }
  },
  created () {
    this.listarEmpresas()
  } // ,
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
