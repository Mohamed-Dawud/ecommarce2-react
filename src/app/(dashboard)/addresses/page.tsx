'use client';

import React, { useEffect, useState } from 'react';
import { AddressService, IAddress } from '@/services/address.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, MapPin, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<IAddress>({
    name: '',
    details: '',
    phone: '',
    city: '',
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await AddressService.getLoggedUserAddresses();
      setAddresses(res.data || []);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await AddressService.addAddress(formData);
      toast.success('Address added successfully!');
      setFormData({ name: '', details: '', phone: '', city: '' });
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await AddressService.removeAddress(id);
      toast.success('Address removed successfully');
      setAddresses(addresses.filter((item) => item._id !== id));
    } catch (err) {
      toast.error('Failed to remove address');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <MapPin className="text-green-600" /> Manage Shipping Addresses
      </h1>

      {/* Add Address Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
        <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address Label (e.g. Home, Work)</label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Home"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Cairo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <Input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="01012345678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Street Details</label>
            <Input
              type="text"
              required
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="123 Main Street, Apt 4B"
            />
          </div>
          <div className="md:col-span-2 pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" /> {submitting ? 'Adding...' : 'Add Address'}
            </Button>
          </div>
        </form>
      </div>

      {/* User Addresses List */}
      <h2 className="text-xl font-semibold mb-4">Your Saved Addresses</h2>
      {loading ? (
        <div className="text-center py-10 font-semibold">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border text-gray-500">
          No saved addresses found. Add your first address above!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-start">
              <div>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">
                  {addr.name}
                </span>
                <p className="font-bold text-lg mt-2">{addr.city}</p>
                <p className="text-gray-600 text-sm">{addr.details}</p>
                <p className="text-gray-500 text-sm mt-1">Phone: {addr.phone}</p>
              </div>
              <button
                onClick={() => addr._id && handleDeleteAddress(addr._id)}
                className="text-red-500 hover:text-red-700 p-2 transition"
                title="Delete address"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}