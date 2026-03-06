
import { API_ADDRESS, API_ADMIN_ORDERS, API_CATEGORIES, API_COLOR, API_CONFIG, API_FILES, API_HSN, API_LOGIN, API_LOGIN_WITH_OTP, API_ORDERS, API_PAYMENT_VERIFY, API_PRODUCTS, API_PRODUCTS_NOTIFY, API_REGISTER, API_RESET_PASSWORD, API_SIZE, API_USER_INFO, API_USER_UPDATE_PROFILE, API_USERS, API_USERS_ROLE, API_VERIFY_GOOGLE_TOKEN, API_VERIFY_OTP, GET_ACTIVE_API } from './apiUrls';
import axiosInstance from './axiosInstance';

export async function getCategories(params) {
  const res = await axiosInstance.get(GET_ACTIVE_API(API_CATEGORIES, params), { params });
  return res?.data || [];
}

export async function createCategory(data) {
  const res = await axiosInstance.post(API_CATEGORIES, data );
  return res.data;
}

export async function uploadFile(data) {
  const res = await axiosInstance.post(API_FILES, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });
  return res.data;
}

export async function getCategoryBySlug(values) {
  const res = await axiosInstance.get(`${API_CATEGORIES}/${values.slug}`, {params: values});
  return res?.data || [];
}

export async function updateCategory(data) {
  const res = await axiosInstance.put(`${API_CATEGORIES}/${data.id}`, data );
  return res.data;
}

export async function deleteCategory(data) {
  const res = await axiosInstance.delete(`${API_CATEGORIES}/${data.id}`);
  return res.data;
}

export async function getProducts(params) {
  const res = await axiosInstance.get(GET_ACTIVE_API(API_PRODUCTS, params),{ params });
  return res?.data || [];
}

export async function createProduct(data) {
  const res = await axiosInstance.post(API_PRODUCTS, data );
  return res.data;
}

export async function getProductBySlug(values) {
  const res = await axiosInstance.get(`${API_PRODUCTS}/${values.slug}`, {params: values});
  return res?.data || [];
}

export async function updateProduct(data) {
  const res = await axiosInstance.put(`${API_PRODUCTS}/${data.id}`, data );
  return res.data;
}

export async function deleteProduct(data) {
  const res = await axiosInstance.delete(`${API_PRODUCTS}/${data.id}`);
  return res.data;
}

export async function notifyProductWhenInStock(productId) {
  const res = await axiosInstance.post(API_PRODUCTS_NOTIFY(productId));
  return res?.data || {};
}

export async function getHsnCodes(params) {
  const res = await axiosInstance.get(API_HSN, { params });
  return res?.data || [];
}

export async function createHsn(data) {
  const res = await axiosInstance.post(API_HSN, data );
  return res.data;
}

export async function getHsnByCode(values) {
  const res = await axiosInstance.get(`${API_HSN}/${values.code}`, values);
  return res?.data || [];
}

export async function updateHsn(data) {
  const res = await axiosInstance.put(`${API_HSN}/${data.id}`, data );
  return res.data;
}

export async function deleteHsn(data) {
  const res = await axiosInstance.delete(`${API_HSN}/${data.id}`);
  return res.data;
}

export async function getSizes(params) {
  const res = await axiosInstance.get(GET_ACTIVE_API(API_SIZE, params), { params });
  return res?.data || [];
}

export async function createSize(data) {
  const res = await axiosInstance.post(API_SIZE, data );
  return res.data;
}

export async function getSizeBySlug(values) {
  const res = await axiosInstance.get(`${API_SIZE}/${values.slug}`, values);
  return res?.data || [];
}

export async function updateSize(data) {
  const res = await axiosInstance.put(`${API_SIZE}/${data.id}`, data );
  return res.data;
}

export async function deleteSize(data) {
  const res = await axiosInstance.delete(`${API_SIZE}/${data.id}`);
  return res.data;
}

export async function getColors(params) {
  const res = await axiosInstance.get(GET_ACTIVE_API(API_COLOR, params), { params });
  return res?.data || [];
}

export async function createColor(data) {
  const res = await axiosInstance.post(API_COLOR, data );
  return res.data;
}

export async function getColorBySlug(values) {
  const res = await axiosInstance.get(`${API_COLOR}/${values.slug}`, values);
  return res?.data || [];
}

export async function updateColor(data) {
  const res = await axiosInstance.put(`${API_COLOR}/${data.id}`, data );
  return res.data;
}

export async function deleteColor(data) {
  const res = await axiosInstance.delete(`${API_COLOR}/${data.id}`);
  return res.data;
}

export async function register(data) {
  const res = await axiosInstance.post(API_REGISTER, data );
  return res.data;
}

export async function login(data) {
  const res = await axiosInstance.post(API_LOGIN, data );
  return res.data;
}

export async function verifyOTP(data) {
  const res = await axiosInstance.post(API_VERIFY_OTP, data );
  return res.data;
}

export async function loginWithOTP(data) {
  const res = await axiosInstance.post(API_LOGIN_WITH_OTP, data );
  return res.data;
}

export async function getUserInfo(data) {
  const res = await axiosInstance.get(API_USER_INFO, data );
  return res.data;
}

export async function resetPassword(data) {
  const res = await axiosInstance.post(API_RESET_PASSWORD, data );
  return res.data;
}

export async function updateProfile(data) {
  const res = await axiosInstance.patch(API_USER_UPDATE_PROFILE, data );
  return res.data;
}

export async function getAddress(data) {
  const res = await axiosInstance.get(API_ADDRESS, { params: data });
  return res.data;
}

export async function createAddress(data) {
  const res = await axiosInstance.post(API_ADDRESS, data );
  return res.data;
}

export async function deleteAddress(id) {
  const res = await axiosInstance.delete(`${API_ADDRESS}/${id}`);
  return res.data;
}

export async function updateAddress(id, data) {
  const res = await axiosInstance.patch(`${API_ADDRESS}/${id}`, data);
  return res.data;
}

export async function createOrder(data) {
  const res = await axiosInstance.post(API_ORDERS, data );
  return res.data;
}

export async function getOrdersForUser(data) {
  const res = await axiosInstance.get(API_ORDERS, {params: data} );
  return res.data;
}

export async function getOrdersForAdmin(data) {
  const res = await axiosInstance.get(API_ADMIN_ORDERS, {params: data} );
  return res.data;
}

export async function getOrderDetailsBySlug(values) {
  const res = await axiosInstance.get(`${API_ORDERS}/${values.slug}`, {params: values});
  return res?.data || [];
}

export async function getOrderDetailsBySlugAdmin(values) {
  const res = await axiosInstance.get(`${API_ORDERS}/${values.slug}/admin`, {params: values});
  return res?.data || [];
}

export async function updateOrderStatusBySlugAdmin(values) {
  const res = await axiosInstance.patch(`${API_ORDERS}/${values.slug}/status/admin`, values);
  return res?.data || [];
}

export async function updateOrderBySlugAdmin(values) {
  const res = await axiosInstance.patch(`${API_ORDERS}/${values.slug}/admin`, values);
  return res?.data || [];
}

export async function verifyPayment(data) {
  const res = await axiosInstance.post(API_PAYMENT_VERIFY, data );
  return res.data;
}

export async function getConfig(values) {
  const res = await axiosInstance.get(API_CONFIG, { params: values});
  return res?.data || [];
}

export async function updateConfig(data) {
  const res = await axiosInstance.put(API_CONFIG, data);
  return res?.data || [];
}

export async function verifyGoogleToken(data) {
  const res = await axiosInstance.post(API_VERIFY_GOOGLE_TOKEN, data);
  return res.data;
}

export async function getUsers(data) {
  const res = await axiosInstance.get(API_USERS, {params: data} );
  return res.data;
}

export async function updateRole(data) {
  const res = await axiosInstance.patch(API_USERS_ROLE, data );
  return res.data;
}

export async function getOrderStats(data) {
  const res = await axiosInstance.get(`${API_ORDERS}/stats`, {params: data} );
  return res.data; 
};
