'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateSale = () => {
  const [sale, setSale] = useState({ name: '', description: '', amount: 0, credit: 0, balance: 0 });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchSaleDetails();
    }
  }, [id]);

  const fetchSaleDetails = async () => {
    try {
      const response = await axios.get(`https://akc-expense-server.vercel.app/api/kpmg/${id}`);
      if (response.data) {
        setSale({
          name: response.data.name || '',
          description: response.data.description || '',
          amount: response.data.amount || 0,
          received: response.data.credit || 0,
          remaining: response.data.balance || (response.data.amount - response.data.credit) || 0
        });
      }
    } catch (error) {
      console.error('Error fetching sale details:', error);
      toast.error('Failed to fetch sale details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedSale = { ...sale, [name]: name === 'amount' || name === 'credit' ? parseFloat(value) || 0 : value };

    // Automatically calculate remaining balance
    if (name === 'amount' || name === 'credit') {
      updatedSale.remaining = Number(updatedSale.amount - updatedSale.credit);
    }

    setSale(updatedSale);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await axios.put(`https://akc-expense-server.vercel.app/api/kpmg/${id}`, sale);
      toast.success('Sale updated successfully!');
      router.push('/Brooze');
    } catch (error) {
      console.error('Error updating sale:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error updating sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">Edit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <input 
              type="text" 
              name="name" 
              value={sale.name} 
              onChange={handleChange} 
              required 
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <input 
              type="text" 
              name="description" 
              value={sale.description} 
              onChange={handleChange} 
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
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
            <label htmlFor="credit" className="block text-sm font-medium">Credit</label>
            <input 
              type="number" 
              name="credit" 
              value={sale.received} 
              onChange={handleChange} 
              required 
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter received amount"
            />
          </div>
          <div>
            <label htmlFor="balance" className="block text-sm font-medium">Balance</label>
            <input 
              type="number" 
              name="balance" 
              value={sale.remaining} 
              disabled
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <button 
            type="submit" 
            className={`w-full py-2 px-4 rounded-lg transition-all duration-200 text-white font-semibold ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Sale'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSale;
