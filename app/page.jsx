"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Section = ({ title, children }) => (
  <motion.div 
    className="w-full p-6 bg-white rounded-xl shadow-md border border-gray-900 transition-transform transform hover:scale-105 hover:shadow-xl" 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.4 }}
  >
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
    {children}
  </motion.div>
);

const Home = () => {
  const [cashSales, setCashSales] = useState({ totalSales: 0, totalAmount: 0 });
  const [cardSales, setCardSales] = useState({ totalSales: 0, totalAmount: 0 });
  const [dailySales, setDailySales] = useState({ totalSales: 0, totalAmount: 0 });
  const [dailyCardSales, setDailyCardSales] = useState({ totalSales: 0, totalAmount: 0 });
  const [netSalesMonthly, setNetSalesMonthly] = useState(0);
  const [netDailyTotal, setNetDailyTotal] = useState(0);

  useEffect(() => {
    const fetchSalesData = async () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const day = new Date().getDate();

      try {
        const cashResponse = await fetch(`http://localhost:4000/api/sales/${year}/${month}`);
        const cardResponse = await fetch(`http://localhost:4000/api/cardsale/${year}/${month}`);
        const dailyCashResponse = await fetch(`http://localhost:4000/api/sales/${year}/${month}/${day}`);
        const dailyCardResponse = await fetch(`http://localhost:4000/api/cardsale/${year}/${month}/${day}`);

        if (cashResponse.ok) setCashSales(await cashResponse.json());
        if (cardResponse.ok) setCardSales(await cardResponse.json());
        if (dailyCashResponse.ok) setDailySales(await dailyCashResponse.json());
        if (dailyCardResponse.ok) setDailyCardSales(await dailyCardResponse.json());
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSalesData();
  }, []);

  useEffect(() => {
    setNetSalesMonthly(cashSales.totalAmount + cardSales.totalAmount);
    setNetDailyTotal(dailySales.totalAmount + dailyCardSales.totalAmount);
  }, [cashSales, cardSales, dailySales, dailyCardSales]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-8 font-poppins">
      <motion.h1 
        className="text-5xl font-bold mb-10 text-black"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Sales Overview
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">
        {/* Monthly Sales Section */}
        <Section title="Monthly Cash Sale">
          <p className="text-2xl">Total Sales: {cashSales.totalSales}</p>
          <p className="text-2xl">Total Amount: Rs.{cashSales.totalAmount}</p>
        </Section>

        {/* Daily Sales Section */}
        <Section title="Today Cash Sale">
          <p className="text-xl">Total Sales Today: {dailySales.totalSales}</p>
          <p className="text-xl">Total Amount Today: Rs.{dailySales.totalAmount}</p>
        </Section>

        <Section title="Monthly Card Sale">
          <p className="text-2xl">Total Sales: {cardSales.totalSales}</p>
          <p className="text-2xl">Total Amount: Rs.{cardSales.totalAmount}</p>
        </Section>

        <Section title="Today Card Sale">
          <p className="text-2xl">Total Sales Today: {dailyCardSales.totalSales}</p>
          <p className="text-2xl">Total Amount Today: Rs.{dailyCardSales.totalAmount}</p>
        </Section>

        {/* Net Totals Section */}
        <Section title="Total Net Sales (Monthly)">
          <p className="text-3xl font-normal text-blue-500">Rs.{netSalesMonthly}</p>
        </Section>

        <Section title="Total Net Sales (Daily)"> 
          <p className="text-3xl font-normal text-blue-500">Rs.{netDailyTotal}</p>
        </Section>
      </div>
    </div>
  );
};

export default Home;
