// 全局组件注册的入口，负责所有全局自定义组件的注册
import PageTools from './PageTools'
export default{
    // install方法会拿到Vue的全局对象
    install(Vue){
        // 组件的注册
        Vue.component('PageTools',PageTools)
    }
}