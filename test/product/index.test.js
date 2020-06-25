import test from 'ava'
import {Nuxt, Builder} from 'nuxt'
import {resolve} from 'path'

// We keep a reference to Nuxt so we can close
// the server at the end of the test
let nuxt = null
let product = null
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
test('serial 1: create product', async t => {
  let context = {}
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/login', context)
  // региструемся
  await window.$nuxt.$store.dispatch('auth/GET_LOGIN', {'username': 'zty', 'password': 'zty123zty'})
  // создаем объект
  product = await window.$nuxt.$store.dispatch('moneys/CREATE', {'product': 'zty', 'money': '123'})
  t.true(product.status === 201 && product.data.product === 'zty' && product.data.money === 123)
})

test('serial 2: get product', async t => {
  let context = {}
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/login', context)
  // региструемся
  await window.$nuxt.$store.dispatch('auth/GET_LOGIN', {'username': 'zty', 'password': 'zty123zty'})
  let data = await window.$nuxt.$store.dispatch('moneys/GET', product.data)
  t.true(data.data.product === 'zty' && data.data.money === 123)
})

test('serial 3: update product', async t => {
  let context = {}
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/login', context)
  // региструемся
  await window.$nuxt.$store.dispatch('auth/GET_LOGIN', {'username': 'zty', 'password': 'zty123zty'})
  product.data.product = 'test_zty'
  await window.$nuxt.$store.dispatch('moneys/PATCH', product.data)
  try {
    let data = await window.$nuxt.$store.dispatch('moneys/GET', product.data)
    t.true(data.data.product === 'test_zty' && data.data.money === 123)
  } catch (err) {
    t.fail('Not found')
  }
})

test('serial 4: delete product', async t => {
  let context = {}
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/login', context)
  // региструемся
  await window.$nuxt.$store.dispatch('auth/GET_LOGIN', {'username': 'zty', 'password': 'zty123zty'})
  await window.$nuxt.$store.dispatch('moneys/DELETE', product.data)
  try {
    await window.$nuxt.$store.dispatch('moneys/GET', product.data)
    t.fail("it didn't delete")
  } catch (err) {
    t.true(err.response.status === 404)
  }
})

// Close the Nuxt server
test.after('Closing server', t => {
  nuxt.close()
})
