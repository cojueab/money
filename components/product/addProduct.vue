<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Add</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Product">
          <b-input
            type="text"
            name="product"
            v-model="product"
            placeholder="Your email"
            required>
          </b-input>
        </b-field>
        <b-field label="Money">
          <b-input
            type="number" step="0.1"
            v-model="money"
            name="money"
            placeholder="Your email"
            required>
          </b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Close</button>
        <button id="addButton" class="button is-primary" type="button" @click="create">Add</button>
      </footer>
    </div>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        money: 0,
        product: '',
        pk: 0
      }
    },
    methods: {
      async create() {
        let data = await this.$store.dispatch('moneys/CREATE', {
          'product': this.product,
          'money': this.money
        })
        this.pk = data['pk']
        await this.$parent.props.reload()
        this.$parent.close()
      }
    }
  }
</script>
