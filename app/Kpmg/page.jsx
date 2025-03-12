'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import Link from 'next/link';

const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false });
import 'react-datepicker/dist/react-datepicker.css';

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalCredit: 0,
    totalBalance: 0,
    totalLoans: 0
  });

  useEffect(() => {
    fetchLoans();
    fetchSummary();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/kpmg");
      const sortedLoans = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setLoans(sortedLoans);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/kpmg/summary/total");
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
      toast.error("Failed to load financial summary");
      setSummary({
        totalAmount: 0,
        totalCredit: 0,
        totalBalance: 0,
        totalLoans: 0
      });
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/kpmg/${id}`);
      toast.success("Loan deleted successfully");
      fetchLoans();
    } catch (error) {
      toast.error("Error deleting loan");
    }
  };

  // Filter logic: Match search text and selected date
  const filteredLoans = loans.filter((loan) => {
    const loanName = loan.name ? loan.name.toLowerCase() : "";
    const matchesSearch = loanName.includes(search.toLowerCase());
  
    let loanDate = new Date(loan.date);
    let selected = selectedDate ? new Date(selectedDate) : null;
  
    if (isNaN(loanDate)) return false;
    loanDate.setHours(0, 0, 0, 0);
  
    const matchesDate = selected 
      ? loanDate.toISOString().split("T")[0] === selected.toISOString().split("T")[0]
      : true;
  
    return matchesSearch && matchesDate;
  });
  

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">KPMG Company Records</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-6xl">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Remaining balance</h3>
          <p className="mt-2 text-2xl font-semibold text-red-600">
            SAR.{summary.totalBalance.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Amount</h3>
          <p className="mt-2 text-2xl font-semibold text-blue-600">
            SAR.{summary.totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Paid Amount</h3>
          <p className="mt-2 text-2xl font-semibold text-green-600">
            SAR.{summary.totalCredit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="w-full max-w-6xl mb-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            className="flex-1 p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Filter by date"
            dateFormat="dd MMM yyyy"
          />
        </div>
        
        <Link href="/CreateKpmg" className="block">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            + Add Record 
          </button>
        </Link>
      </div>

      {/* Records Table */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Client Name', 'Total Amount', 'Amount Paid', 'Remaining Balance', 'Last Updated', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLoans.map((loan) => (
              <tr key={loan._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{loan.name}</td>
                <td className="px-6 py-4 text-sm text-blue-600 font-medium">SAR.{loan.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-green-600">SAR.{loan.credit.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-red-600 font-medium">SAR.{loan.balance.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(loan.date).toLocaleDateString('en-GB')}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Link href={`/UpdateKpmg/${loan._id}`} className="text-blue-600 hover:text-blue-800">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(loan._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State */}
        {filteredLoans.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No liability records found
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LoanList;