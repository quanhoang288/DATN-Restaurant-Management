import axios from 'axios'
import { API_BASE_URL } from '../configs'

console.log(API_BASE_URL)

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 300 * 1000
})

axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 400) {
        // handle bad request error
      } else if (error.response.status === 401) {
        // handle unauthorized error
      } else if (error.response.status === 404) {
        // handle not found error
      } else if (error.response.status === 500) {
        // handle server error
      }
    } else {
      return Promise.reject(error)
    }
  }
)

export default axiosClient
