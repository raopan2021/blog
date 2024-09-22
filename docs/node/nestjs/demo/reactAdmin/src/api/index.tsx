// api.js

import axios from "axios"

// 创建一个 Axios 实例
const api = axios.create({
    baseURL: "/api", // 设置基本URL
    timeout: 5000, // 设置超时时间
    // headers: { Authorization: "Bearer " } // 设置请求头
    // headers: { Authorization: "Bearer " + token } // 设置请求头
})

// 添加请求拦截器
api.interceptors.request.use(
    (config) => {
        // 在发送请求之前做一些处理，比如添加loading效果
        return config
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
api.interceptors.response.use(
    (response) => {
        // 对响应数据做一些处理，比如解析响应结果
        return response.data
    },
    (error) => {
        // 对响应错误做些什么
        return Promise.reject(error)
    }
)

export default api