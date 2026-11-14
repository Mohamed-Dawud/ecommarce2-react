import { axiosInstance } from '@/lib/axiosInstance';

export const OrderService = {
  async createCashOrder(cartId: string, shippingAddress: { details: string; phone: string; city: string }) {
    const response = await axiosInstance.post(`/orders/${cartId}`, { shippingAddress });
    return response.data;
  },

  async createOnlineOrder(
  cartId: string,
  shippingAddress: { details: string; phone: string; city: string },
  returnUrl: string = 'http://localhost:3000'
) {
  const response = await axiosInstance.post(
    `/orders/checkout-session/${cartId}?url=${returnUrl}`,
    { shippingAddress }
  );
  return response.data;
},

 async getUserOrders() {
    const response = await axiosInstance.get(`/orders/`);
    return response.data;
  },
  
};