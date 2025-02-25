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

const SaleByCash = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/sales');
      if (response.data) {
        setSales(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      toast.error('Unable to load sales data. Please try again later.');
      console.error('Error fetching sales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the sale for ${name}?`)) {
      try {
        await axios.delete(`http://localhost:4000/api/sales/${id}`);
        toast.success('Sale deleted successfully');
        fetchSales();
      } catch (error) {
        toast.error('Error deleting sale. Please try again.');
      }
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedDate(null);
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.name.toLowerCase().includes(search.toLowerCase());
    const matchesDate = selectedDate ? new Date(sale.createdAt).toDateString() === new Date(selectedDate).toDateString() : true;
    return matchesSearch && matchesDate;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div 
      className="min-h-screen bg-white p-4 sm:p-6 flex flex-col items-center max-w-5xl mx-auto"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}>
      
      <h1 className="text-2xl sm:text-3xl font-medium text-gray-800 mb-6">Sales Overview</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 sm:p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition-all"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        <div className="flex-1">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="w-full p-2 sm:p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition-all"
            placeholderText="Filter by date"
            dateFormat="MMM d, yyyy"
          />
        </div>
        <Link href="/CreateSale">
        <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm">
          + New Sale
        </button>
      </Link>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center py-10">
          <div className="animate-pulse text-gray-500">Loading sales data...</div>
        </div>
      ) : (
        <div className="w-full rounded-lg shadow-sm border border-gray-100 bg-white overflow-hidden">
          {filteredSales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-800">{sale.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sale.description}</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">${sale.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(sale.createdAt)}</td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        <Link href={`/UpdateSale/${sale._id}`}>
                          <button className="text-blue-600 py-1 px-3 rounded text-md font-normal transition-colors">Edit</button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(sale._id, sale.name)} 
                          className="text-red-600 py-1 px-3 rounded text-md font-normal transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              {search || selectedDate ? (
                <div>
                  <p>No sales match your search criteria.</p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <p>No sales records found. Create your first sale to get started.</p>
              )}
            </div>
          )}
        </div>
      )}

      
    </motion.div>
  );
};

export default SaleByCash;