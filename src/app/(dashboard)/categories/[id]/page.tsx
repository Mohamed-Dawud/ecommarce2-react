'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { CategoryService } from '@/services/category.service';
import { ProductService } from '@/services/product.service';
import { IProduct } from '@/interfaces/product.interface';
import { useAppDispatch } from '@/redux/hooks';
import { getWishlist } from '@/redux/slices/wishlistSlice';
import ProductCard from '@/components/shared/ProductCard';
import Image from 'next/image';

// 1. نقلنا كل منطق الصفحة جوه المكون ده
function CategoryContent() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [category, setCategory] = useState<any | null>(null);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    dispatch(getWishlist());

    async function fetchCategoryData() {
      try {
        setLoading(true);
        const [catRes, subCatRes, prodRes] = await Promise.all([
          CategoryService.getCategoryDetails(id as string),
          CategoryService.getSubCategoriesOnCategory(id as string),
          ProductService.getProductsByCategory(id as string),
        ]);

        setCategory(catRes.data);
        setSubCategories(subCatRes.data || []);
        setProducts(prodRes.data || []);
      } catch (error) {
        console.error('Error fetching category details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryData();
  }, [id, dispatch]);

  if (loading) {
    return <div className="text-center py-20 font-semibold text-lg">Loading category details...</div>;
  }

  if (!category) {
    return <div className="text-center py-20 text-red-500 font-semibold">Category not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-xl shadow-sm border mb-8">
        <Image
          src={category.image}
          alt={category.name}
          width={150}
          height={150}
          className="w-32 h-32 object-cover rounded-xl border"
        />
        <div className="text-center md:text-left">
          <span className="text-xs font-semibold text-green-600 uppercase">Category</span>
          <h1 className="text-3xl font-bold mt-1">{category.name}</h1>
          <p className="text-gray-500 text-sm mt-2">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'} in this category
          </p>
        </div>
      </div>

      {subCategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Subcategories</h2>
          <div className="flex flex-wrap gap-2">
            {subCategories.map((sub) => (
              <span
                key={sub._id}
                className="px-4 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-medium"
              >
                {sub.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Products in {category.name}</h2>
      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border">
          <p className="text-gray-500">No products available in this category right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}


export default function CategoryDetailsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-semibold text-lg">Loading...</div>}>
      <CategoryContent />
    </Suspense>
  );
}