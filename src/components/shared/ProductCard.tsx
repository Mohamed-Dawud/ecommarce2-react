'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToWishlist, removeFromWishlist } from '@/redux/slices/wishlistSlice';
import { addProductToCart } from '@/redux/slices/cartSlice';
import { IProduct } from '@/interfaces/product.interface';
import { Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast'; 

export default function ProductCard({ product }: { product: IProduct }) {
  const dispatch = useAppDispatch();
  const { wishlistIds } = useAppSelector((state) => state.wishlist);

  const isWishlisted = wishlistIds.includes(product._id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      await dispatch(removeFromWishlist(product._id));
      toast.error('Removed from wishlist');
    } else {
      await dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist successfully!');
    }
  };

  const handleAddToCart = async () => {
    try {
      await dispatch(addProductToCart(product._id)).unwrap();
      toast.success('Product added to cart successfully! 🛒');
    } catch (err) {
      toast.error('Failed to add product to cart');
    }
  };

  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between bg-white relative group">
      {/* Wishlist Heart Button */}
      <button
        onClick={handleWishlistToggle}
        aria-label="Toggle Wishlist"
        className="absolute top-6 right-6 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition z-10"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
          }`}
        />
      </button>

      <Link href={`/products/${product._id}`}>
        <div className="overflow-hidden rounded-lg mb-4">
          <Image
            src={product.imageCover}
            alt={product.title}
            width={300}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
        <span className="text-xs text-green-600 font-semibold uppercase">
          {product.category?.name}
        </span>
        <h2 className="font-semibold text-lg truncate mt-1" title={product.title}>
          {product.title}
        </h2>

        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-800 font-bold">${product.price}</p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{product.ratingsAverage}</span>
          </div>
        </div>
      </Link>

      <Button
        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={handleAddToCart}
      >
        Add To Cart
      </Button>
    </div>
  );
}