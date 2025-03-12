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
    received: '',
    remaining: '',
    date:''
  });

  const router = useRouter();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newLoan = { ...loan, [name]: value };
  
    if (name === 'amount' || name === 'received') {
      const amount = parseFloat(newLoan.amount) || 0;
      const received = parseFloat(newLoan.received) || 0;
  
      if (received > amount) {
        toast.error('Received amount cannot exceed total loan amount');
        return;
      }
  
      newLoan.remaining = Number(amount - received); // Convert to number
    }
  
    setLoan(newLoan);
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Sending Data:", loan); // Debugging
    
    try {
      const response = await axios.post("http://localhost:4000/api/loan", loan, {
        headers: { "Content-Type": "application/json" },
      });
  
      toast.success("Loan added successfully!");
      router.push("/Loan");
    } catch (error) {
      console.error("Error adding loan:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error adding loan");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-lg bg-gray-800/60 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-white text-center">Add Loan</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={loan.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              value={loan.amount}
              onChange={handleChange}
              placeholder="Enter loan amount"
              className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Received Amount */}
          <div className="mt-4">
            <label htmlFor="received" className="block text-sm font-medium text-gray-300">
              Received Amount
            </label>
            <input
              type="number"
              name="received"
              value={loan.received}
              onChange={handleChange}
              placeholder="Enter received amount"
              className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Remaining Balance (Auto-calculated) */}
          <div className="mt-4">
            <label htmlFor="remaining" className="block text-sm font-medium text-gray-300">
              Remaining Balance
            </label>
            <input
              type="number"
              name="remaining"
              value={loan.remaining}
              placeholder="Enter received amount"
              readOnly
              className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
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
            className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Add Loan
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoan;
