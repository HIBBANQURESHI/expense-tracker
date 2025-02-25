'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateExpense = () => {
  const [sale, setSale] = useState({
    description: '',
    amount: ''
  });

  const router = useRouter();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale({ ...sale, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/brooze', sale);
        toast.success('Expense created successfully!');
        router.push('/Brooze');
    } catch (error) {
          console.error('Error Creating Expense:', error);
          toast.error('Error Creating Expense');
        }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-lg bg-gray-800/60 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-white text-center">Brooze Company</h2>
        <form onSubmit={handleSubmit} className="mt-6">
            
          {/* Description */}
          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={sale.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows="4"
              required
            />
          </div>

          {/* Amount */}
          <div className="mt-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={sale.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateExpense;
