<template>
  <div class="custom-actions">
    <i class="mdi mdi-delete" @click="itemAction('delete-item', rowData, rowIndex)"></i>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    props: {
      rowData: {
        type: Object,
        required: true
      },
      rowIndex: {
        type: Number
      }
    },
    methods: {
      async itemAction(action, data) {
        Vue.delete(this.$parent.tableData, this.rowIndex)
        await this.$store.dispatch('moneys/DELETE', data)
        this.$parent.reload()
      }
    }
  }
</script>
