"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, secondaryValue, isAmount = false, colorClass = "text-gray-900" }) => (
  <motion.div 
    className="w-full p-5 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
    <div className={`text-2xl font-semibold ${colorClass}`}>
      {isAmount && 'Rs. '}{value}
      {secondaryValue && (
        <div className="text-sm font-normal text-gray-500 mt-1">
          {secondaryValue}
        </div>
      )}
    </div>
  </motion.div>
);

const SectionHeader = ({ title }) => (
  <motion.h2 
    className="text-lg font-semibold text-gray-800 col-span-full mb-2 mt-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {title}
  </motion.h2>
);

const Home = () => {
  // State variables
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
    const fetchData = async () => {
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

        // Update state with fetched data
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
        setMonthlyDeliveries(data[10]);
        setDailyDeliveries(data[11]);
        setMonthlyHunger(data[12]);
        setDailyHunger(data[13]);
        setMonthlyNoon(data[14]);
        setDailyNoon(data[15]);
        setMonthlyJahez(data[16]);
        setDailyJahez(data[17]);
        setMonthlyMarsool(data[18]);
        setDailyMarsool(data[19]);
        setMonthlyNinja(data[20]);
        setDailyNinja(data[21]);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setNetSalesMonthly(cashSales.totalAmount + cardSales.totalAmount + monthlyBrooze.totalAmount);
    setNetDailyTotal(dailySales.totalAmount + dailyCardSales.totalAmount + dailyBrooze.totalAmount);
  }, [cashSales, cardSales, dailySales, dailyCardSales, monthlyBrooze, dailyBrooze]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 font-inter">
      <motion.h1 
        className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Business Performance Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full max-w-7xl">
        
        <SectionHeader title="Key Metrics" />
        <StatCard
          title="Monthly Net Sales"
          value={netSalesMonthly}
          isAmount
          colorClass="text-blue-600"
        />
        <StatCard
          title="Daily Net Sales"
          value={netDailyTotal}
          isAmount
          colorClass="text-green-600"
        />

        <SectionHeader title="Sales Breakdown" />
        <StatCard title="Total Cash Sales" value={cashSales.totalAmount} isAmount />
        <StatCard title="Total Card Sales" value={cardSales.totalAmount} isAmount />
        <StatCard title="Today's Cash Sales" value={dailySales.totalAmount} isAmount />
        <StatCard title="Today's Card Sales" value={dailyCardSales.totalAmount} isAmount />

        <SectionHeader title="Expenses" />
        <StatCard title="Monthly Expenses" value={monthlyExpense.totalAmount} isAmount colorClass="text-red-600" />
        <StatCard title="Daily Expenses" value={dailyExpense.totalAmount} isAmount colorClass="text-red-600" />

        <SectionHeader title="Corporate Accounts" />
        <StatCard title="Brooze (Monthly)" value={monthlyBrooze.totalAmount} isAmount colorClass="text-purple-600" />
        <StatCard title="Brooze (Daily)" value={dailyBrooze.totalAmount} isAmount colorClass="text-purple-600" />
        <StatCard title="KPMG (Monthly)" value={monthlyKpmg.totalAmount} isAmount colorClass="text-teal-600" />
        <StatCard title="KPMG (Daily)" value={dailyKpmg.totalAmount} isAmount colorClass="text-teal-600" />

        <SectionHeader title="Delivery Services" />
        {/* Keeta */}
        <StatCard 
          title="Keeta (Monthly)" 
          value={monthlyDeliveries.totalAmount} 
          secondaryValue={`${monthlyDeliveries.totalDeliveries} orders`}
          isAmount
        />
        <StatCard 
          title="Keeta (Daily)" 
          value={dailyDeliveries.totalAmount} 
          secondaryValue={`${dailyDeliveries.totalDeliveries} orders`}
          isAmount
        />

        {/* Hunger Station */}
        <StatCard 
          title="Hunger Station (Monthly)" 
          value={monthlyHunger.totalAmount} 
          secondaryValue={`${monthlyHunger.totalDeliveries} orders`}
          isAmount
        />
        <StatCard 
          title="Hunger Station (Daily)" 
          value={dailyHunger.totalAmount} 
          secondaryValue={`${dailyHunger.totalDeliveries} orders`}
          isAmount
        />

        {/* Noon */}
        <StatCard 
          title="Noon (Monthly)" 
          value={monthlyNoon.totalAmount} 
          secondaryValue={`${monthlyNoon.totalDeliveries} orders`}
          isAmount
        />
        <StatCard 
          title="Noon (Daily)" 
          value={dailyNoon.totalAmount} 
          secondaryValue={`${dailyNoon.totalDeliveries} orders`}
          isAmount
        />

        {/* Jahez */}
        <StatCard 
          title="Jahez (Monthly)" 
          value={monthlyJahez.totalAmount} 
          secondaryValue={`${monthlyJahez.totalDeliveries} orders`}
          isAmount
        />
        <StatCard 
          title="Jahez (Daily)" 
          value={dailyJahez.totalAmount} 
          secondaryValue={`${dailyJahez.totalDeliveries} orders`}
          isAmount
        />

        {/* Marsool */}
        <StatCard 
          title="Marsool (Monthly)" 
          value={monthlyMarsool.totalAmount} 
          secondaryValue={`${monthlyMarsool.totalDeliveries} orders`}
          isAmount
        />
        <StatCard 
          title="Marsool (Daily)" 
          value={dailyMarsool.totalAmount} 
          secondaryValue={`${dailyMarsool.totalDeliveries} orders`}
          isAmount
        />

        {/* Ninja */}
        <StatCard 
          title="Ninja (Monthly)" 
          value={monthlyNinja.totalAmount} 
          secondaryValue={`${monthlyNinja.totalDeliveries} orders`}
          isAmount
        />
        <StatCard 
          title="Ninja (Daily)" 
          value={dailyNinja.totalAmount} 
          secondaryValue={`${dailyNinja.totalDeliveries} orders`}
          isAmount
        />
      </div>
    </div>
  );
};

export default Home;