
import { API_CATEGORIES, API_FILES } from './apiUrls';
import axiosInstance from './axiosInstance';

export async function getCategories(values) {
  const res = await axiosInstance.get(API_CATEGORIES, values);
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