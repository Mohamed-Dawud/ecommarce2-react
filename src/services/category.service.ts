import { axiosInstance } from '@/lib/axiosInstance';

export const CategoryService = {
  async getAllCategories() {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  async getCategoryDetails(id: string) {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  async getAllBrands() {
    const response = await axiosInstance.get('/brands');
    return response.data;
  },

  async getBrandDetails(id: string) {
    const response = await axiosInstance.get(`/brands/${id}`);
    return response.data;
  },
  async getSubCategoriesOnCategory(categoryId: string) {
    const response = await axiosInstance.get(`/categories/${categoryId}/subcategories`);
    return response.data;
  },
};