'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCart } from '@/redux/slices/cartSlice';
import { getWishlist } from '@/redux/slices/wishlistSlice';
import { ShoppingCart, Heart, MapPin, Package, LogOut, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { numOfCartItems } = useAppSelector((state) => state.cart);
  const { wishlistIds } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(getWishlist());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-green-600">
          <Store className="w-7 h-7" />
          <span>FreshCart</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-gray-700 text-sm">
          <Link href="/" className="hover:text-green-600 transition">Home</Link>
          <Link href="/products" className="hover:text-green-600 transition">Products</Link>
          <Link href="/categories" className="hover:text-green-600 transition">Categories</Link>
          <Link href="/brands" className="hover:text-green-600 transition">Brands</Link>
        </nav>

        {/* Right Actions (Cart, Wishlist, Addresses, Orders, Logout) */}
        <div className="flex items-center gap-3">
          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative p-2 rounded-full hover:bg-gray-100 transition text-gray-700"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative p-2 rounded-full hover:bg-gray-100 transition text-gray-700"
          >
            <ShoppingCart className="w-5 h-5" />
            {numOfCartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {numOfCartItems}
              </span>
            )}
          </Link>

          {/* Addresses Quick Link */}
          <Link
            href="/addresses"
            aria-label="Addresses"
            className="p-2 rounded-full hover:bg-gray-100 transition text-gray-700 hidden sm:block"
            title="Manage Addresses"
          >
            <MapPin className="w-5 h-5" />
          </Link>

          {/* Orders Quick Link */}
          <Link
            href="/allorders"
            aria-label="My Orders"
            className="p-2 rounded-full hover:bg-gray-100 transition text-gray-700 hidden sm:block"
            title="My Orders"
          >
            <Package className="w-5 h-5" />
          </Link>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}