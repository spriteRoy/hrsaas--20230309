import router from '@/router/index'
import store from '@/store/index'
import nprogress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式


const whiteList = ['/login','/404']
// 前置路由
router.beforeEach((to,from,next) => {
    console.log(to);
    // 开启进度条
    nprogress.start()
    if (store.getters.token) {
        // 如果有token
        if (to.path === '/login') {
            // 跳到主页
            next('/')
        } else {
            next()
        }
    }else{
        // 如果没有token 判断要去的地址是否在白名单里面
        if ( whiteList.indexOf(to.path) > -1 ) {
            next()
        }else{
            next('/login')
        }
    }
    nprogress.done()
})

// 后置路由
router.afterEach(() => {
    // 关闭进度条
    nprogress.done()
})