'use client';

import React, { useEffect, useState } from 'react';
import { CategoryService } from '@/services/category.service';
import Image from 'next/image';
import Link from 'next/link';

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        const response = await CategoryService.getAllBrands();
        setBrands(response.data || []);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

  if (loading) {
    return <div className="text-center py-20 font-semibold text-lg">Loading brands...</div>;
  }

  if (!brands || brands.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">No Brands Found</h2>
        <p className="text-gray-600">There are no brands available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">All Brands</h1>
        <p className="text-gray-500 text-sm">Explore your favorite brands and discover their products</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand._id}
            href={`/brands/${brand._id}`}
            className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md hover:border-green-500 transition group flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 relative mb-3 overflow-hidden rounded-full border p-2 flex items-center justify-center">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                className="object-contain group-hover:scale-110 transition duration-300 p-2"
              />
            </div>
            <h3 className="font-semibold text-sm truncate w-full text-gray-800">{brand.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}