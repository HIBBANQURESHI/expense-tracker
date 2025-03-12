// CreateLoan.jsx
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newLoan = { ...loan, [name]: value };

    if (name === 'amount' || name === 'credit') {
      const amount = parseFloat(newLoan.amount) || 0;
      const credit = parseFloat(newLoan.credit) || 0;

      if (credit > amount) {
        toast.error('Payment cannot exceed total liability');
        return;
      }

      newLoan.balance = (amount - credit).toFixed(2);
    }

    setLoan(newLoan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loan.date) {
      toast.error('Please select a date');
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/brooze", {
        ...loan,
        amount: parseFloat(loan.amount),
        credit: parseFloat(loan.credit),
        balance: parseFloat(loan.balance),
        date: new Date(loan.date)
      });

      toast.success("Liability record created!");
      router.push("/Brooze");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating record");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          New Liability Record
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              name="name"
              value={loan.name}
              onChange={handleChange}
              placeholder="Enter client name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Liability
              <span className="text-xs text-gray-500 ml-2">(Initial amount)</span>
            </label>
            <input
              type="number"
              name="amount"
              value={loan.amount}
              onChange={handleChange}
              placeholder="Enter total amount"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Payment
              <span className="text-xs text-gray-500 ml-2">(If any)</span>
            </label>
            <input
              type="number"
              name="credit"
              value={loan.credit}
              onChange={handleChange}
              placeholder="Enter payment amount"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remaining Balance
            </label>
            <input
              type="number"
              name="balance"
              value={loan.balance}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="date"
              value={loan.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Create Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoan;