'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateExpense = () => {
  const [sale, setSale] = useState({ 
    deliveries: '', 
    amount: '', 
    paidAmount: '',
    balance: '',
    date: '' 
  });
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) fetchSaleDetails();
  }, [id]);

  const fetchSaleDetails = async () => {
    try {
      const { data } = await axios.get(`https://akc-expense-server.vercel.app/api/keeta/${id}`);
      setSale({
        ...data,
        date: new Date(data.date).toISOString().split('T')[0]
      });
    } catch (error) {
      toast.error('Failed to load details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = ['deliveries', 'amount', 'paidAmount'].includes(name)
      ? Number(value)
      : value;

    setSale(prev => {
      const updated = { ...prev, [name]: numericValue };
      if (name === 'amount' || name === 'paidAmount') {
        updated.balance = (updated.amount || 0) - (updated.paidAmount || 0);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://akc-expense-server.vercel.app/api/keeta/${id}`, {
        ...sale,
        balance: sale.amount - sale.paidAmount
      });
      toast.success('Updated successfully');
      router.push('/Keeta');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Delivery</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mt-4">
            <label htmlFor="deliveries" className="block text-sm font-medium text-gray-300">
              Deliveries
            </label>
            <input
              type="number"
              name="deliveries"
              value={sale.deliveries}
              onChange={handleChange}
              placeholder="Enter number of deliveries"
              className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium">Amount</label>
            <input 
              type="number" 
              name="amount" 
              value={sale.amount} 
              onChange={handleChange} 
              required 
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium">Date</label>
            <input 
              type="date" 
              name="date" 
              value={sale.date} 
              onChange={handleChange} 
              required 
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
          >
            Update Delivery
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateExpense;