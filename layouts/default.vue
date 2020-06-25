<template>
  <section class="container">
    <nav class="navbar is-transparent">
      <div class="navbar-brand">
        <nuxt-link style="margin-left:15px" class="navbar-item" to="/">Finance minisystem</nuxt-link>
        <div class="navbar-burger burger" @click="toggleMenu" :class="{'is-active': navIsActive}"
             data-target="navbarExampleTransparentExample">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="navbarExampleTransparentExample" class="navbar-menu" :class="{'is-active': navIsActive}">

        <div class="navbar-end">

          <nuxt-link class="navbar-item" to="/report">Report</nuxt-link>
          <div class="navbar-item has-dropdown is-hoverable" v-if="isAuthenticated">
            <a class="navbar-link">
              {{ loggedInUser.username }}
            </a>
            <div class="navbar-dropdown">
              <a class="navbar-item" @click="logout">Logout</a>
            </div>
          </div>
          <template v-else>
            <nuxt-link class="navbar-item" to="/register">Register</nuxt-link>
            <nuxt-link class="navbar-item" to="/login">Log In</nuxt-link>
          </template>
        </div>

      </div>
    </nav>
    <nuxt/>
  </section>

</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        navIsActive: false
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        loggedInUser: 'auth/loggedInUser'
      })
    },
    methods: {
      toggleMenu: function () {
        this.navIsActive = !this.navIsActive
      },
      async logout() {
        await this.$store.dispatch('auth/LOGOUT')
        this.$router.push('login')
      }
    }
  }
</script>

<style>
  @media screen and (max-width: 1087px){
    .container {
      max-width: 90%;
    }
  }

</style>
