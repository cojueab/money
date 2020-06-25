// DetailRow.vue
<template>
  <div style="width:70%;margin-left: auto;margin-right: auto;">
    <b-field label="Product">
      <b-input type="text" name="product" v-model="rowData.product"></b-input>
    </b-field>
    <b-field label="Money">
      <b-input type="number" name="money" step="0.1" v-model="rowData.money"></b-input>
    </b-field>
    <button class="ui basic button" id="updateButton" @click="update">Сохранить</button>
  </div>
</template>

<script>
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
      update() {
        this.$store.dispatch('moneys/PATCH', this.$props.rowData)
        this.$parent.toggleDetailRow(this.$props.rowData.pk)
      }
    }
  }
</script>

<style scoped>
  template {
    background: darkgray;
  }
</style>
