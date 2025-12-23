import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 1000 * 30,
  headers: {
    'content-type': 'application/json',
    'cache-control': 'no-cache',
    'ngrok-skip-browser-warning': 1,
  },
});

axiosInstance.interceptors.request.use((config) => {
  // Do something before request is sent
  if (window._token) {
    config.headers.authorization = `Bearer ${window._token}`; // eslint-disable-line
  }
  return config;
}, (error) => {
  // Do something with request error
  Promise.reject(error);
});

export default axiosInstance;
