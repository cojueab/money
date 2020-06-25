

let defaultState = {
  url: 'https://skeletpingvina.xyz/money/test/moneys/',
  data: [],
  format: 'json'
}




export const state = () => defaultState




export const actions = {
  async PATCH({state}, obj) {
    this.$axios.patch(`${state.url}${obj.pk}/?ordering=product`, obj)
  },
  async CREATE({state}, obj) {
    return this.$axios.post(state.url, obj)
  },
  async GET({state}, obj) {
    return this.$axios.get(`${state.url}${obj.pk}/?ordering=product`)
  },
  async DELETE({state}, obj) {
    await this.$axios.delete(`${state.url}${obj.pk}/?ordering=product`)
  }
}
