'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const BalanceSheet = () => {
  const [balanceData, setBalanceData] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchBalanceSheet = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/balance');
        const data = await response.json();
        setBalanceData(data);
      } catch (error) {
        console.error('Error fetching balance sheet:', error);
      }
    };
    fetchBalanceSheet();
  }, []);

  const handleSetOpeningBalance = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/balance/opening', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(newBalance),
          description
        }),
      });
      if (response.ok) {
        const updatedData = await fetch('http://localhost:4000/api/balance');
        setBalanceData(await updatedData.json());
        setNewBalance('');
        setDescription('');
      }
    } catch (error) {
      console.error('Error setting opening balance:', error);
    }
  };

  if (!balanceData) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-inter max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Balance Sheet</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Opening Balance</h3>
              <p className="text-2xl font-semibold">SAR. {balanceData.openingBalance.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
              <p className={`text-2xl font-semibold ${
                balanceData.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                SAR. {balanceData.currentBalance.toLocaleString()}
              </p>
            </div>
          </div>

          <form onSubmit={handleSetOpeningBalance} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Set New Opening Balance
              </label>
              <input
                type="number"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Description (optional)"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Set Opening Balance
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Cash Flow Breakdown</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Total Cash Inflows</span>
              <span className="text-green-600 font-semibold">
                SAR. {balanceData.inflows.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Total Cash Outflows</span>
              <span className="text-red-600 font-semibold">
                SAR. {balanceData.expenses.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500 text-right">
          Last updated: {new Date(balanceData.lastUpdated).toLocaleString()}
        </div>
      </div>

      <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
        ← Back to Dashboard
      </Link>
    </div>
  );
};

export default BalanceSheet;