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

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get("https://akc-expense-server.vercel.app/api/marsool");
      if (response.data) {
        setSales(
          response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      }
    } catch (error) {
      console.error("Error fetching delivery:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://akc-expense-server.vercel.app/api/marsool/${id}`);
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
      className="min-h-screen bg-white text-black p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-6">Marsool Delivery</h1>

      <div className="flex flex-wrap gap-4 mb-6 w-full max-w-4xl">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-3 rounded-lg bg-white text-black border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Date Picker */}
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="w-full md:w-1/3 p-3 rounded-lg bg-white text-black border border-gray-700 focus:outline-none"
          placeholderText="Select a date"
        />
      </div>

      

      <Link href="/CreateMarsool">
        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg transition-all">
          Create Delivery
        </button>
      </Link>

      <div className="overflow-hidden rounded-xl shadow-xl w-full max-w-4xl bg-white py-3">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="px-5 py-3 text-left text-sm font-semibold">NO. of Delivery</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Created At</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale._id} className="border-b border-gray-700 hover:bg-gray-100 transition">
                  <td className="px-5 py-4 text-sm">{sale.deliveries}</td>
                  <td className="px-5 py-4 text-sm text-green-700">${sale.amount}</td>
                  <td className="px-5 py-4 text-sm">{new Date(sale.date).toDateString()}</td>
                  <td className="px-5 py-4 text-sm">
                    <Link href={`/UpdateMarsool/${sale._id}`}>
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
