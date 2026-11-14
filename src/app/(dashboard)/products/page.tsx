'use client';

import React, { useEffect, useState } from 'react';
import { ProductService } from '@/services/product.service';
import { CategoryService } from '@/services/category.service';
import { IProduct } from '@/interfaces/product.interface';
import { useAppDispatch } from '@/redux/hooks';
import { getWishlist } from '@/redux/slices/wishlistSlice';
import ProductCard from '@/components/shared/ProductCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('default');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getWishlist());

    async function fetchData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          ProductService.getAllProducts(),
          CategoryService.getAllCategories(),
        ]);

        setProducts(prodRes.data || []);
        setFilteredProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dispatch]);

  
  useEffect(() => {
    let result = [...products];


    if (searchQuery.trim() !== '') {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. فلترة بالقسم
    if (selectedCategory !== 'all') {
      result = result.filter((product) => product.category?._id === selectedCategory);
    }

   
    if (sortOption === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'top-rated') {
      result.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, sortOption, products]);

  if (loading) {
    return <div className="text-center py-20 font-semibold text-lg">Loading products...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Products</h1>

   
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

      
        <div className="w-full md:w-1/4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

       
        <div className="w-full md:w-1/4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="default">Sort By: Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="top-rated">Top Rated</option>
          </select>
        </div>
      </div>

      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <p className="text-gray-500 text-lg">No products match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}