'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import Link from 'next/link';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false });
import 'react-datepicker/dist/react-datepicker.css';

const SaleByCash = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [monthlySummary, setMonthlySummary] = useState({
    totalSales: 0,
    totalAmount: 0,
    cashSales: 0,
    cardSales: 0,
    cashAmount: 0,
    cardAmount: 0
  });

  useEffect(() => {
    fetchSales();
    fetchMonthlySummary();
  }, []);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://akc-expense-server.vercel.app/api/sales');
      if (response.data) {
        setSales(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (error) {
      toast.error('Unable to load sales data. Please try again later.');
      console.error('Error fetching sales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonthlySummary = async () => {
    try {
      const today = new Date();
      const response = await axios.get(
        `https://akc-expense-server.vercel.app/api/sales/${today.getFullYear()}/${today.getMonth() + 1}`
      );
      setMonthlySummary(response.data);
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Monthly Sales Summary", 14, 15);
    doc.setFontSize(12);
    doc.setTextColor(100);
    
    const summaryData = [
      ["Cash Sales", `SAR ${monthlySummary.cashAmount?.toFixed(2) || '0.00'}`, `${monthlySummary.cashSales} transactions`],
      ["Card Sales", `SAR ${monthlySummary.cardAmount?.toFixed(2) || '0.00'}`, `${monthlySummary.cardSales} transactions`],
      ["Monthly Total", `SAR ${monthlySummary.totalAmount?.toFixed(2) || '0.00'}`, `${monthlySummary.totalSales} transactions`]
    ];
    
    doc.autoTable({
      startY: 25,
      head: [['Category', 'Amount', 'Transactions']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.addPage();
    doc.setFontSize(18);
    doc.text("Sales Details", 14, 15);
    doc.setFontSize(12);
    
    const salesData = filteredSales.map(sale => [
      sale.name,
      sale.description,
      `SAR ${sale.amount.toFixed(2)}`,
      sale.paymentMethod.toUpperCase(),
      new Date(sale.date).toLocaleDateString()
    ]);

    doc.autoTable({
      startY: 25,
      head: [['Name', 'Description', 'Amount', 'Payment', 'Date']],
      body: salesData,
      theme: 'grid',
      foot: [['', '', `SAR ${totals.grandTotal.toFixed(2)}`, '', '']],
      didDrawPage: (data) => {
        doc.setFontSize(12);
        doc.text(`Total Filtered Sales: SAR ${totals.grandTotal.toFixed(2)}`, 14, data.pageCount * 280 - 10);
      }
    });

    doc.save(`sales-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const calculateTotals = () => {
    return filteredSales.reduce((acc, sale) => {
      acc.grandTotal += sale.amount;
      if (sale.paymentMethod === 'cash') {
        acc.grandCashTotal += sale.amount;
      } else {
        acc.grandCardTotal += sale.amount;
      }

      if (!acc.nameTotals[sale.name]) {
        acc.nameTotals[sale.name] = { total: 0, cash: 0, card: 0 };
      }
      acc.nameTotals[sale.name].total += sale.amount;
      sale.paymentMethod === 'cash' 
        ? acc.nameTotals[sale.name].cash += sale.amount 
        : acc.nameTotals[sale.name].card += sale.amount;

      return acc;
    }, { grandTotal: 0, grandCashTotal: 0, grandCardTotal: 0, nameTotals: {} });
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.name.toLowerCase().includes(search.toLowerCase());
    const matchesDate = selectedDate 
      ? new Date(sale.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString()
      : true;
    const matchesPayment = paymentFilter === 'all' ? true : sale.paymentMethod === paymentFilter;

    return matchesSearch && matchesDate && matchesPayment;
  });

  const totals = calculateTotals();

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://akc-expense-server.vercel.app/api/sales/${id}`);
      toast.success("Sale record deleted successfully");
      fetchSales();
      fetchMonthlySummary();
    } catch (error) {
      toast.error("Error deleting sale record");
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-white p-4 sm:p-6 flex flex-col items-center max-w-5xl mx-auto"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}>
      
      <h1 className="text-2xl sm:text-3xl font-medium text-gray-800 mb-6">Sales Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-blue-600">Cash Sales</h3>
          <p className="mt-2 text-2xl font-semibold text-blue-700">
            SAR.{monthlySummary.cashAmount?.toFixed(2) || '0.00'}
          </p>
          <div className="mt-2 text-xs text-blue-600">
            {monthlySummary.cashSales} transactions
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-green-600">Card Sales</h3>
          <p className="mt-2 text-2xl font-semibold text-green-700">
            SAR.{monthlySummary.cardAmount?.toFixed(2) || '0.00'}
          </p>
          <div className="mt-2 text-xs text-green-600">
            {monthlySummary.cardSales} transactions
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-purple-600">Monthly Total</h3>
          <p className="mt-2 text-2xl font-semibold text-purple-700">
            SAR.{monthlySummary.totalAmount?.toFixed(2) || '0.00'}
          </p>
          <div className="mt-2 text-xs text-purple-600">
            {monthlySummary.totalSales} total transactions
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 sm:p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition-all"
          />
        </div>

        <div className="flex-1">
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            className="w-full p-2 sm:p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition-all"
            placeholderText="Filter by date"
            dateFormat="MMM d, yyyy"
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="p-2 sm:p-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-300"
        >
          <option value="all">All Payments</option>
          <option value="cash">Cash Only</option>
          <option value="card">Card Only</option>
        </select>

        <div className="flex gap-2">
          <button 
            onClick={handleDownloadPDF}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
          >
            Download PDF
          </button>
          <Link href="/CreateSale">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm">
              + New Sale
            </button>
          </Link>
        </div>
      </div>

      {search && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg shadow-sm w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h3 className="text-sm font-medium text-blue-700 mb-2 sm:mb-0">
              Showing {filteredSales.length} results for "{search}"
            </h3>
            <div className="text-right">
              <p className="text-sm font-semibold text-blue-800">
                Grand Total: SAR.{totals.grandTotal.toFixed(2)}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Cash: SAR.{totals.grandCashTotal.toFixed(2)} | Card: SAR.{totals.grandCardTotal.toFixed(2)}
              </p>
            </div>
          </div>

          {Object.keys(totals.nameTotals).length > 0 && (
            <div className="mt-4 pt-2 border-t border-blue-100">
              {Object.entries(totals.nameTotals).map(([name, totals]) => (
                <div key={name} className="flex justify-between text-xs text-blue-700 mt-1">
                  <span>{name}:</span>
                  <span>
                    SAR.{totals.total.toFixed(2)} (
                    <span className="text-blue-600">C:SAR.{totals.cash.toFixed(2)}</span>, 
                    <span className="text-green-600"> D:SAR.{totals.card.toFixed(2)}</span>)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                    {['Name', 'Description', 'Amount', 'Payment', 'Date', 'Actions'].map((header) => (
                      <th 
                        key={header}
                        className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{sale.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sale.description}</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        SAR.{sale.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          sale.paymentMethod === 'cash' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(sale.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        <Link href={`/UpdateSale/${sale._id}`}>
                          <button className="text-blue-600 hover:text-blue-800">
                            Edit
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(sale._id)}
                          className="text-red-600 hover:text-red-800"
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
              {search || selectedDate || paymentFilter !== 'all' ? (
                <div>
                  <p>No sales match your search criteria.</p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setSelectedDate(null);
                      setPaymentFilter('all');
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Clear all filters
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