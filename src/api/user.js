import request from '@/utils/request'

export function login(data) {
    const result =  request({
        url:'/sys/login',
        method:'post',
        data
    })
    return result
}

export function getInfo(token) {
  
}

export function logout() {
  
}
