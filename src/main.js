import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

// 一次性导入所有自定义指令
import * as directives from '@/directives/index'
Object.keys(directives).forEach(key => {
  Vue.directive(key,directives[key])
})


import '@/icons' // icon
import '@/permission' // permission control
import Component from '@/components/index'
// 和ElementUI一样，在全局注册
// Vue.use会调用对象里面的install方法
Vue.use(Component)

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

import * as filters from '@/filters' // 引入工具类
// 注册全局的过滤器
// Object.keys(filters) : 所有方法名称组成的数组
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
