"use client";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [cashSales, setCashSales] = useState({ totalSales: 0, totalAmount: 0 });
  const [cardSales, setCardSales] = useState({ totalSales: 0, totalAmount: 0 });
  const [netSales, setNetSales] = useState(0);

  useEffect(() => {
    const fetchMonthlySales = async () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1; // getMonth() returns 0-11

      try {
        // Fetch cash sales
        const cashResponse = await fetch(`http://localhost:4000/api/sales/${year}/${month}`);
        if (cashResponse.ok) {
          const cashData = await cashResponse.json();
          setCashSales(cashData);
        } else {
          console.error("Failed to fetch monthly cash sales");
        }

        // Fetch card sales
        const cardResponse = await fetch(`http://localhost:4000/api/cardsale/${year}/${month}`);
        if (cardResponse.ok) {
          const cardData = await cardResponse.json();
          setCardSales(cardData);
        } else {
          console.error("Failed to fetch monthly card sales");
        }
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
      }
    };

    fetchMonthlySales();
  }, []);

  useEffect(() => {
    // Calculate net sales when either cash or card sales change
    setNetSales(cashSales.totalAmount + cardSales.totalAmount);
  }, [cashSales, cardSales]);

  // Check if the month is over and reset data
  useEffect(() => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const timeUntilNextMonth = nextMonth - now;

    const resetData = () => {
      setCashSales({ totalSales: 0, totalAmount: 0 });
      setCardSales({ totalSales: 0, totalAmount: 0 });
      setNetSales(0);
    };

    const resetTimeout = setTimeout(resetData, timeUntilNextMonth);
    return () => clearTimeout(resetTimeout);
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-5xl">Monthly Sales Summary</h1>
      <p className="text-xl mt-4">Total Sales By Cash: {cashSales.totalSales}</p>
      <p className="text-xl">Total Amount By Cash: ${cashSales.totalAmount}</p>
      <p className="text-xl mt-4">Total Sales By Card: {cardSales.totalSales}</p>
      <p className="text-xl">Total Amount By Card: ${cardSales.totalAmount}</p>
      <p className="text-2xl font-bold mt-6">Total Net Sales: ${netSales}</p>
    </div>
  );
};

export default Home;