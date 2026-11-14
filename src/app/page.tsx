'use client';

import React, { useEffect, useState } from 'react';
import { ProductService } from '@/services/product.service';
import { IProduct } from '@/interfaces/product.interface';
import { useAppDispatch } from '@/redux/hooks';
import { getWishlist } from '@/redux/slices/wishlistSlice';
import ProductCard from '@/components/shared/ProductCard';

export default function Home() {
  const [productsList, setProductsList] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
   
    dispatch(getWishlist());

    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await ProductService.getAllProducts();
        setProductsList(res.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Explore Our Products</h1>
          <p className="text-sm text-gray-500 mt-1">Discover the best items handpicked just for you.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsList.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}