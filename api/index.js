import axios from 'axios'

let api = axios
const baseUrl = 'https://f442eaf8c3d1.ngrok-free.app'
const apiUrl = baseUrl + '/api'

api.defaults.baseURL = apiUrl

api.interceptors.request.use(
  function (config) {
    if (['get', 'post'].includes(config.method)) {
      
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // jika error token tidak valid
    if(error.status === 401){
      
    }
    
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default api
export { apiUrl, baseUrl }

