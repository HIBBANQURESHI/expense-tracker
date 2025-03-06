'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateExpense = () => {
  const [sale, setSale] = useState({ deliveries: '', amount: '', amount:'' });
  const { id } = useParams(); 
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchSaleDetails();
    }
  }, [id]);

  const fetchSaleDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/hunger/${id}`);
      if (response.data) {
        setSale(response.data);
      }
    } catch (error) {
      console.error('Error fetching expense details:', error);
      toast.error('Failed to fetch expense details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale({ ...sale, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/hunger/${id}`, sale);
      toast.success('Expense updated successfully');
      router.push('/Hunger');
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Error updating expense');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">Edit Delivery</h2>
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
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-200 text-white font-semibold">
            Update Delivery
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateExpense;
