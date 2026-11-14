'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {fetchCart, updateQuantity, removeCartItem } from '@/redux/slices/cartSlice';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { cart, loading } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading && !cart) {
    return <div className="text-center py-20 font-semibold text-lg">Loading your cart...</div>;
  }

  if (!cart || cart.numOfCartItems === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products">
          <Button className="bg-green-600 hover:bg-green-700">Explore Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.data.products.map((item: any) => (
            <div key={item._id} className="flex items-center justify-between border p-4 rounded-xl shadow-sm bg-white gap-4">
             <Image
  src={item.product?.imageCover || '/placeholder.png'}
  alt={item.product?.title || 'Product Image'}
  width={100}
  height={100}
  className="object-cover rounded-lg"
/>
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-1">{item.product.title}</h3>
                <p className="text-green-600 font-bold mt-1">${item.price}</p>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => dispatch(updateQuantity({ productId: item.product._id, count: item.count - 1 }))}
                    disabled={item.count <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold">{item.count}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => dispatch(updateQuantity({ productId: item.product._id, count: item.count + 1 }))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Remove Button */}
              <Button
                variant="destructive"
                size="icon"
                onClick={() => dispatch(removeCartItem(item.product._id))}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="border p-6 rounded-xl shadow-sm bg-white h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2 text-gray-600">
            <span>Total Items:</span>
            <span className="font-semibold text-black">{cart.numOfCartItems}</span>
          </div>
          <div className="flex justify-between mb-6 text-gray-600">
            <span>Total Price:</span>
            <span className="font-bold text-green-600 text-xl">${cart.data.totalCartPrice}</span>
          </div>

          <Link href="/checkout">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}