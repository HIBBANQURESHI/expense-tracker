"use client";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [monthlySales, setMonthlySales] = useState({ totalSales: 0, totalAmount: 0 });

  useEffect(() => {
    const fetchMonthlySales = async () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1; // getMonth() returns 0-11

      try {
        const response = await fetch(`http://localhost:4000/api/sales/${year}/${month}`);
        if (response.ok) {
          const data = await response.json();
          setMonthlySales(data);
        } else {
          console.error("Failed to fetch monthly sales");
        }
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
      }
    };

    fetchMonthlySales();
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-5xl">Monthly Sales Summary</h1>
      <p className="text-xl mt-4">Total Sales By Cash: {monthlySales.totalSales}</p>
      <p className="text-xl">Total Amount: ${monthlySales.totalAmount}</p>
    </div>
  );
};

export default Home;
