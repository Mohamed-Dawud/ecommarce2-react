'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validationSchema';
import { AuthService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);
      const response = await AuthService.login(data);
      
      if (response && response.token) {
        // Save token in LocalStorage
        localStorage.setItem('userToken', response.token);
        toast.success('Login successful!');
        
        // Full reload redirect to Homepage to refresh navbar & cart state safely
        window.location.href = '/';
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Something went wrong, please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-black text-center text-gray-900 mb-6">
          Login to FreshCart
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input type="email" {...register('email')} placeholder="name@example.com" />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{String(errors.email.message)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input type="password" {...register('password')} placeholder="••••••••" />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>
            )}
          </div>

          <div className="flex justify-end items-center text-sm">
            <Link href="/forgot-password" className="text-emerald-600 hover:underline font-medium">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-emerald-600 font-semibold hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}