<template>
  <div>
    <div class="columns">
      <div class="column">
        <b-field label="Search for:">
          <b-input v-model="filterText" name="search" @keyup.enter="setFilter(filterText)"></b-input>
        </b-field>
      </div>
      <div class="column">
        <b-field label="Type filter">
          <b-select name="select" v-model="selected" placeholder="Select type filter">
            <option
              v-for="option in dataoptions"
              :value="option.text"
              :key="option.id">
              {{ option.text }}
            </option>
          </b-select>
        </b-field>
      </div>
    </div>
    <div class="columns is-hidden-tablet">
      <div class="column">
        <div class="columns">
          <div class="column">
            <button name="addButton" class="button" @click="createModal">
              Add
            </button>
            <button name="refreshButton" class="button" @click="refreshTable">
              Refresh
            </button>
            <button class="button" name="goButton" @click="setFilter(filterText)">Search</button>
            <button class="button" name="resetButton"  @click="resetFilter(filterText)">Reset filter</button>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-hidden-mobile">
      <div class="column">
        <button  name="addButton" id="addButtonDesktop" class="button" @click="createModal">
          Add
        </button>
        <button  name="refreshButton" class="button" @click="refreshTable">
          Refresh
        </button>
      </div>
      <div class="column">
        <button class="button" name="goButton" @click="setFilter(filterText)">Search</button>
        <button class="button" name="resetButton"  @click="resetFilter(filterText)">Reset filter</button>
      </div>
    </div>

  <vuetable
    class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" ref="vuetable"
    :api-url="`${this.$store.state.moneys.url}?format=${this.$store.state.moneys.format}`"
    :fields="fields"
    pagination-path="pagination"
    :http-options="options"
    data-path="results"
    :multi-sort="true"
    track-by="pk"
    :append-params="moreParams"
    :css="css"
    :queryParams="queryParams"
    :sort-order="sortOrder"
    detail-row-component="updateProduct"
    @vuetable:sortOrder="getSortParam"
    @vuetable:pagination-data="onPaginationData"
    @vuetable:row-clicked="onRowClicked"
    @vuetable:load-error="onErrorLoad"
  >
  </vuetable>
  <vuetable-pagination :css="css.pagination" ref="pagination"
                       @vuetable-pagination:change-page="onChangePage"
  ></vuetable-pagination>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueEvents from 'vue-events'
  import updateProduct from '../components/product/updateProduct.vue'

  const addProduct = () => import('../components/product/addProduct.vue')
  const Vuetable = () => import('vuetable-2/src/components/Vuetable.vue')
  const VuetablePagination = () => import('vuetable-2/src/components/VueTablePagination.vue')

  Vue.use(VueEvents)
  Vue.component('delProduct', () => import('../components/product/delProduct'))
  Vue.component('updateProduct', updateProduct)

  export default {
    components: {
      Vuetable,
      VuetablePagination,
      updateProduct
    },
    computed: {
      options: function () {
        return {
          headers: {
            'Authorization': `Bearer ${this.$store.state.auth.token}`
          }
        }
      }
    },
    data() {
      return {
        dataoptions: [
          {
            id: 1,
            text: 'product'
          },

          {
            id: 2,
            text: 'money'
          },
          {
            id: 3,
            text: 'date'
          }
        ],
        sortOrder: [
          {
            field: 'pk',
            direction: 'asc'
          }
        ],
        selected: '',
        filterText: '',
        moreParams: {},
        queryParams: {
          sort: 'ordering',
          page: 'page',
          perPage: 'per_page'
        },
        current_page: 1,
        last_page: 1,
        fields: [
          {
            name: 'product',
            sortField: 'product'
          },
          {
            name: 'money',
            sortField: 'money'
          },
          {
            name: 'date',
            sortField: 'date',
            callback: 'date_transform',
            direction: 'desc'
          },
          {
            name: '__component:delProduct',   // <----
            title: 'Actions',
            titleClass: 'center aligned',
            dataClass: 'center aligned'
          }
        ],
        css: {
          ascendingIcon: 'glyphicon glyphicon-chevron-up',
          descendingIcon: 'glyphicon glyphicon-chevron-down',
          pagination: {
            wrapperClass: 'pagination pull-right',
            activeClass: 'btn-primary',
            disabledClass: 'disabled',
            pageClass: 'btn btn-border',
            linkClass: 'btn btn-border',
            icons: {
              first: 'mdi mdi-chevron-double-left mdi-24px',
              prev: 'mdi mdi-chevron-left mdi-24px',
              next: 'mdi mdi-chevron-right mdi-24px',
              last: 'mdi mdi-chevron-double-right mdi-24px'
            }
          }
        }
      }
    },
    methods: {
      setFilter(filterText) {
        let res = this.selected
        this.moreParams[res] = filterText
        Vue.nextTick(() => this.$refs.vuetable.refresh())
      },
      resetFilter() {
        this.moreParams = {}
        Vue.nextTick(() => this.$refs.vuetable.refresh())
      },
      onErrorLoad(r) {
        if (r.response.status === 401) {
          if (this.$store.state.auth.refresh_token === '') {
            this.$router.push({'name': 'login'})
          } else {
            this.$store.dispatch('auth/GET_REFRESH', this.$refs.vuetable.refresh).then(function () {
              this.refreshTable()
            }.bind(this))
          }
        } else {
          this.$snackbar.open({
            duration: 5000,
            message: 'Request error',
            type: 'is-danger',
            position: 'is-bottom-left',
            actionText: 'Undo',
            queue: false
          })
        }
      },
      getSortParam: function (sortOrder) {
        return sortOrder.map(function (sort) {
          return (sort.direction === 'desc' ? '' : '-') + sort.field
        }).join(',')
      },
      refreshTable() {
        this.$refs.vuetable.refresh()
      },
      createModal() {
        this.$modal.open({
          parent: this,
          active: true,
          component: addProduct,
          hasModalCard: true,
          props: {
            'reload': this.refreshTable
          }
        })
      },
      date_transform(date) {
        return new Date(date).toLocaleDateString('ru-Ru')
      },
      transform(data) {
        let a = {}
        this.last_page = Math.ceil(data.count / 5)
        a['pagination'] = {
          next_page_url: data.next,
          prev_page_url: data.previous,
          'total': data.count,
          'current_page': this.current_page,
          'last_page': this.last_page
        }
        a['results'] = data.results
        return a
      },
      onPaginationData(paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
      },
      onChangePage(page) {
        switch (page) {
          case 'next':
            if (this.current_page !== this.last_page) {
              this.current_page += 1
            }
            break
          case 'prev':
            if (this.current_page !== 1) {
              this.current_page -= 1
            }
            break
          default:
            this.current_page = page
        }
        this.$refs.vuetable.changePage(page)
      },
      onRowClicked(data, field, event) {
        this.$refs.vuetable.toggleDetailRow(data.pk)
      }
    }
  }
</script>

<style scoped>
.button{
  margin: 0 10px;
}
</style>
