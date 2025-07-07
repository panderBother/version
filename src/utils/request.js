import axios from 'axios';
const VITE_BASE_URL='http://101.35.16.42:8080/api/shopping'
const instance=axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || VITE_BASE_URL,// 设置默认的基础URL
  timeout: 5000, // 设置请求超时时间
})
// 添加请求拦截器
instance.interceptors.request.use({

})
// 添加响应拦截器
instance.interceptors.response.use({
  // 处理响应数据
  response: (response) => {
    // 在这里可以对响应数据进行统一处理
    return response.data;
  },
  // 处理响应错误
  error: (error) => {
    // 在这里可以对响应错误进行统一处理
    return Promise.reject(error);
  }
});
export default instance;
// 导出基础URL
export { VITE_BASE_URL }