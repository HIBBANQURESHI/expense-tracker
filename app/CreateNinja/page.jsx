'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateExpense = () => {
  const [sale, setSale] = useState({
    deliveries: '',
    amount: '',
    paidAmount: '',
    date: ''
  });

  const router = useRouter();

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

    if (sale.paidAmount > sale.amount) {
      toast.error("Paid amount cannot exceed total amount");
      return;
    }

    try {
      await axios.post('https://akc-expense-server.vercel.app/api/ninja', {
        ...sale,
        balance: sale.amount - sale.paidAmount
      });
      toast.success('Delivery created!');
      router.push('/Ninja');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Creation failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">New Delivery</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Deliveries Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Deliveries</label>
            <input
              type="number"
              name="deliveries"
              value={sale.deliveries}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-1"
              required
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="number"
              name="amount"
              value={sale.amount}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-1"
              required
            />
          </div>

          {/* Paid Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
            <input
              type="number"
              name="paidAmount"
              value={sale.paidAmount}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-1"
            />
          </div>

          {/* Balance Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Balance</label>
            <input
              type="number"
              name="balance"
              value={sale.balance || ''}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-gray-50"
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={sale.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
          >
            Create Delivery
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateExpense;