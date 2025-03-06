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
    date:''
  });

  const router = useRouter();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSale({
      ...sale,
      [name]: name === 'deliveries' || name === 'amount' ? Number(value) : value // Convert to Number
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure both fields are filled
    if (!sale.deliveries || !sale.amount) {
      toast.error("All fields are required!");
      return;
    }

    console.log("Data before sending:", sale); // Debugging

    try {
      await axios.post('http://localhost:4000/api/noon', sale);
      toast.success('Delivery created successfully!');
      router.push('/Noon');
    } catch (error) {
      console.error('Error Creating Delivery:', error.response?.data || error);
      toast.error(error.response?.data?.error || 'Error Creating Delivery');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-lg bg-gray-800/60 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-white text-center">Add Delivery</h2>
        <form onSubmit={handleSubmit} className="mt-6">

          {/* Deliveries (Number Input) */}
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

          {/* Amount (Number Input) */}
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

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={sale.date}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Add Delivery
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateExpense;
