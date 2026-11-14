'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyCodeSchema, VerifyCodeValues } from '@/lib/validationSchema';
import { AuthService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyCodePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeValues>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const onSubmit = async (data: VerifyCodeValues) => {
    try {
      setLoading(true);
      setError(null);
      await AuthService.verifyResetCode(data.resetCode);
      
      // Redirect to Reset Password page upon successful verification
      router.push('/reset-password');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired reset code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">Verify Reset Code</h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Please enter the 6-digit verification code sent to your email
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Verification Code</label>
            <Input
              type="text"
              maxLength={6}
              {...register('resetCode')}
              placeholder="e.g. 123456"
              className="text-center tracking-widest text-lg font-semibold"
            />
            {errors.resetCode && (
              <p className="text-red-500 text-xs mt-1">{errors.resetCode.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={loading}
          >
            {loading ? 'Verifying Code...' : 'Verify Code'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Didn't receive the code?{' '}
          <Link href="/forgot-password" className="text-green-600 font-semibold hover:underline">
            Resend Email
          </Link>
        </p>
      </div>
    </div>
  );
}