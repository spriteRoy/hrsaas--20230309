import { getToken, setToken, removeToken } from '@/utils/auth'
import { login,getUserInfo } from '@/api/user'
const state = {
  token:getToken(),
  // 问题：这里为什么定义空对象，为什么不定义null
  // 因为我们要建立用户的快捷访问方式，如果初始值为null,一旦引用了getters，就会报错
  userInfo:{}
}
const mutations = {
  setToken(state,token){
    state.token = token
    setToken(token)
  },
  removeToken(state){
    state.token = null
    removeToken()
  },
  setUserInfo(state,result){
    state.userInfo = result
  },
  removeUserInfo(state){
    state.userInfo = {}
  }
}


const actions = {
  // 封装登录的actions
  async login(context,data){
    // 已在响应拦截器中解构过了数据
    const result = await login(data) // 拿到token
    context.commit('setToken',result) // 设置token
  },
  async getUserInfo(context){
    const result = await getUserInfo()
    context.commit('setUserInfo',result)
    // 问题：这里为什么要返回 为后面埋下伏笔
    return result
  }
}

export default  {
  namespaced: true,
  state,
  mutations,
  actions
}