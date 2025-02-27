"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Dynamically import DatePicker to avoid SSR issues
const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false });
import 'react-datepicker/dist/react-datepicker.css';

const CardSale = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('https://akc-expense-server.vercel.app/api/cardsale');
      if (response.data) {
        setSales(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://akc-expense-server.vercel.app/api/cardsale/${id}`);
      toast.success('Sale deleted successfully');
      fetchSales();
    } catch (error) {
      toast.error('Error deleting sale');
    }
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.name.toLowerCase().includes(search.toLowerCase());
    const matchesDate = selectedDate ? new Date(sale.createdAt).toDateString() === new Date(selectedDate).toDateString() : true;
    return matchesSearch && matchesDate;
  });

  return (
    <motion.div 
      className="min-h-screen bg-white text-black p-6 flex flex-col items-center" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}>
      <h1 className="text-4xl font-bold mb-6">Sales By Card</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-4xl items-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-3 rounded-lg bg-white text-black border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="w-full md:w-1/2 p-3 rounded-lg bg-white text-black border border-gray-700 focus:outline-none"
          placeholderText="Select a date"
        />
        <Link href="/CreateCardSale">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm">
            + New Sale
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="w-full  border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-black">
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
                <tr key={sale._id} className="border-b border-gray-300 hover:bg-gray-100 transition">
                  <td className="px-5 py-4 text-sm">{sale.name}</td>
                  <td className="px-5 py-4 text-sm">{sale.description}</td>
                  <td className="px-5 py-4 text-sm text-green-700">${sale.amount}</td>
                  <td className="px-5 py-4 text-sm">{new Date(sale.createdAt).toDateString()}</td>
                  <td className="px-5 py-4 text-sm  flex gap-2">
                    <Link href={`/UpdateCardSale/${sale._id}`}>
                      <button className="text-blue-500 py-1 px-3 rounded-lg transition-all">Edit</button>
                    </Link>
                    <button onClick={() => handleDelete(sale._id)} className="text-red-500 py-1 px-3 rounded-lg transition-all">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-5 py-4 text-center text-gray-400">No sales found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CardSale;