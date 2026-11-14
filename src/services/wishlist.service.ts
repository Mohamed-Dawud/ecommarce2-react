import { axiosInstance } from '@/lib/axiosInstance';


const getToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
};

export const WishlistService = {
  async getWishlist() {
    const token = getToken();
    if (!token) return null; 

    try {
      const response = await axiosInstance.get('/wishlist');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async addToWishlist(productId: string) {
    const token = getToken();
    if (!token) throw new Error('Please login first to add items to wishlist');

    const response = await axiosInstance.post('/wishlist', { productId });
    return response.data;
  },

  async removeFromWishlist(productId: string) {
    const token = getToken();
    if (!token) throw new Error('Please login first');

    const response = await axiosInstance.delete(`/wishlist/${productId}`);
    return response.data;
  },
};