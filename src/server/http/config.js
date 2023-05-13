import JSON_BIG from 'json-bigint'
import axios from 'axios'
// const baseUrl = 'https://www.shuoqiudi.app' // 不做代理时默认http请求的URL地址
axios.defaults.headers.post['Content-Type'] = 'application/json'
// axios.defaults.headers.post['Referer'] = 'https://shuoqiudi.live'
axios.defaults.timeout = 20000
axios.defaults.transformResponse = (data) => {
  try {
    return JSON_BIG.parse(data)
  } catch (err) {
    try {
      return JSON.parse(data)
    } catch {
      return data
    }
  }
}
