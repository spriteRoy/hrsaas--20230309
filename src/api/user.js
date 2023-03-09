import request from '@/utils/request'

export function login(data) {
    const result =  request({
        url:'/sys/login',
        method:'post',
        data
    })
    return result
}

// 获取用户资料接口
export function getUserInfo() {
    return request({
      url: '/sys/profile',
      method: 'post'
    })
}

export function logout() {
  
}
