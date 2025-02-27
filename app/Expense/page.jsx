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

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get("https://akc-expense-server.vercel.app/api/expense");
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
      await axios.delete(`https://akc-expense-server.vercel.app/api/expense/${id}`);
      toast.success("Expense record deleted successfully");
      fetchSales();
    } catch (error) {
      toast.error("Error deleting expense record");
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
      className="min-h-screen bg-white p-8 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Expense Management</h1>
          <Link href="/CreateExpense">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add New Expense
            </button>
          </Link>
        </div>

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

        <div className="border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Expense Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-sm text-gray-700">{sale.name}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{sale.description}</td>
                    <td className="px-4 py-3.5 text-sm font-medium text-green-600">${sale.amount}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString()}
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
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
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