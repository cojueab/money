import test from 'ava'
import {Nuxt, Builder} from 'nuxt'
import {resolve} from 'path'

// We keep a reference to Nuxt so we can close
// the server at the end of the test
let nuxt = null
// Init Nuxt.js and start listening on localhost:4000
test.before('Init Nuxt.js', async t => {
  const rootDir = resolve(__dirname, '../..')
  let config = {}
  try {
    config = require(resolve(rootDir, 'nuxt.config.js'))
  } catch (e) {
  }
  config.rootDir = rootDir // project folder
  config.dev = false // production build
  config.mode = 'universal' // Isomorphic application
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  nuxt.listen(4000, 'localhost')
})

// Example of testing only generated html
test('serial 1: login', async t => {
  let context = {}
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/login', context)
  // региструемся
  await window.$nuxt.$store.dispatch('auth/GET_LOGIN', {'username': 'zty', 'password': 'zty123zty'})
  t.true(window.$nuxt.$store.state.auth.isAuth &&
    window.$nuxt.$store.state.auth.user.username === 'zty' &&
    window.$nuxt.$store.state.auth.token.length > 10 &&
    window.$nuxt.$store.state.auth.refresh_token.length > 10)
})

test('serial 2: get', async t => {
  let context = {}
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/login', context)
  // региструемся
  await window.$nuxt.$store.dispatch('auth/GET_LOGIN', {'username': 'zty', 'password': 'zty123zty'})
  let username = await window.$nuxt.$store.dispatch('auth/GET_USER')
  t.true(username.username === 'zty')
})

test('serial 3: refresh', async t => {
  let context = {}
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/login', context)
  // региструемся
  await window.$nuxt.$store.dispatch('auth/GET_LOGIN', {'username': 'zty', 'password': 'zty123zty'})
  let token = window.$nuxt.$store.state.auth.token
  await window.$nuxt.$store.dispatch('auth/GET_REFRESH')
  t.true(token !== window.$nuxt.$store.state.auth.token)
})

test('serial 4: set refresh', async t => {
  let context = {}
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/login', context)
  // региструемся
  await window.$nuxt.$store.dispatch('auth/GET_LOGIN', {'username': 'zty', 'password': 'zty123zty'})
  await window.$nuxt.$store.dispatch('auth/SET_REFRESH', '123')
  t.true(window.$nuxt.$store.state.auth.refresh_token === '123')
})

test('serial 5: logout', async t => {
  let context = {}
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/login', context)
  // региструемся
  await window.$nuxt.$store.dispatch('auth/GET_LOGIN', {'username': 'zty', 'password': 'zty123zty'})
  await window.$nuxt.$store.dispatch('auth/LOGOUT', '123')
  t.true(window.$nuxt.$store.state.auth.token === '')
})

// Close the Nuxt server
test.after('Closing server', t => {
  nuxt.close()
})
