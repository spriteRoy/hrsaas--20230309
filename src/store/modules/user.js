import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
const state = {
  token:getToken()
}
const mutations = {
  setToken(state,token){
    state.token = token
    setToken(token)
  },
  removeToken(state){
    state.token = null
    removeToken()
  }
}


const actions = {
  // 封装登录的actions
  async login(context,data){
    // 已在响应拦截器中解构过了数据
    const result = await login(data) // 拿到token
    context.commit('setToken',result) // 设置token
  }
}

export default  {
  namespaced: true,
  state,
  mutations,
  actions
}