import axios from 'axios'
import { Message } from 'element-ui'
// 创建请求实例
const service = axios.create({
    baseURL:process.env.VUE_APP_BASE_API,
    timeout:5000
})

// 创建请求拦截器
service.interceptors.request.use()
// 创建响应拦截器
service.interceptors.response.use(response => {
    const { success,message,data } = response.data
    if (success) {
        return data
    }else{
        Message.error(message)
        return Promise.reject(new Error(message))
    }
},error =>{
    Message.error(error.message)
    // 返回执行错误，让当前的执行链跳出成功，直接进入catch
    return Promise.reject(error)
})
// login().then().catch()
export default service
