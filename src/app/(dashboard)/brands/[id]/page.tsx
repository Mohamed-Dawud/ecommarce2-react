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

// 1. نقلنا المكون الأساسي لجوة هنا
function BrandContent() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [brand, setBrand] = useState<any | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    dispatch(getWishlist());

    async function fetchBrandData() {
      try {
        setLoading(true);
        const [brandRes, prodRes] = await Promise.all([
          CategoryService.getBrandDetails(id as string),
          ProductService.getProductsByBrand(id as string),
        ]);

        setBrand(brandRes.data);
        setProducts(prodRes.data || []);
      } catch (error) {
        console.error('Error fetching brand details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBrandData();
  }, [id, dispatch]);

  if (loading) {
    return <div className="text-center py-20 font-semibold text-lg">Loading brand details...</div>;
  }

  if (!brand) {
    return <div className="text-center py-20 text-red-500 font-semibold">Brand not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-xl shadow-sm border mb-8">
        <Image
          src={brand.image}
          alt={brand.name}
          width={150}
          height={150}
          className="w-32 h-32 object-contain rounded-xl border p-2"
        />
        <div className="text-center md:text-left">
          <span className="text-xs font-semibold text-green-600 uppercase">Official Brand</span>
          <h1 className="text-3xl font-bold mt-1">{brand.name}</h1>
          <p className="text-gray-500 text-sm mt-2">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'} from {brand.name}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Products by {brand.name}</h2>
      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border">
          <p className="text-gray-500">No products available for this brand right now.</p>
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

// 2. الصفحة الرئيسية بتصدر الـ Suspense عشان ترضي Next.js أثناء الـ Build
export default function BrandDetailsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-semibold text-lg">Loading...</div>}>
      <BrandContent />
    </Suspense>
  );
}