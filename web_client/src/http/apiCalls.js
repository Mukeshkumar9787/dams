
import { API_CATEGORIES, API_FILES, API_HSN } from './apiUrls';
import axiosInstance from './axiosInstance';

export async function getCategories(params) {
  const res = await axiosInstance.get(API_CATEGORIES, { params });
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
  const res = await axiosInstance.get(`${API_CATEGORIES}/${values.slug}`, values);
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

export async function getProducts(values) {
  const res = await axiosInstance.get(API_CATEGORIES, values);
  return res?.data || [];
}

export async function createProduct(data) {
  const res = await axiosInstance.post(API_CATEGORIES, data );
  return res.data;
}

export async function getProductBySlug(values) {
  const res = await axiosInstance.get(`${API_CATEGORIES}/${values.slug}`, values);
  return res?.data || [];
}

export async function updateProduct(data) {
  const res = await axiosInstance.put(`${API_CATEGORIES}/${data.id}`, data );
  return res.data;
}

export async function deleteProduct(data) {
  const res = await axiosInstance.delete(`${API_CATEGORIES}/${data.id}`);
  return res.data;
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