// pages/login.vue

<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Welcome back!</h2>

          <form method="post" @submit.prevent="login">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="username"
                  v-model="username"
                >
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  type="password"
                  class="input"
                  name="password"
                  v-model="password"
                >
              </div>
            </div>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">Log In</button>
            </div>
          </form>
          <div class="has-text-centered" style="margin-top: 20px">
            <p>
              Don't have an account?
              <nuxt-link to="/register">Register</nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    layout: 'empty',
    data() {
      return {
        username: '',
        password: ''
      }
    },

    methods: {
      async login() {
        try {
          await this.$store.dispatch('auth/GET_LOGIN', {
            username: this.username,
            password: this.password
          })
          this.$router.push({name: 'index'})
        } catch (e) {
          switch (e.response.status) {
            case 400:
              this.$snackbar.open({
                duration: 5000,
                message: 'Not found pair login/password',
                type: 'is-danger',
                position: 'is-bottom-left',
                actionText: 'Undo',
                queue: false
              });
              break
          }
        }
      }
    }
  }
</script>
