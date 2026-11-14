'use client';

import React, { useEffect, useState } from 'react';
import { ProductService } from '@/services/product.service';
import { CategoryService } from '@/services/category.service';
import { IProduct } from '@/interfaces/product.interface';
import { useAppDispatch } from '@/redux/hooks';
import { getWishlist } from '@/redux/slices/wishlistSlice';
import ProductCard from '@/components/shared/ProductCard';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
   
    dispatch(getWishlist());

    async function fetchHomeData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          ProductService.getAllProducts(),
          CategoryService.getAllCategories(),
        ]);

        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, [dispatch]);

  if (loading) {
    return <div className="text-center py-20 font-semibold text-lg">Loading FreshCart...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
     
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="max-w-xl space-y-4 text-center md:text-left z-10">
          <span className="bg-white/20 text-white text-xs uppercase px-3 py-1 rounded-full font-semibold">
            Super Market Freshness
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Quality Groceries Delivered to Your Door
          </h1>
          <p className="text-green-100 text-sm md:text-base">
            Explore thousands of products with unbeatable prices, secure online payment, and lightning-fast delivery.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-block bg-white text-green-700 font-bold px-6 py-3 rounded-xl shadow hover:bg-green-50 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="mt-8 md:mt-0 relative w-full md:w-[400px] h-[250px] rounded-xl overflow-hidden shadow-md">
          <Image
            src="https://ecommerce.routemisr.com/Route-FreshCart-components/images/slider-image-2.jpeg"
            alt="Fresh Market Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

     
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shop Popular Categories</h2>
          <Link href="/categories" className="text-green-600 font-semibold hover:underline text-sm">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat._id}
              href={`/categories/${cat._id}`}
              className="border rounded-xl p-4 text-center bg-white shadow-sm hover:shadow-md hover:border-green-500 transition group flex flex-col items-center"
            >
              <div className="w-24 h-24 relative mb-3 overflow-hidden rounded-full border">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <h3 className="font-semibold text-sm truncate w-full">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

     
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-green-600 font-semibold hover:underline text-sm">
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}