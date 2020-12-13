// 基于 axios 封装的请求模块
import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 通过插件机制获取到上下文对象
export default ({ store }) => {
  // 请求拦截器，可以在拦截器中做公共业务处理，比如说统一设置token
  request.interceptors.request.use(function(config) {
    const { user } = store.state
    if(user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }

    return config
  },function(err){
    return Promise.reject(err)
  })
}