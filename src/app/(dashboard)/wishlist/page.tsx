'use client';

import React, { useEffect, useState } from 'react';
import { WishlistService } from '@/services/wishlist.service';
import { useAppDispatch } from '@/redux/hooks';
import { addProductToCart } from '@/redux/slices/cartSlice';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const fetchWishlist = async () => {
    try {
      const response = await WishlistService.getWishlist();
      setWishlist(response.data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await WishlistService.removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-semibold text-lg">Loading your wishlist...</div>;
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-600">Save items you love to your wishlist and review them anytime.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product: any) => (
          <div key={product._id} className="border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between">
            <div>
              <Image
                src={product.imageCover}
                alt={product.title}
                width={300}
                height={300}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
              <p className="text-green-600 font-bold mt-1">${product.price}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => dispatch(addProductToCart(product._id))}
              >
                Add To Cart
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveFromWishlist(product._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}