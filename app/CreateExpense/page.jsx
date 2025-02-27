'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateExpense = () => {
  const [sale, setSale] = useState({ name: '', description: '', amount: '' });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale({ ...sale, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://akc-expense-server.vercel.app/api/expense', sale);
      toast.success('Expense added successfully!');
      router.push('/Expense');
    } catch (error) {
      console.error('Error Adding Expense:', error);
      toast.error('Failed to add expense');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">New Expense</h2>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Expense Name</label>
            <input
              type="text"
              name="name"
              value={sale.name}
              onChange={handleChange}
              placeholder="Enter expense name"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={sale.description}
              onChange={handleChange}
              placeholder="Enter details"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="3"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={sale.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateExpense;