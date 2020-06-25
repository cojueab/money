let defaultState = {
  isAuth: false,
  user: '',
  token: '',
  refresh_token: ''
}

export const state = () => defaultState

export const mutations = {
  login(state, obj) {
    state.isAuth = obj.isAuth
    state.user = obj.user
    state.token = obj.token
    state.refresh_token = obj.refresh_token
  },
  token(state, token) {
    state.token = token
  },
  reshtoken(state, token) {
    state.refresh_token = token
  }
}

export const getters = {
  isAuthenticated(state) {
    return state.isAuth
  },

  loggedInUser(state) {
    return state.user
  },

  token(state) {
    return state.token
  }
}

export const actions = {
  async GET_LOGIN({commit, dispatch, state}, products) {
    let {data} = await this.$axios.post(`https://skeletpingvina.xyz/api/auth/token/obtain/`, products)
    commit('token', data['access'])
    let username = await dispatch('GET_USER', data['access'])
    commit('login', {
      isAuth: true,
      user: username,
      token: data['access'],
      refresh_token: data['refresh']
    })
  },
  async GET_USER({commit, state}, token) {
    let {data} = await this.$axios.get(`https://skeletpingvina.xyz/api/auth/login`)
    return data
  },
  async GET_REFRESH({commit, dispatch, state}) {
    if (state.refresh_token !== '') {
      let {data} = await this.$axios.post(`https://skeletpingvina.xyz/api/auth/token/refresh/`, {
        'refresh': state.refresh_token
      })
      commit('login', {
        isAuth: true,
        user: state.user,
        token: data['access'],
        refresh_token: state.refresh_token
      })
      return data['access']
    }
  },
  async SET_REFRESH({commit, dispatch, state}, token) {
    await commit('reshtoken', token)
  },
  async LOGOUT({commit}) {
    await commit('login', defaultState)
  }
}
