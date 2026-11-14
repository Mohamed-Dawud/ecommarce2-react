import { axiosInstance } from '@/lib/axiosInstance';

export interface IAuthResponse {
  message: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export const AuthService = {
  async register(data: any): Promise<IAuthResponse> {
    const response = await axiosInstance.post('/auth/signup', data);
    return response.data;
  },

  async login(data: any): Promise<IAuthResponse> {
    const response = await axiosInstance.post('/auth/signin', data);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await axiosInstance.post('/auth/forgotPasswords', { email });
    return response.data;
  },

  async verifyResetCode(resetCode: string) {
    const response = await axiosInstance.post('/auth/verifyResetCode', { resetCode });
    return response.data;
  },

  async resetPassword(data: { email: string; newPassword: string }) {
    const response = await axiosInstance.put('/auth/resetPassword', data);
    return response.data;
  },
  async changePassword(data: {
    currentPassword: string;
    password: string;
    rePassword: string;
  }) {
    const response = await axiosInstance.put('/users/changeMyPassword', data);
    return response.data;
  },
};