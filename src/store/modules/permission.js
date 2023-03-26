// 专门处理权限路由的模块
import {constantRoutes,asyncRoutes} from '@/router' 

const state = {
  routes:constantRoutes, // 路由表，表示当前用户所拥有的所有路由的数组
}
const mutations = {
  // 定义修改routes的mutations
  // payload认为是我们登录成功需要添加的新路由
  setRoutes(state,newRouter){
    // 这么写业务不正确
    // state.routes = [...state.routes,...newRouter]
    state.routes = [...constantRoutes,...newRouter] // 每次都是在静态路由的基础上添加新的路由
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户所拥有的菜单权限
  filterRoutes(context,menus){
    const routes = []
    menus.forEach(key => {
      // key就是表示
      // asyncRoutes找有没有对象中的name属性等于key,如果找不到就没有权限,如果找到了要筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key))
    });
    // 得到的routes是所有模块中满足权限要求的路由数组
    // routes就是当前用户所拥有的动态路由的权限
    context.commit('setRoutes',routes) // 将动态路由提交给mutations
    return routes // 这为什么还要return,state数据是用来显示左侧菜单用的,return 是给路由addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}