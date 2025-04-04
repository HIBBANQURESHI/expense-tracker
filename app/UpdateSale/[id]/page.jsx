'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateSale = () => {
  const [sale, setSale] = useState({ name: '', description: '', amount: '', date: '' });
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
        setSale({
          ...response.data,
          date: response.data.date ? formatDate(response.data.date) : '', // Format date for input
        });
      }
    } catch (error) {
      console.error('Error fetching sale details:', error);
    }
  };

  // Function to format the date to MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale({ ...sale, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedSale = {
        ...sale,
        date: new Date(sale.date).toISOString(), // Convert to ISO format for backend
      };
      await axios.put(`https://akc-expense-server.vercel.app/api/sales/${id}`, formattedSale);
      toast.success('Sale updated successfully');
      router.push('/SaleByCash');
    } catch (error) {
      console.error('Error updating sale:', error);
      toast.error('Error updating sale');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">Edit Sale</h2>
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
          <div>
            <label htmlFor="date" className="block text-sm font-medium">Date</label>
            <input
              type="text"
              name="date"
              value={sale.date}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="MM/DD/YYYY"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-200 text-white font-semibold">
            Update Sale
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSale;
