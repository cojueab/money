export default function ({$axios, $snackbar, store}) {
  /**
   * For each request add access-token
   */
  $axios.onRequest(config => {
    if (config.url.indexOf('users') === -1) {
      config.headers['Authorization'] = `Bearer ${store.state.auth.token}`
    }
  })

  /**
   * If error is 401, then try REFRESH, another LOGOUT
   */
  $axios.onResponseError((error) => {
    const request = error.config
    if (error.response && error.response.status === 401 && !request.retry) {
      request.retry = true
      store.dispatch('auth/GET_REFRESH').then((response) => {
        request.headers['Authorization'] = `Bearer ${response}`
        return $axios(request)
      }).catch(async () => {
        await store.dispatch('auth/LOGOUT')
      })
    }
  })
}
