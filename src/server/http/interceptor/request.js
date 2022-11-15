// 添加请求拦截器
import axios from 'axios'

axios.interceptors.request.use(
  function (config) {
    config.url = '/api' + config.url
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
