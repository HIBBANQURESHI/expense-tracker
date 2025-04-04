'use client';
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BalanceSheet = () => {
  const [balanceData, setBalanceData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editData, setEditData] = useState({ model: null, id: null, field: '', value: '' });
  const [newOpening, setNewOpening] = useState('');

  const fetchBalance = async (date) => {
    try {
      const utcDate = new Date(date);
      utcDate.setUTCHours(0, 0, 0, 0);
      const dateParam = utcDate.toISOString().split('T')[0];

      const response = await fetch(
        `https://akc-expense-server.vercel.app/api/balance?date=${dateParam}`
      );
      const data = await response.json();
      setBalanceData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const generatePDF = async () => {
    const input = document.getElementById('balance-sheet');
    const canvas = await html2canvas(input);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas, 'JPEG', 10, 10, 190, 0);
    pdf.save(`balance-${selectedDate.toISOString().split('T')[0]}.pdf`);
  };

  const handleUpdate = async () => {
    if (!editData.model || !editData.id || !editData.field) return;
    try {
      await fetch(`https://akc-expense-server.vercel.app/api/balance/${editData.model}/${editData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [editData.field]: parseFloat(editData.value) })
      });
      fetchBalance(selectedDate);
      setEditData({ model: null, id: null, field: '', value: '' });
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const setOpeningBalance = async (e) => {
    e.preventDefault();
    try {
      const normalizedDate = new Date(selectedDate);
      normalizedDate.setHours(0, 0, 0, 0); // Local midnight

      await fetch('https://akc-expense-server.vercel.app/api/balance/opening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(newOpening),
          date: normalizedDate.toISOString() // Send UTC equivalent
        })
      });
      fetchBalance(normalizedDate);
      setNewOpening('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => { fetchBalance(selectedDate); }, [selectedDate]);

  if (!balanceData) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-7xl mx-auto" id="balance-sheet">
      <header className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Financial Dashboard</h1>
          <div className="flex items-center gap-4">
            <DatePicker
              selected={selectedDate}
              onChange={date => {
                const utcDate = new Date(date);
                utcDate.setUTCHours(0, 0, 0, 0);
                setSelectedDate(utcDate);
              }}
              dateFormat="dd MMM yyyy"
              className="bg-white border rounded-lg px-4 py-2 shadow-sm"
            />
            <button onClick={generatePDF} className="bg-white text-gray-600 px-4 py-2 rounded-lg border shadow-sm hover:shadow-md">
              Export PDF
            </button>
          </div>
        </div>

        <form onSubmit={setOpeningBalance} className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">Set Opening Balance</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={newOpening}
                onChange={(e) => setNewOpening(e.target.value)}
                className="border rounded-lg px-4 py-2 flex-1"
                placeholder="Enter amount"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Set
              </button>
            </div>
          </div>
        </form>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Cash Flow</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Opening Balance</span>
                <span className="text-blue-600 font-semibold">SAR {balanceData.openingBalance?.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Cash Inflows</span>
                <span className="text-green-600 font-semibold">SAR {balanceData.inflows?.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Next Day Opening</span>
                <span className="text-purple-600 font-semibold">SAR {balanceData.nextDayOpening?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Deductions</h2>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Expenses</span>
                <span className="text-red-600 font-semibold">SAR {balanceData.expenses?.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Loan Payments</span>
                <span className="text-red-600 font-semibold">SAR {balanceData.loans?.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Receivings</span>
                <span className="text-red-600 font-semibold">SAR {balanceData.receivings?.toLocaleString()}</span>
              </div>
            </div>
            {Object.entries(balanceData.deliveries).map(([service, amount]) => (
              <div key={service} className="bg-red-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{service} Delivery</span>
                  <span className="text-red-600 font-semibold">SAR {amount?.toLocaleString()}</span>
                </div>
              </div>
            ))}
            {Object.entries(balanceData.companies).map(([company, amount]) => (
              <div key={company} className="bg-red-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{company} Deductions</span>
                  <span className="text-red-600 font-semibold">SAR {amount?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
        <div className="bg-emerald-50 p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Current Balance</span>
            <span className={`text-2xl font-bold ${balanceData.currentBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              SAR {balanceData.currentBalance?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {editData.model && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Transaction</h3>
            <input
              type="number"
              value={editData.value}
              onChange={(e) => setEditData(d => ({ ...d, value: e.target.value }))}
              className="w-full border rounded-lg px-4 py-2 mb-4"
              placeholder="New amount"
            />
            <div className="flex gap-3">
              <button onClick={handleUpdate} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Save
              </button>
              <button onClick={() => setEditData({ model: null, id: null, field: '', value: '' })} className="flex-1 bg-gray-200 px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceSheet;