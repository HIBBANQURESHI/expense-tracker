// UpdateLoan.jsx
'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateLoan = () => {
  const [loan, setLoan] = useState({ 
    name: '',
    amount: 0,
    credit: 0,
    balance: 0,
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) fetchLoanDetails();
  }, [id]);

  const fetchLoanDetails = async () => {
    try {
      const response = await axios.get(`https://akc-expense-server.vercel.app/api/brooze/${id}`);
      const data = response.data;
      setLoan({
        name: data.name,
        amount: data.amount,
        credit: data.credit,
        balance: data.balance,
        date: new Date(data.date).toISOString().split('T')[0]
      });
    } catch (error) {
      toast.error('Failed to load loan details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedLoan = { 
      ...loan, 
      [name]: ['amount', 'credit'].includes(name) ? Number(value) : value 
    };

    if (name === 'amount' || name === 'credit') {
      updatedLoan.balance = Number((updatedLoan.amount - updatedLoan.credit).toFixed(2));
    }

    setLoan(updatedLoan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await axios.put(`https://akc-expense-server.vercel.app/api/brooze/${id}`, {
        ...loan,
        date: new Date(loan.date)
      });
      toast.success('Record updated successfully');
      router.push('/Brooze');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Edit Liability Record
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              name="name"
              value={loan.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Liability
            </label>
            <input
              type="number"
              name="amount"
              value={loan.amount}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Payments
            </label>
            <input
              type="number"
              name="credit"
              value={loan.credit}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Balance
            </label>
            <input
              type="number"
              value={loan.balance}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Updated Date
            </label>
            <input
              type="date"
              name="date"
              value={loan.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Update Record'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateLoan;