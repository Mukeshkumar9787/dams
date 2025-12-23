
import { API_CATEGORIES } from './apiUrls';
import axiosInstance from './axiosInstance';

export async function getCategories(values) {
  const res = await axiosInstance.get(API_CATEGORIES, values);
  return res.data;
}
