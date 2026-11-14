import { axiosInstance } from '@/lib/axiosInstance';
import { IProduct } from '@/interfaces/product.interface';

export const ProductService = {
  async getAllProducts(): Promise<{ data: IProduct[] }> {
    const response = await axiosInstance.get('/products');
    return response.data;
  },

  async getProductDetails(id: string): Promise<{ data: IProduct }> {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  async getAllCategories() {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  async getAllBrands() {
    const response = await axiosInstance.get('/brands');
    return response.data;
  },
  async getProductsByCategory(categoryId: string): Promise<{ data: IProduct[] }> {
    const response = await axiosInstance.get(`/products?category[in]=${categoryId}`);
    return response.data;
  },

  async getProductsByBrand(brandId: string): Promise<{ data: IProduct[] }> {
    const response = await axiosInstance.get(`/products?brand=${brandId}`);
    return response.data;
  },
  
};