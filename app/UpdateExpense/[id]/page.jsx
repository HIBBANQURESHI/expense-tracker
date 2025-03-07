'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateExpense = () => {
  const [expense, setExpense] = useState({ 
    name: '', 
    description: '', 
    amount: '', 
    date: '',
    paymentMethod: 'cash' 
  });
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchExpenseDetails();
    }
  }, [id]);

  const fetchExpenseDetails = async () => {
    try {
      const response = await axios.get(`https://akc-expense-server.vercel.app/api/expense/${id}`);
      if (response.data) {
        // Format date to YYYY-MM-DD for date input
        const formattedDate = new Date(response.data.date).toISOString().split('T')[0];
        setExpense({
          ...response.data,
          date: formattedDate
        });
      }
    } catch (error) {
      console.error('Error fetching expense details:', error);
      toast.error('Failed to fetch expense details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://akc-expense-server.vercel.app/api/expense/${id}`, expense);
      toast.success('Expense updated successfully');
      router.push('/Expense');
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Error updating expense');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 p-6">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-lg w-full border border-gray-300">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Edit Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              name="name" 
              value={expense.name} 
              onChange={handleChange} 
              required 
              className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter name"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              name="description" 
              value={expense.description} 
              onChange={handleChange} 
              required 
              className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter description"
              rows="3"
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input 
              type="number" 
              name="amount" 
              value={expense.amount} 
              onChange={handleChange} 
              required 
              className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={expense.paymentMethod}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input 
              type="date" 
              name="date" 
              value={expense.date} 
              onChange={handleChange} 
              required 
              className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 text-white font-semibold shadow-md"
          >
            Update Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateExpense;