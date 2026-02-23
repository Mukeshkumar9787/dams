import { STATUS_TYPES } from "@/utils/constants";

export const API_CATEGORIES = '/categories';
export const API_FILES = '/files';
export const API_HSN = '/hsn';
export const API_PRODUCTS = '/products';
export const API_SIZE = '/sizes';
export const API_COLOR = '/colors';
export const API_AUTH = '/auth';
export const API_REGISTER = `${API_AUTH}/register`;
export const API_RESET_PASSWORD = `${API_AUTH}/reset-password`;
export const API_LOGIN = `${API_AUTH}/login`;
export const API_LOGIN_WITH_OTP = `${API_AUTH}/login-with-otp`;
export const API_VERIFY_OTP = `${API_AUTH}/verifyOTP`;
export const API_VERIFY_GOOGLE_TOKEN = `${API_AUTH}/verifyGoogleToken`;
export const API_USERS = '/users';
export const API_USER_INFO = '/users/getUserInfo';
export const API_USER_UPDATE_PROFILE = '/users/updateProfile';
export const API_ADDRESS = '/address';
export const API_ORDERS = '/orders';
export const GET_ACTIVE_API = (API, params) => (params?.status === STATUS_TYPES.ACTIVE) ? `${API}/active` : API ; 
export const API_ADMIN_ORDERS = `${API_ORDERS}/admin`
export const API_PAYMENT_VERIFY = `${API_ORDERS}/payment/verify`;
export const API_CONFIG = '/config';
