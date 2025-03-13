'use client';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CardBalance = () => {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', amount: '', type: 'debit' });
  const [totals, setTotals] = useState({ credits: 0, debits: 0, balance: 0 });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchEntries();
  }, [startDate, endDate, typeFilter]);

  const fetchEntries = async () => {
    const params = new URLSearchParams();
    if(startDate) params.append('startDate', startDate.toISOString());
    if(endDate) params.append('endDate', endDate.toISOString());
    if(typeFilter !== 'all') params.append('type', typeFilter);
    
    const response = await fetch(`http://localhost:4000/api/card-balance?${params}`);
    const data = await response.json();
    setEntries(data.entries);
    setTotals({ credits: data.credits, debits: data.debits, balance: data.balance });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:4000/api/card-balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount) })
    });
    setFormData({ name: '', description: '', amount: '', type: 'debit' });
    fetchEntries();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:4000/api/card-balance/${id}`, { method: 'DELETE' });
    fetchEntries();
  };

  const generatePDF = async () => {
    const input = document.getElementById('transactions-list');
    const canvas = await html2canvas(input);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    pdf.setFontSize(18);
    pdf.text('Card Balance Report', 15, 15);
    pdf.setFontSize(12);
    pdf.text(`Period: ${startDate?.toLocaleDateString() || 'All'} - ${endDate?.toLocaleDateString() || 'All'}`, 15, 25);
    pdf.text(`Balance: SAR ${totals.balance.toLocaleString()}`, 15, 35);
    
    pdf.addImage(canvas, 'JPEG', 10, 45, 190, 0);
    pdf.save('card-balance-report.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Card Balance Sheet</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            placeholderText="Start Date"
            className="p-2 border rounded-lg w-36"
          />
          <span className="text-gray-500">to</span>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            placeholderText="End Date"
            className="p-2 border rounded-lg w-36"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="p-2 border rounded-lg w-36"
        >
          <option value="all">All Types</option>
          <option value="credit">Credits</option>
          <option value="debit">Debits</option>
        </select>
        <button
          onClick={generatePDF}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Total Credits</div>
          <div className="text-2xl font-semibold text-green-600">SAR {totals.credits.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Total Debits</div>
          <div className="text-2xl font-semibold text-red-600">SAR {totals.debits.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Current Balance</div>
          <div className={`text-2xl font-semibold ${totals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            SAR {totals.balance.toLocaleString()}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full p-2 border rounded-lg"
            >
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Add Entry
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden" id="transactions-list">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>
        <div className="divide-y">
          {entries.map((entry) => (
            <div key={entry._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{entry.name}</div>
                  <div className="text-sm text-gray-500">{entry.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-right ${entry.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="font-semibold">SAR {entry.amount.toLocaleString()}</div>
                    <div className="text-sm capitalize">{entry.type}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardBalance;