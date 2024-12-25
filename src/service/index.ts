import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// 请求拦截
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')
    // 在发送请求之前做些什么
    if (token) {
      config.headers['Xl-Os-Token'] = token
    }
    if (config.method == 'get') {
      config.params.from_mobile = 1
    } else {
      config.data.from_mobile = 1
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 响应拦截
instance.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === 0) {
      // 请求成功
      return data
    }
    // 4xx 是否需要做特殊处理（未登录401，token失效402,找不到页面404）
    if ([401, 402].includes(data.code)) {
      // window.location.href = '/login'
    } else if ([404].includes(data.code)) {
      window.location.href = '/default'
    }
    showToast(data.msg)
  },
  function (err) {
    console.log(err)
    showToast(err)
    return Promise.reject(err)
  },
)

export function GET(url: string, params: object, config?: object) {
  return instance({
    method: 'get',
    url,
    params,
    ...config,
  })
}

export function POST(url: string, data: object, config?: object) {
  return instance({
    method: 'post',
    url,
    data,
    ...config,
  })
}
