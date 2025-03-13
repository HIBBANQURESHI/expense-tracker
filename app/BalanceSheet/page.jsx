'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BalanceSheet = () => {
  const [balanceData, setBalanceData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editData, setEditData] = useState({ model: null, id: null, field: '', value: '' });

  const fetchBalance = async (date) => {
    try {
      const response = await fetch(`http://localhost:4000/api/balance?date=${date.toISOString()}`);
      const data = await response.json();
      setBalanceData(data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const generatePDF = async () => {
    const input = document.getElementById('balance-sheet');
    const canvas = await html2canvas(input);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas, 'JPEG', 10, 10, 190, 0);
    pdf.save(`balance-sheet-${selectedDate.toISOString().split('T')[0]}.pdf`);
  };

  const handleUpdate = async () => {
    if (!editData.model || !editData.id || !editData.field) return;
    
    try {
      await fetch(`http://localhost:4000/api/balance/${editData.model}/${editData.id}`, {
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

  useEffect(() => {
    fetchBalance(selectedDate);
  }, [selectedDate]);

  if (!balanceData) return <div className="text-center p-8">Loading...</div>;
  
  const CompanyDeductionSection = ({ title, amount, model, onEdit }) => (
    <div className="p-4 bg-purple-50 rounded">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-700">{title}</h3>
          <span className="text-purple-600 text-xl font-semibold">
            SAR. {amount.toLocaleString()}
          </span>
        </div>
        <button
          onClick={() => onEdit({ model, field: 'amount' })}
          className="text-purple-600 hover:text-purple-700 px-4 py-2 border border-purple-200 rounded"
        >
          Edit Entries
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto" id="balance-sheet">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Daily Balance Sheet</h1>
        <div className="flex gap-4 items-center">
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className="border p-2 rounded"
          />
          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="text-sm font-medium text-gray-500">Opening Balance</h3>
            <p className="text-2xl font-semibold">
              SAR. {balanceData.openingBalance.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
            <p className={`text-2xl font-semibold ${
              balanceData.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              SAR. {balanceData.currentBalance.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Section title="Cash Inflows" amount={balanceData.inflows} color="green" />
          
          <DeductionSection 
            title="Expenses" 
            amount={balanceData.expenses} 
            model="expense" 
            onEdit={setEditData}
          />

          <DeductionSection
            title="Loan Deductions"
            amount={balanceData.loans}
            model="loan"
            field="remaining"
            onEdit={setEditData}
          />

        <Section title="Next Day Opening Balance" 
                   amount={balanceData.nextDayOpening} 
                   color="blue" />
        
          {/* Company Deductions */}
          {Object.entries(balanceData.companies).map(([company, amount]) => (
            <CompanyDeductionSection
              key={company}
              title={`${company} Deductions`}
              amount={amount}
              model={company.toLowerCase()}
              onEdit={setEditData}
            />
          ))}
        
          {/* Delivery Deductions */}
          {Object.entries(balanceData.deliveries).map(([service, amount]) => (
            <DeductionSection
              key={service}
              title={`${service} Delivery`}
              amount={amount}
              model={service.toLowerCase()}
              field="amount"
              onEdit={setEditData}
            />
          ))}
        </div>

        {editData.model && (
          <div className="mt-6 p-4 bg-yellow-50 rounded">
            <div className="flex gap-4 items-center">
              <input
                type="number"
                value={editData.value}
                onChange={(e) => setEditData(d => ({ ...d, value: e.target.value }))}
                className="border p-2 rounded w-32"
                placeholder="New amount"
              />
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirm Update
              </button>
              <button
                onClick={() => setEditData({ model: null, id: null, field: '', value: '' })}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          Last updated: {new Date(balanceData.lastUpdated).toLocaleString()}
        </div>
      </div>

      <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
        ← Back to Dashboard
      </Link>
    </div>
  );
};

const Section = ({ title, amount, color = 'gray' }) => (
  <div className={`p-4 bg-${color}-50 rounded`}>
    <div className="flex justify-between items-center">
      <h3 className="font-medium text-gray-700">{title}</h3>
      <span className={`text-xl font-semibold text-${color}-600`}>
        SAR. {amount.toLocaleString()}
      </span>
    </div>
  </div>
);

const DeductionSection = ({ title, amount, model, field, onEdit }) => (
  <div className="p-4 bg-red-50 rounded">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-medium text-gray-700">{title}</h3>
        <span className="text-red-600 text-xl font-semibold">
          SAR. {amount.toLocaleString()}
        </span>
      </div>
      <button
        onClick={() => onEdit({ model, field })}
        className="text-red-600 hover:text-red-700 px-4 py-2 border border-red-200 rounded"
      >
        Edit Entries
      </button>
    </div>
  </div>
);

export default BalanceSheet;