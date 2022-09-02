const baseURL = 'https://twitter-api-2022.herokuapp.com/api'
import axios from 'axios'
import Swal from 'sweetalert2'
// import cookies from "vue-cookies";

export const apiHelper = axios.create({
  baseURL,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
  withCredentials: true //  allow to bring cookie
})


// 使用 axios 提供 interceptors 的方法
// apiHelper.interceptors.request.use(
//   config => {
//     // get token from cookie
//     const token = cookies.get('token');

//     // 如果 token 存在的話，則帶入到 headers 當中
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`
//     }
//     return config
//   },
//   err => Promise.reject(err)
// )

//提示通知
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})