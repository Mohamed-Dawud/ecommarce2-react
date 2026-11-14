import { axiosInstance } from '@/lib/axiosInstance';

// دالة مساعدة للتحقق من وجود التوكن
const getToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
};

export const CartService = {
  async getLoggedUserCart() {
    const token = getToken();
    if (!token) return null; 

    try {
      const response = await axiosInstance.get('/cart');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async addToCart(productId: string) {
    const token = getToken();
    if (!token) throw new Error('Please login first to add items to cart');

    const response = await axiosInstance.post('/cart', { productId });
    return response.data;
  },

  async updateCartQuantity(productId: string, count: number) {
    const token = getToken();
    if (!token) throw new Error('Please login first');

    const response = await axiosInstance.put(`/cart/${productId}`, { count });
    return response.data;
  },

  async removeFromCart(productId: string) {
    const token = getToken();
    if (!token) throw new Error('Please login first');

    const response = await axiosInstance.delete(`/cart/${productId}`);
    return response.data;
  },

  async clearCart() {
    const token = getToken();
    if (!token) throw new Error('Please login first');

    const response = await axiosInstance.delete('/cart');
    return response.data;
  },
};