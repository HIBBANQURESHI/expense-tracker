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

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get("https://akc-expense-server.vercel.app/api/receiving");
      if (response.data) {
        setLoans(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://akc-expense-server.vercel.app/api/receiving/${id}`);
      toast.success("Loan deleted successfully");
      fetchLoans();
    } catch (error) {
      toast.error("Error deleting loan");
    }
  };

  // Filter logic: Match search text and selected date
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = loan.name.toLowerCase().includes(search.toLowerCase());
  
    let loanDate = new Date(loan.date);
    let selected = selectedDate ? new Date(selectedDate) : null;
  
    // Ensure valid dates before comparison
    if (isNaN(loanDate)) return false;
    loanDate.setHours(0, 0, 0, 0);
  
    const matchesDate = selected 
    ? loanDate.toISOString().split("T")[0] === selected.toISOString().split("T")[0]
    : true;
  
    return matchesSearch && matchesDate;
  });

  return (
    <motion.div
      className="min-h-screen bg-white text-black p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-6">Receiving</h1>

      <div className="flex gap-4 mb-6 w-full max-w-4xl">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg bg-white text-black border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="w-full p-3 rounded-lg bg-white text-black border border-gray-700 focus:outline-none"
          placeholderText="Select a date"
        />
      </div>
      

      <Link href="/CreateReceiving">
        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg transition-all">
          Create Receiving
        </button>
      </Link>

      <div className="overflow-hidden rounded-xl shadow-xl w-full max-w-4xl bg-white py-3">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="px-5 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Created At</th>
              <th className="px-5 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <tr key={loan._id} className="border-b border-black hover:bg-gray-100 transition">
                  <td className="px-5 py-4 text-sm">{loan.name}</td>
                  <td className="px-5 py-4 text-sm text-green-700">SAR.{loan.amount}</td>
                  <td className="px-5 py-4 text-sm">{new Date(loan.date).toDateString()}</td>
                  <td className="px-5 py-4 text-sm">
                    <Link href={`/UpdateReceiving/${loan._id}`}>
                      <button className="text-blue-500 py-1 px-3 rounded-lg mr-2 transition-all">Edit</button>
                    </Link>
                    <button onClick={() => handleDelete(loan._id)} className="text-red-500 py-1 px-3 rounded-lg transition-all">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-5 py-4 text-center text-gray-400">No Receiving found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default LoanList;
