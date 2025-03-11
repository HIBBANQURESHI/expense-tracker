'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateSale = () => {
  const [sale, setSale] = useState({ 
    name: '', 
    description: '', 
    amount: '', 
    date: new Date().toISOString().split('T')[0], // Default to today's date
    paymentMethod: 'cash' 
  });
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchSaleDetails();
    }
  }, [id]);

  const fetchSaleDetails = async () => {
    try {
      const response = await axios.get(`https://akc-expense-server.vercel.app/api/sales/${id}`);
      if (response.data) {
        // Format date for input field
        const formattedDate = new Date(response.data.date).toISOString().split('T')[0];
        setSale({
          ...response.data,
          date: formattedDate
        });
      }
    } catch (error) {
      console.error('Error fetching sale details:', error);
      toast.error('Failed to fetch sale details');
      router.push('/SaleByCash'); // Redirect to sales list on error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://akc-expense-server.vercel.app/api/sales/${id}`, {
        ...sale,
        amount: Number(sale.amount) // Ensure amount is a number
      });
      toast.success('Sale updated successfully');
      router.push('/SaleByCash');
    } catch (error) {
      console.error('Error updating sale:', error.response?.data || error.message);
      toast.error(`Error updating sale: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Edit Sale</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields remain the same, just update class names for better visibility */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={sale.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
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
              required 
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

          <div className="mt-4">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300">
                  Payment Method
              </label>
              <select
                  name="paymentMethod"
                  value={sale.paymentMethod}
                  onChange={handleChange}
                  className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
              >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
              </select>
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
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-200 text-white font-semibold"
          >
            Update Sale
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSale;