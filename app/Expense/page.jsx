"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Link from "next/link";

// Dynamically import DatePicker to avoid SSR issues
const DatePicker = dynamic(() => import("react-datepicker"), { ssr: false });
import "react-datepicker/dist/react-datepicker.css";

const Expense = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState(""); // New state for filter

  useEffect(() => {
    fetchSales();
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/expense/${id}`);
      toast.success("Sale deleted successfully");
      fetchSales();
    } catch (error) {
      toast.error("Error deleting sale");
    }
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.name.toLowerCase().includes(search.toLowerCase());
    const matchesDate = selectedDate
      ? new Date(sale.createdAt).toDateString() === new Date(selectedDate).toDateString()
      : true;
    const matchesPayment =
      paymentFilter === ""
        ? true
        : sale.description.toLowerCase().includes(paymentFilter.toLowerCase());

    return matchesSearch && matchesDate && matchesPayment;
  });

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-6">Expenses</h1>

      <div className="flex flex-wrap gap-4 mb-6 w-full max-w-4xl">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Date Picker */}
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="w-full md:w-1/3 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
          placeholderText="Select a date"
        />

        {/* Payment Type Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="w-full md:w-1/3 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl shadow-xl w-full max-w-4xl bg-gray-800">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-5 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Created At</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale._id} className="border-b border-gray-700 hover:bg-gray-600 transition">
                  <td className="px-5 py-4 text-sm">{sale.name}</td>
                  <td className="px-5 py-4 text-sm">{sale.description}</td>
                  <td className="px-5 py-4 text-sm text-green-400">${sale.amount}</td>
                  <td className="px-5 py-4 text-sm">{new Date(sale.createdAt).toDateString()}</td>
                  <td className="px-5 py-4 text-sm">
                    <Link href={`/UpdateExpense/${sale._id}`}>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg mr-2 transition-all">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(sale._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-5 py-4 text-center text-gray-400">
                  No Expense found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Link href="/CreateExpense">
        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg transition-all">
          Create Expense
        </button>
      </Link>
    </motion.div>
  );
};

export default Expense;
