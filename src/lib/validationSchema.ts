import * as z from 'zod';

// Login Validation Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Register Validation Schema
export const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rePassword: z.string(),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone number'),
}).refine((data) => data.password === data.rePassword, {
  message: 'Passwords do not match',
  path: ['rePassword'],
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Verify Reset Code Schema
export const verifyCodeSchema = z.object({
  resetCode: z.string().min(6, 'Reset code must be 6 digits'),
});

// Reset / Change Password Schema
export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyCodeValues = z.infer<typeof verifyCodeSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

// Change Logged User Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
  password: z.string().min(6, 'New password must be at least 6 characters'),
  rePassword: z.string(),
}).refine((data) => data.password === data.rePassword, {
  message: 'Passwords do not match',
  path: ['rePassword'],
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;