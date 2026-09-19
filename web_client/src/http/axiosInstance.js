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
    if (isGet && !config.skipGlobalLoader) {
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
  // Dispatch success event to clear offline status if previously offline
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('server-connection-success'));
  }
  return response;
}, (error) => {
  const trackedGet = error?.config?._isTrackedGet;
  if(trackedGet){
    decrementGetRequest();
  }
  try {
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || error.code === 'ERR_CONNECTION_REFUSED';
    const isServerError = error.response && error.response.status >= 500;

    if (isNetworkError || isServerError) {
      const serverMessage = "Unable to connect right now. Please try again later.";
      
      // Dispatch custom event for global ServerOfflineBanner
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('server-connection-error', { 
          detail: { 
            message: serverMessage,
            status: error.response?.status || 'OFFLINE',
            url: error.config?.url
          } 
        }));
      }

      message.error({
        content: serverMessage,
        key: 'server-connection-error',
        duration: 5,
      });

      return {
        data: {
          success: false,
          isServerUnreachable: true,
          message: serverMessage,
        }
      };
    }

    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/signin') {
        redirectToSignIn();
      }
    } else {
      const errorMsg = error?.response?.data?.errors || error?.response?.data?.message || 'Something went wrong';
      message.error(errorMsg);
    }
  } catch (err) {}
  return error?.response || { data: { success: false, message: "Something went wrong" } };
});

export default axiosInstance;
