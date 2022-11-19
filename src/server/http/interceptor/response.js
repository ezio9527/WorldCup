// 添加响应拦截器
import axios from 'axios'
import { Toast } from 'vant'

axios.interceptors.response.use(
  function (response) {
    const res = response.data
    if (res.code === '200') {
      return Promise.resolve(res.data)
    } else {
      Toast.fail('操作失败')
      return Promise.reject(res)
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)
