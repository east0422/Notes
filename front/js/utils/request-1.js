import axios from 'axios'
import { Message } from 'element-ui'
import { showLoading, hideLoading } from './loading'
import router from '@/router'
import { resetRouter } from '@/router'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers['systemType'] = 'system_info'
const request = options => {
  // 创建服务
  const service = axios.create({
    method: 'post',
    timeout: 15000
  })

  // 临时数据
  const tempOptions = JSON.parse(JSON.stringify(options))
  if (tempOptions.loading === undefined) tempOptions.loading = true

  // 遮罩层显隐
  let loading = tempOptions.loading
  if (tempOptions.data && options.data.loading !== undefined) {
    loading = tempOptions.data.loading
    delete tempOptions.data.loading
  }
  if (tempOptions.params && options.params.loading !== undefined) {
    loading = tempOptions.params.loading
    delete tempOptions.params.loading
  }

  // 请求拦截
  service.interceptors.request.use(
    config => {
      if (loading) showLoading()
      if (sessionStorage.token) config.headers.token = sessionStorage.token
      return config
    },
    error => {
      if (loading) hideLoading()
      return Promise.reject(error)
    }
  )

  // 响应拦截
  service.interceptors.response.use(
    response => {
      if (loading) hideLoading()
      if (response.config.responseType === 'blob') {
        return response
      }
      if (response.data.code === 401) {
        Message.error('登录已超时，请重新登录')
        resetRouter()
        sessionStorage.clear()
        router.push('/404')
        // location.href = location.hostname.indexOf('http') === 0 ? location.hostname : `http://${location.hostname}`
        return
      }
      if (response.data.data === undefined) response.data.data = null
      return response.data
    },
    error => {
      if (loading) hideLoading()
      if (error.response.status === 401) {
        Message.error('登录已超时，请重新登录')
        resetRouter()
        sessionStorage.clear()
        router.push('/404')
        // location.href = location.hostname.indexOf('http') === 0 ? location.hostname : `http://${location.hostname}`
        return
      }
      const data = error.response.data || {}
      return Promise.reject({
        code: error.response.status,
        data: data,
        message: data.message || '网络异常',
        errorMsg: error
      })
    }
  )

  // 发送请求
  return service.request(tempOptions)
}
export default request
