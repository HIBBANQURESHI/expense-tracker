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
  const [summary, setSummary] = useState({
    totalDeliveries: 0,
    totalAmount: 0,
    totalPaid: 0,
    totalBalance: 0
  });

  useEffect(() => {
    fetchSales();
    fetchSummary();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get("https://akc-expense-server.vercel.app/api/Keeta");
      setSales(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Error fetching delivery:", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get("https://akc-expense-server.vercel.app/api/keeta/summary/total");
      setSummary(response.data);
    } catch (error) {
      toast.error("Failed to load summary data");
      setSummary({
        totalDeliveries: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalBalance: 0
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://akc-expense-server.vercel.app/api/keeta/${id}`);
      toast.success("delivery deleted successfully");
      fetchSales();
    } catch (error) {
      toast.error("Error deleting delivery");
    }
  };

  // Filter logic: Match search text and selected date
  const filteredSales = sales.filter((sale) => {  
    let loanDate = new Date(sale.date);
    let selected = selectedDate ? new Date(selectedDate) : null;
  
    // Ensure valid dates before comparison
    if (isNaN(loanDate)) return false;
    loanDate.setHours(0, 0, 0, 0);
  
    const matchesDate = selected 
    ? loanDate.toISOString().split("T")[0] === selected.toISOString().split("T")[0]
    : true;
  
    return matchesDate;
  });

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Keeta Delivery Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 w-full max-w-6xl">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Deliveries</h3>
          <p className="mt-2 text-2xl font-semibold text-blue-600">
            {summary.totalDeliveries}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Amount</h3>
          <p className="mt-2 text-2xl font-semibold text-green-600">
            SAR.{summary.totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Paid Amount</h3>
          <p className="mt-2 text-2xl font-semibold text-purple-600">
            SAR.{summary.totalPaid.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Pending Balance</h3>
          <p className="mt-2 text-2xl font-semibold text-red-600">
            SAR.{summary.totalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Rest of your existing code */}
      <div className="w-full max-w-6xl mb-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search deliveries..."
            className="flex-1 p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            className="flex-1 p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Filter by date"
            dateFormat="dd MMM yyyy"
          />
        </div>
        
        <Link href="/CreateDelivery" className="block">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            + New Delivery Record
          </button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl shadow-xl w-full max-w-4xl bg-white py-3">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="px-5 py-3 text-left text-sm font-semibold">NO. of Delivery</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Amount Paid</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Remaining Balance</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Created At</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale._id} className="border-b border-gray-700 hover:bg-gray-600 transition">
                  <td className="px-5 py-4 text-sm">{sale.deliveries}</td>
                  <td className="px-5 py-4 text-sm text-green-700">SAR.{sale.amount}</td>
                  <td className="px-6 py-4 text-sm text-green-600">SAR.{sale.paidAmount}</td>
                  <td className="px-6 py-4 text-sm text-red-600 font-medium">SAR.{sale.balance}</td>
                  <td className="px-5 py-4 text-sm">{new Date(sale.date).toDateString()}</td>
                  <td className="px-5 py-4 text-sm">
                    <Link href={`/UpdateDelivery/${sale._id}`}>
                      <button className="text-blue-500 py-1 px-3 rounded-lg mr-2 transition-all">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(sale._id)}
                      className="text-red-500 py-1 px-3 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-5 py-4 text-center text-gray-400">
                  No Delivery found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Expense;