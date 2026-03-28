import { getStoredToken, redirectToSignIn } from '@/utils/helper';
import axios from 'axios';
import { message } from 'antd';
import { decrementGetRequest, incrementGetRequest } from './apiLoader';

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
    const token = getStoredToken();
    if (token) {
      config.headers.authorization = `Bearer ${token}`; // eslint-disable-line
    }
    const isGet = config.method?.toLowerCase() === "get";
    if (isGet) {
      incrementGetRequest();
      config._isTrackedGet = true;
    }
  } catch (error) {}
  return config;
}, (error) => {
  // Do something with request error
  Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => {
  const trackedGet = response?.config?._isTrackedGet;
  if(trackedGet){
    decrementGetRequest();
  }
  return response
}, (error) => {
  const trackedGet = error?.config?._isTrackedGet;
  if(trackedGet){
    decrementGetRequest();
  }
  try {
    if(error.status === 401){
      if(window.location.pathname !== '/signin'){
        redirectToSignIn();
      }
    }else{
      message.error(error?.response?.data?.errors || error?.response?.data?.message || 'Something went wrong');
    }
  } catch (err) {}
  return  error?.response || { data: { success: false, message: "Something went wrong"}}
});

export default axiosInstance;
