'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateSale = () => {
  const [sale, setSale] = useState({ name: '',amount: 0 });
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
      const response = await axios.get(`http://localhost:4000/api/receiving/${id}`);
      if (response.data) {
        setSale({
          name: response.data.name || '',
          amount: response.data.amount || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching sale details:', error);
      toast.error('Failed to fetch sale details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedSale = { ...sale, [name]: name === 'amount' || name === 'received' ? parseFloat(value) || 0 : value };

    // Automatically calculate remaining balance
    if (name === 'amount' || name === 'received') {
      updatedSale.remaining = Number(updatedSale.amount - updatedSale.received);
    }

    setSale(updatedSale);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await axios.put(`http://localhost:4000/api/receiving/${id}`, sale);
      toast.success('Sale updated successfully!');
      router.push('/Receiving');
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
        <h2 className="text-2xl font-semibold mb-4 text-center">Edit Receiving</h2>
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
          <button 
            type="submit" 
            className={`w-full py-2 px-4 rounded-lg transition-all duration-200 text-white font-semibold ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Receiving'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSale;
