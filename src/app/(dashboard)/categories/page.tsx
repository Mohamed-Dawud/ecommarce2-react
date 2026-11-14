'use client';

import React, { useEffect, useState } from 'react';
import { CategoryService } from '@/services/category.service';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CategoryService.getAllCategories()
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20 font-semibold">Loading categories...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category._id} href={`/categories/${category._id}`} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white text-center">
            <Image
              src={category.image}
              alt={category.name}
              width={250}
              height={250}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="font-semibold text-lg">{category.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}