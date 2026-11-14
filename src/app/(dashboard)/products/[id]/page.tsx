'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductService } from '@/services/product.service';
import { IProduct } from '@/interfaces/product.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addProductToCart } from '@/redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/redux/slices/wishlistSlice';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

function ProductDetailsContent() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { wishlistIds } = useAppSelector((state) => state.wishlist);

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');

  const isWishlisted = product ? wishlistIds.includes(product._id) : false;

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        setNotFound(false);

        const response = await ProductService.getProductDetails(id as string);
        const prodData = response.data;
        
        setProduct(prodData);
        if (prodData?.imageCover) {
          setActiveImage(prodData.imageCover);
        }
      } catch (error: any) {
        console.error('Error fetching product details:', error);
        if (error.response && error.response.status === 404) {
          setNotFound(true);
        } else {
          toast.error('Failed to load product details');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await dispatch(addProductToCart(product._id)).unwrap();
      toast.success('Product added to cart successfully! 🛒');
    } catch (err) {
      toast.error('Failed to add product to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    if (isWishlisted) {
      await dispatch(removeFromWishlist(product._id));
      toast.error('Removed from wishlist');
    } else {
      await dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist successfully!');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 font-semibold text-lg text-gray-600">
        Loading product details...
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Product Not Found</h2>
        <p className="text-gray-500">The product you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-10 rounded-2xl border shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="relative h-[350px] md:h-[450px] rounded-xl overflow-hidden border bg-gray-50">
            <Image
              src={activeImage || product.imageCover}
              alt={product.title}
              fill
              className="object-contain p-4"
              priority
            />
          </div>
          
          {product.images && product.images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[product.imageCover, ...product.images].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-lg border overflow-hidden flex-shrink-0 transition ${
                    activeImage === img ? 'ring-2 ring-green-600 border-transparent' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
              {product.category?.name}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-900">{product.title}</h1>
            
            <div className="flex items-center gap-4 mt-3">
              <span className="text-2xl font-bold text-gray-900">${product.price}</span>
              <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-md text-sm border border-yellow-200">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-700">{product.ratingsAverage}</span>
              </div>
            </div>

            <p className="text-gray-600 mt-6 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-8 pt-6 border-t">
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-base font-semibold flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingCart className="w-5 h-5" />
              Add To Cart
            </Button>

            <button
              onClick={handleWishlistToggle}
              aria-label="Wishlist Toggle"
              className={`p-4 rounded-xl border transition flex items-center justify-center ${
                isWishlisted
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 font-semibold text-lg">Loading...</div>}>
      <ProductDetailsContent />
    </Suspense>
  );
}