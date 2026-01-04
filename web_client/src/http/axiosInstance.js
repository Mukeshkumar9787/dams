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
  try {
    // Do something before request is sent
    if (window._token) {
      config.headers.authorization = `Bearer ${window._token}`; // eslint-disable-line
    }
  } catch (error) {}
  return config;
}, (error) => {
  // Do something with request error
  Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => {
  return response
}, (error) => {
  try {
    window.alert(error?.response?.data?.message || 'Something went wrong');
  } catch (err) {}
  return  error?.response || { data: { success: false, message: "Something went wrong"}}
});

export default axiosInstance;
