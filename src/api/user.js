import request from '@/utils/request'

export function login(data) {
    const result = request({
        url: '/sys/login',
        method: 'post',
        data
    })
    return result
}

// 获取用户基本资料接口
export function getUserInfo() {
    return request({
        url: '/sys/profile',
        method: 'post'
    })
}

// 根据用户id获取用户的详情
export function getUserDetailById(id) {
    return request({
        url: `/sys/user/${id}`
    })
}

export function logout() {

}
