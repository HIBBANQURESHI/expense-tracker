'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateLoan = () => {
  const [loan, setLoan] = useState({
    name: '',
    amount: '',
    credit: '',
    balance: 0,
    date: '',
  });

  const router = useRouter();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newLoan = { ...loan, [name]: value };

    if (name === 'amount' || name === 'credit') {
      const amount = parseFloat(newLoan.amount) || 0;
      const credit = parseFloat(newLoan.credit) || 0;

      if (credit > amount) {
        toast.error('Credit amount cannot exceed total loan amount');
        return;
      }

      newLoan.balance = amount - credit; // Auto-update balance
    }

    setLoan(newLoan);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loan.date) {
      toast.error('Please select a date');
      return;
    }

    console.log('Sending Data:', loan); // Debugging

    try {
      await axios.post("https://akc-expense-server.vercel.app/api/brooze", loan, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("added successfully!");
      router.push("/Brooze");
    } catch (error) {
      console.error("Error adding loan:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error adding");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Add</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={loan.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={loan.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Credit */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Credit</label>
            <input
              type="number"
              name="credit"
              value={loan.credit}
              onChange={handleChange}
              placeholder="Enter credit amount"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Balance (Auto-calculated) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Balance</label>
            <input
              type="number"
              name="balance"
              value={loan.balance}
              placeholder="Auto-calculated balance"
              readOnly
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 shadow-sm"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={loan.date}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoan;
