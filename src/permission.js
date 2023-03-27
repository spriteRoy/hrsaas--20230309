import router from '@/router/index'
import store from '@/store/index'
import nprogress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式


const whiteList = ['/login','/404']
// 前置路由
router.beforeEach(async (to,from,next) => {
    // console.log(to);
    // 开启进度条
    nprogress.start()
    if (store.getters.token) {
        // 如果有token
        if (to.path === '/login') {
            // 跳到主页
            next('/')
        } else {
            // 获取用户资料
            // 只有放过的时候才获取用户资料
            // 是每次都获取吗
            // 如果当前vuex中有用户资料的id,表示已经有资料了,不需要获取了,如果没有id才需要获取
            if (!store.getters.userId) {
                // 如果没有id表示当前用户资料没有获取过
               const {roles} =  await store.dispatch('user/getUserInfo') // async函数return的内容用await就可以接收到
                // 如果说后续 需要根据用户资料获取数据的话 这里必须改成同步
                // 筛选用户的可用路由
                // actions中函数,默认是Promise对象,调用这个对象,想要获取返回的值,必须加await或者then
                // actions是做异步操作的
                // routesz就是筛选得到的动态路由
                const routes = await store.dispatch('permission/filterRoutes',roles.menus)
                // 动态路由添加到路由表中
                // 将404页面放到整个路由表的最后
                router.addRoutes([...routes,{ path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表
                // 添加完动态路由之后
                next(to.path) // 相当于跳到对应的地址，相当于多做一次跳转，为什么要多做一次跳转呢？
                // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
            }else{
                next()
            }
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