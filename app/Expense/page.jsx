"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Link from "next/link";

const DatePicker = dynamic(() => import("react-datepicker"), { ssr: false });
import "react-datepicker/dist/react-datepicker.css";

const Expense = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState("");
  const [monthlySummary, setMonthlySummary] = useState({ 
    cash: 0, 
    card: 0, 
    total: 0 
  });

  useEffect(() => {
    fetchSales();
    fetchMonthlySummary();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/expense");
      if (response.data) {
        setSales(
          response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchMonthlySummary = async () => {
    try {
      const today = new Date();
      const response = await axios.get(
        `http://localhost:4000/api/expense/monthly-summary/${today.getFullYear()}/${today.getMonth() + 1}`
      );
      setMonthlySummary(response.data);
    } catch (error) {
      console.error("Error fetching monthly summary:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/expense/${id}`);
      toast.success("Expense record deleted successfully");
      fetchSales();
      fetchMonthlySummary(); // Refresh monthly summary after deletion
    } catch (error) {
      toast.error("Error deleting expense record");
    }
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.name.toLowerCase().includes(search.toLowerCase());
    const matchesPayment = paymentFilter ? sale.paymentMethod === paymentFilter : true;
    
    let expenseDate = new Date(sale.date);
    let selected = selectedDate ? new Date(selectedDate) : null;

    if (isNaN(expenseDate)) return false;
    expenseDate.setHours(0, 0, 0, 0);

    const matchesDate = selected 
      ? expenseDate.toISOString().split("T")[0] === selected.toISOString().split("T")[0]
      : true;

    return matchesSearch && matchesDate && matchesPayment;
  });

  const calculateSearchTotal = () => {
    return filteredSales.reduce((acc, sale) => acc + sale.amount, 0);
  };

  return (
    <motion.div
      className="min-h-screen bg-white p-8 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-6xl">
        {/* Monthly Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-blue-600">Cash Expenses</h3>
            <p className="mt-2 text-2xl font-semibold text-blue-700">
              ${monthlySummary.cash.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-green-600">Card Expenses</h3>
            <p className="mt-2 text-2xl font-semibold text-green-700">
              ${monthlySummary.card.toFixed(2)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-purple-600">Monthly Total</h3>
            <p className="mt-2 text-2xl font-semibold text-purple-700">
              ${monthlySummary.total.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Expense Management</h1>
          <Link href="/CreateExpense">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add New Expense
            </button>
          </Link>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search expense records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="p-2.5 border rounded-lg w-full focus:outline-none"
            placeholderText="Filter by date"
          />

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Payment Methods</option>
            <option value="cash">Cash Payments</option>
            <option value="card">Card Payments</option>
          </select>
        </div>

        {/* Search Summary */}
        {search && (
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-yellow-700">
              Total for "{search}": ${calculateSearchTotal().toFixed(2)}
            </h3>
          </div>
        )}

        {/* Expenses Table */}
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            {/* Table Head */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Expense Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Payment Method</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3.5 text-sm text-gray-700">{sale.name}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{sale.description}</td>
                    <td className="px-4 py-3.5 text-sm font-medium text-red-600">${sale.amount}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sale.paymentMethod === 'cash' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 flex gap-2">
                      <Link href={`/UpdateExpense/${sale._id}`}>
                        <button className="text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md transition-colors">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(sale._id)}
                        className="text-red-600 hover:text-red-800 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    No expense records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Expense;