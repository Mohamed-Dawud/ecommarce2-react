import { axiosInstance } from '@/lib/axiosInstance';

export interface IAddress {
  _id?: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export const AddressService = {
  
  async addAddress(data: IAddress) {
    const response = await axiosInstance.post('/addresses', data);
    return response.data;
  },

  
  async getLoggedUserAddresses() {
    const response = await axiosInstance.get('/addresses');
    return response.data;
  },


  async removeAddress(addressId: string) {
    const response = await axiosInstance.delete(`/addresses/${addressId}`);
    return response.data;
  },
};