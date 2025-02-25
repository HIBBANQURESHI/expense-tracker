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
  const [monthlyExpense, setMonthlyExpense] = useState({ totalAmount: 0 });
  const [dailyExpense, setDailyExpense] = useState({ totalAmount: 0 });
  const [monthlyBrooze, setMonthlyBrooze] = useState({ totalAmount: 0 });
  const [dailyBrooze, setDailyBrooze] = useState({ totalAmount: 0 });
  const [monthlyKpmg, setMonthlyKpmg] = useState({ totalAmount: 0 });
  const [dailyKpmg, setDailyKpmg] = useState({ totalAmount: 0 });
  const [netSalesMonthly, setNetSalesMonthly] = useState(0);
  const [netDailyTotal, setNetDailyTotal] = useState(0);
  const [monthlyDeliveries, setMonthlyDeliveries] = useState({ totalDeliveries: 0, totalAmount: 0 });
  const [dailyDeliveries, setDailyDeliveries] = useState({ totalDeliveries: 0, totalAmount: 0 });
  const [monthlyHunger, setMonthlyHunger] = useState({ totalDeliveries: 0, totalAmount: 0 });
  const [dailyHunger, setDailyHunger] = useState({ totalDeliveries: 0, totalAmount: 0 });
  const [monthlyNoon, setMonthlyNoon] = useState({ totalDeliveries: 0, totalAmount: 0 });
  const [dailyNoon, setDailyNoon] = useState({ totalDeliveries: 0, totalAmount: 0 });
  const [monthlyJahez, setMonthlyJahez] = useState({ totalDeliveries: 0, totalAmount: 0 });
  const [dailyJahez, setDailyJahez] = useState({ totalDeliveries: 0, totalAmount: 0 });
  const [monthlyMarsool, setMonthlyMarsool] = useState({ totalDeliveries: 0, totalAmount: 0 });
  const [dailyMarsool, setDailyMarsool] = useState({ totalDeliveries: 0, totalAmount: 0 });
  const [monthlyNinja, setMonthlyNinja] = useState({ totalDeliveries: 0, totalAmount: 0 });
  const [dailyNinja, setDailyNinja] = useState({ totalDeliveries: 0, totalAmount: 0 });

  useEffect(() => {
    const fetchSalesAndExpenseData = async () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const day = new Date().getDate();

      try {
        const responses = await Promise.all([
          fetch(`http://localhost:4000/api/sales/${year}/${month}`),
          fetch(`http://localhost:4000/api/cardsale/${year}/${month}`),
          fetch(`http://localhost:4000/api/sales/${year}/${month}/${day}`),
          fetch(`http://localhost:4000/api/cardsale/${year}/${month}/${day}`),
          fetch(`http://localhost:4000/api/expense/${year}/${month}`),
          fetch(`http://localhost:4000/api/expense/${year}/${month}/${day}`),
          fetch(`http://localhost:4000/api/brooze/${year}/${month}`),
          fetch(`http://localhost:4000/api/brooze/${year}/${month}/${day}`),
          fetch(`http://localhost:4000/api/kpmg/${year}/${month}`),
          fetch(`http://localhost:4000/api/kpmg/${year}/${month}/${day}`),
          fetch(`http://localhost:4000/api/keeta/${year}/${month}`),
          fetch(`http://localhost:4000/api/keeta/${year}/${month}/${day}`),
          fetch(`http://localhost:4000/api/hunger/${year}/${month}`), 
          fetch(`http://localhost:4000/api/hunger/${year}/${month}/${day}`),
          fetch(`http://localhost:4000/api/noon/${year}/${month}`), 
          fetch(`http://localhost:4000/api/noon/${year}/${month}/${day}`),
          fetch(`http://localhost:4000/api/jahez/${year}/${month}`), 
          fetch(`http://localhost:4000/api/jahez/${year}/${month}/${day}`),
          fetch(`http://localhost:4000/api/marsool/${year}/${month}`), 
          fetch(`http://localhost:4000/api/marsool/${year}/${month}/${day}`),
          fetch(`http://localhost:4000/api/ninja/${year}/${month}`), 
          fetch(`http://localhost:4000/api/ninja/${year}/${month}/${day}`),
        ]);

        const data = await Promise.all(responses.map(res => res.ok ? res.json() : {}));

        setCashSales(data[0]);
        setCardSales(data[1]);
        setDailySales(data[2]);
        setDailyCardSales(data[3]);
        setMonthlyExpense(data[4]);
        setDailyExpense(data[5]);
        setMonthlyBrooze(data[6]);
        setDailyBrooze(data[7]);
        setMonthlyKpmg(data[8]);
        setDailyKpmg(data[9]);
        setMonthlyDeliveries({
          totalDeliveries: data[10]?.totalDeliveries || 0,
          totalAmount: data[10]?.totalAmount || 0
        });
         // Monthly Deliveries
        setDailyDeliveries(data[11]); // Daily Deliveries
        setMonthlyHunger({
          totalDeliveries: data[12]?.totalDeliveries || 0,
          totalAmount: data[12]?.totalAmount || 0
        });
         // Monthly Deliveries
        setDailyHunger(data[13]); // Daily Deliveries
        setMonthlyNoon({
          totalDeliveries: data[14]?.totalDeliveries || 0,
          totalAmount: data[14]?.totalAmount || 0
        });
         // Monthly Deliveries
        setDailyNoon(data[15]); // Daily Deliveries
        setMonthlyJahez({
          totalDeliveries: data[16]?.totalDeliveries || 0,
          totalAmount: data[16]?.totalAmount || 0
        });
         // Monthly Deliveries
        setDailyJahez(data[17]); // Daily Deliveries
        setMonthlyMarsool({
          totalDeliveries: data[18]?.totalDeliveries || 0,
          totalAmount: data[18]?.totalAmount || 0
        });
         // Monthly Deliveries
        setDailyMarsool(data[19]); // Daily Deliveries
        setMonthlyNinja({
          totalDeliveries: data[20]?.totalDeliveries || 0,
          totalAmount: data[21]?.totalAmount || 0
        });
         // Monthly Deliveries
        setDailyNinja(data[21]); // Daily Deliveries

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchSalesAndExpenseData();
  }, []);

  useEffect(() => {
    setNetSalesMonthly(cashSales.totalAmount + cardSales.totalAmount + monthlyBrooze.totalAmount);
    setNetDailyTotal(dailySales.totalAmount + dailyCardSales.totalAmount + dailyBrooze.totalAmount);
  }, [cashSales, cardSales, dailySales, dailyCardSales, monthlyBrooze, dailyBrooze]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-8 font-poppins">
      <motion.h1 
        className="text-5xl font-semibold mb-10 text-black"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Sales & Expense Overview
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">
        <Section title="Monthly Cash Sale">
          <p className="text-2xl">Total Sales: {cashSales.totalSales}</p>
          <p className="text-2xl">Total Amount: Rs.{cashSales.totalAmount}</p>
        </Section>

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

        <Section title="Total Net Sales (Monthly)">
          <p className="text-3xl font-normal text-blue-500">Rs.{netSalesMonthly}</p>
        </Section>

        <Section title="Total Net Sales (Daily)"> 
          <p className="text-3xl font-normal text-blue-500">Rs.{netDailyTotal}</p>
        </Section>

        <Section title="Monthly Expense">
          <p className="text-2xl font-normal text-red-500">Rs.{monthlyExpense.totalAmount}</p>
        </Section>

        <Section title="Daily Expense">
          <p className="text-2xl font-normal text-red-500">Rs.{dailyExpense.totalAmount}</p>
        </Section>

        <Section title="Brooze Company Payments (Monthly)">
          <p className="text-2xl font-normal text-green-500">Rs.{monthlyBrooze.totalAmount}</p>
        </Section>

        <Section title="Brooze Company Payments (Today)">
          <p className="text-2xl font-normal text-green-500">Rs.{dailyBrooze.totalAmount}</p>
        </Section>

        <Section title="KPMG Company Payments (Monthly)">
          <p className="text-2xl font-normal text-green-500">Rs.{monthlyKpmg.totalAmount}</p>
        </Section>

        <Section title="KPMG Company Payments (Today)">
          <p className="text-2xl font-normal text-green-500">Rs.{dailyKpmg.totalAmount}</p>
        </Section>

        <Section title="Monthly Keeta Deliveries">
          <p className="text-2xl">Total Deliveries: {monthlyDeliveries.totalDeliveries}</p>
          <p className="text-2xl">Total Amount: Rs.{monthlyDeliveries.totalAmount}</p>
        </Section>

        <Section title="Today's Keeta Deliveries">
          <p className="text-2xl">Total Deliveries Today: {dailyDeliveries.totalDeliveries}</p>
          <p className="text-2xl">Total Amount Today: Rs.{dailyDeliveries.totalAmount}</p>
        </Section>

        <Section title="Monthly Hunger Deliveries">
          <p className="text-2xl">Total Deliveries: {monthlyHunger.totalDeliveries}</p>
          <p className="text-2xl">Total Amount: Rs.{monthlyHunger.totalAmount}</p>
        </Section>

        <Section title="Today's Hunger Deliveries">
          <p className="text-2xl">Total Deliveries Today: {dailyHunger.totalDeliveries}</p>
          <p className="text-2xl">Total Amount Today: Rs.{dailyHunger.totalAmount}</p>
        </Section>

        <Section title="Monthly Noon Deliveries">
          <p className="text-2xl">Total Deliveries: {monthlyNoon.totalDeliveries}</p>
          <p className="text-2xl">Total Amount: Rs.{monthlyNoon.totalAmount}</p>
        </Section>

        <Section title="Today's Noon Deliveries">
          <p className="text-2xl">Total Deliveries Today: {dailyNoon.totalDeliveries}</p>
          <p className="text-2xl">Total Amount Today: Rs.{dailyNoon.totalAmount}</p>
        </Section>

        <Section title="Monthly Jahez Deliveries">
          <p className="text-2xl">Total Deliveries: {monthlyJahez.totalDeliveries}</p>
          <p className="text-2xl">Total Amount: Rs.{monthlyJahez.totalAmount}</p>
        </Section>

        <Section title="Today's Jahez Deliveries">
          <p className="text-2xl">Total Deliveries Today: {dailyJahez.totalDeliveries}</p>
          <p className="text-2xl">Total Amount Today: Rs.{dailyJahez.totalAmount}</p>
        </Section>

        <Section title="Monthly Marsool Deliveries">
          <p className="text-2xl">Total Deliveries: {monthlyMarsool.totalDeliveries}</p>
          <p className="text-2xl">Total Amount: Rs.{monthlyMarsool.totalAmount}</p>
        </Section>

        <Section title="Today's Marsool Deliveries">
          <p className="text-2xl">Total Deliveries Today: {dailyMarsool.totalDeliveries}</p>
          <p className="text-2xl">Total Amount Today: Rs.{dailyMarsool.totalAmount}</p>
        </Section>

        <Section title="Monthly Ninja Deliveries">
          <p className="text-2xl">Total Deliveries: {monthlyNinja.totalDeliveries}</p>
          <p className="text-2xl">Total Amount: Rs.{monthlyNinja.totalAmount}</p>
        </Section>

        <Section title="Today's Ninja Deliveries">
          <p className="text-2xl">Total Deliveries Today: {dailyNinja.totalDeliveries}</p>
          <p className="text-2xl">Total Amount Today: Rs.{dailyNinja.totalAmount}</p>
        </Section>
      </div>
    </div>
  );
};

export default Home;
