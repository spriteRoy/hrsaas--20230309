import axios from 'axios'
import store from '@/store'
import router from '@/router/index'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间
// 创建请求实例
const service = axios.create({
    baseURL:process.env.VUE_APP_BASE_API,
    timeout:5000
})

// 创建请求拦截器
service.interceptors.request.use(config => {
    // config是请求的配置信息
    // 注入token
    if (store.getters.token) {
        // token失效的主动介入
        if (IsCheckTimeOut()) {
            store.dispatch('user/logout')
            router.push('/login')
            return Promise.reject(new Error('token超时了'))
        }
        // 只有在有token的情况下，才有必要检查时间戳是否超时
        config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    // 问题：必须要返回token
    return config
},error => {
    return Promise.reject(error)
})
// 创建响应拦截器
service.interceptors.response.use(response => {
    const { success,message,data } = response.data
    if (success) {
        return data
    }else{
        Message.error(message)
        console.log(new Error(message));
        return Promise.reject(new Error(message))
    }
},error =>{
    console.log(JSON.stringify(error));
    console.error('123')
    Message.error(error.message)
    // 返回执行错误，让当前的执行链跳出成功，直接进入catch
    return Promise.reject(error)
})
// login().then().catch()

// 是否超时
// 超时逻辑 当前时间 - 缓存中的时间 是否大于时间差
function IsCheckTimeOut(){
    let currentTime = Date.now() // 当前时间戳
    let timeStamp = getTimeStamp() // 缓存时间戳
    return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service
