'use client';

import React, { useEffect, useState } from 'react';
import { OrderService } from '@/services/order.service';
import { Package, Calendar, MapPin, Phone, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface IOrder {
  _id: string;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  shippingAddress: {
    details: string;
    city: string;
    phone: string;
  };
  cartItems: Array<{
    count: number;
    price: number;
    product: {
      title: string;
      imageCover: string;
    };
  }>;
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const data = await OrderService.getUserOrders();
      
    
      setOrders(data.data || data || []);
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="font-bold text-xl text-gray-600 animate-pulse">Loading your orders... 📦</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <Package className="w-8 h-8 text-emerald-600" />
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 transition hover:shadow-md">
              {/* رأس الكارد: رقم الطلب والتاريخ والحالة */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-4 border-b gap-3">
                <div>
                  <span className="text-xs text-gray-400 block font-mono">Order ID: {order._id}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    order.isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {order.isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>

              
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 uppercase">
                    {order.paymentMethodType}
                  </span>
                </div>
              </div>

             
              <div className="space-y-3 mb-6">
                {order.cartItems?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                    <img
                      src={item.product?.imageCover}
                      alt={item.product?.title || 'Product image'}
                      className="w-14 h-14 object-cover rounded-xl border"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.product?.title}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.count} | Price: {item.price} EGP</p>
                    </div>
                  </div>
                ))}
              </div>

           
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t gap-4">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{order.shippingAddress?.details}, {order.shippingAddress?.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>{order.shippingAddress?.phone}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Total Amount</span>
                  <span className="text-xl font-black text-emerald-600">{order.totalOrderPrice} EGP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}