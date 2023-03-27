import { getToken, setToken, removeToken,setTimeStamp,getTimeStamp } from '@/utils/auth'
import { login,getUserInfo,getUserDetailById } from '@/api/user'
import {resetRouter} from '@/router'
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
    setTimeStamp() // 设置当前时间戳
  },
  async getUserInfo(context){
    const result = await getUserInfo()
    // 获取用户详情 用户的详情
    const baseInfo = await getUserDetailById(result.userId)
    const baseResult = {...result,...baseInfo}
    context.commit('setUserInfo',baseResult)
    // 问题：这里为什么要return呢? 为后期做权限埋下伏笔
    return result
  },
  // 登出操作
  logout(context){
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter() // 重置路由
    // 去设置权限模块下路由为初始状态
    // Vuex子模块怎么调用子模块的action 都没加锁的情况下 可以随意调用
    // 不加命名空间的情况下的 所有的mutations和action都是挂在全局上的 所以可以直接调用
    // 但是加了命名空间的子模块 怎么调用另一个加了命名空间的子模块的mutations
    // 加了命名空间的context指的不是全局的context
    // mutations名称 载荷 payload 第三个参数  { root: true } 调用根级的mutations或者action
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default  {
  namespaced: true,
  state,
  mutations,
  actions
}