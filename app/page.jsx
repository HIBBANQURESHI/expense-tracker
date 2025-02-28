"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";



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

// Add filter buttons component
const FilterButton = ({ active, onClick, children }) => (
  <motion.button
    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
      active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);

const LoanTable = ({ loans, title }) => {
  const [filter, setFilter] = useState("monthly");
  const currentDate = new Date();

  // Remove duplicate loans based on _id
  const uniqueLoans = Array.from(new Map(loans.map(loan => [loan._id, loan])).values());

  // Filter loans based on selection (monthly or today)
  const filteredLoans = filter === "monthly" 
    ? uniqueLoans 
    : uniqueLoans.filter(loan => 
        new Date(loan.createdAt).toDateString() === currentDate.toDateString()
      );

  return (
    <div className="col-span-full bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <FilterButton active={filter === "monthly"} onClick={() => setFilter("monthly")}>
            Monthly
          </FilterButton>
          <FilterButton active={filter === "today"} onClick={() => setFilter("today")}>
            Today
          </FilterButton>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm font-medium text-gray-600">
              <th className="p-3 min-w-[160px]">Name</th>
              <th className="p-3 min-w-[120px]">Date</th>
              <th className="p-3 min-w-[140px]">Amount</th>
              <th className="p-3 min-w-[140px]">Received</th>
              <th className="p-3 min-w-[140px]">Remaining</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm text-gray-900 font-medium">
                    {loan.name || "N/A"}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString("en-GB") : "Invalid date"}
                  </td>
                  <td className="p-3 text-sm font-medium text-sky-600">
                    Rs. {(loan.amount || 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm font-medium text-green-700">
                    Rs. {(loan.received || 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm font-medium text-red-700">
                    Rs. {(loan.remaining || 0).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500 text-sm">
                  No loans recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

//BroozeTable
const BroozeTable = ({ loans, title }) => {
  const [filter, setFilter] = useState("monthly");
  const currentDate = new Date();

  // Remove duplicate loans based on _id
  const uniqueLoans = Array.from(new Map(loans.map(loan => [loan._id, loan])).values());

  // Filter loans based on selection (monthly or today)
  const filteredLoans = filter === "monthly" 
    ? uniqueLoans 
    : uniqueLoans.filter(loan => 
        new Date(loan.createdAt).toDateString() === currentDate.toDateString()
      );

  return (
    <div className="col-span-full bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <FilterButton active={filter === "monthly"} onClick={() => setFilter("monthly")}>
            Monthly
          </FilterButton>
          <FilterButton active={filter === "today"} onClick={() => setFilter("today")}>
            Today
          </FilterButton>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm font-medium text-gray-600">
              <th className="p-3 min-w-[160px]">Name</th>
              <th className="p-3 min-w-[120px]">Date</th>
              <th className="p-3 min-w-[140px]">Amount</th>
              <th className="p-3 min-w-[140px]">Credit</th>
              <th className="p-3 min-w-[140px]">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm text-gray-900 font-medium">
                    {loan.name || "N/A"}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString("en-GB") : "Invalid date"}
                  </td>
                  <td className="p-3 text-sm font-medium text-sky-600">
                    Rs. {(loan.amount || 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm font-medium text-green-700">
                    Rs. {(loan.credit || 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm font-medium text-red-700">
                    Rs. {(loan.balance || 0).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500 text-sm">
                  No recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

//KPMGTable
const KPMGTable = ({ loans, title }) => {
  const [filter, setFilter] = useState("monthly");
  const currentDate = new Date();

  // Remove duplicate loans based on _id
  const uniqueLoans = Array.from(new Map(loans.map(loan => [loan._id, loan])).values());

  // Filter loans based on selection (monthly or today)
  const filteredLoans = filter === "monthly" 
    ? uniqueLoans 
    : uniqueLoans.filter(loan => 
        new Date(loan.createdAt).toDateString() === currentDate.toDateString()
      );

  return (
    <div className="col-span-full bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <FilterButton active={filter === "monthly"} onClick={() => setFilter("monthly")}>
            Monthly
          </FilterButton>
          <FilterButton active={filter === "today"} onClick={() => setFilter("today")}>
            Today
          </FilterButton>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm font-medium text-gray-600">
              <th className="p-3 min-w-[160px]">Name</th>
              <th className="p-3 min-w-[120px]">Date</th>
              <th className="p-3 min-w-[140px]">Amount</th>
              <th className="p-3 min-w-[140px]">Credit</th>
              <th className="p-3 min-w-[140px]">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm text-gray-900 font-medium">
                    {loan.name || "N/A"}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString("en-GB") : "Invalid date"}
                  </td>
                  <td className="p-3 text-sm font-medium text-sky-600">
                    Rs. {(loan.amount || 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm font-medium text-green-700">
                    Rs. {(loan.credit || 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm font-medium text-red-700">
                    Rs. {(loan.balance || 0).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500 text-sm">
                  No recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// For Receiving
const ReceivingTable = ({ loans, title }) => {
  const [filter, setFilter] = useState("monthly");
  const currentDate = new Date();

  // Remove duplicate loans based on _id
  const uniqueLoans = Array.from(new Map(loans.map(loan => [loan._id, loan])).values());

  // Filter loans based on selection (monthly or today)
  const filteredLoans = filter === "monthly" 
    ? uniqueLoans 
    : uniqueLoans.filter(loan => 
        new Date(loan.createdAt).toDateString() === currentDate.toDateString()
      );

  return (
    <div className="col-span-full bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <FilterButton active={filter === "monthly"} onClick={() => setFilter("monthly")}>
            Monthly
          </FilterButton>
          <FilterButton active={filter === "today"} onClick={() => setFilter("today")}>
            Today
          </FilterButton>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm font-medium text-gray-600">
              <th className="p-3 min-w-[160px]">Name</th>
              <th className="p-3 min-w-[120px]">Date</th>
              <th className="p-3 min-w-[140px]">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm text-gray-900 font-medium">
                    {loan.name || "N/A"}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString("en-GB") : "Invalid date"}
                  </td>
                  <td className="p-3 text-sm font-medium text-green-700">
                    Rs. {(loan.amount || 0).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500 text-sm">
                  No Receiving recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Home = () => {
  // State variables
  const [cashSales, setCashSales] = useState({ totalSales: 0, totalAmount: 0 });
  const [cardSales, setCardSales] = useState({ totalSales: 0, totalAmount: 0 });
  const [dailySales, setDailySales] = useState({ totalSales: 0, totalAmount: 0 });
  const [dailyCardSales, setDailyCardSales] = useState({ totalSales: 0, totalAmount: 0 });
  const [monthlyExpense, setMonthlyExpense] = useState({ totalAmount: 0 });
  const [dailyExpense, setDailyExpense] = useState({ totalAmount: 0 });
  const [monthlyBrooze, setMonthlyBrooze] = useState([]);
  const [dailyBrooze, setDailyBrooze] = useState([]);
  const [monthlyKpmg, setMonthlyKpmg] = useState([]);
  const [dailyKpmg, setDailyKpmg] = useState([]);
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
  const [monthlyLoan, setMonthlyLoan] = useState([]);
  const [dailyLoan, setDailyLoan] = useState([]);
  const [monthlyReceiving, setMonthlyReceiving] = useState([]);
  const [dailyReceiving, setDailyReceiving] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const day = new Date().getDate();

      try {
        const responses = await Promise.all([
          fetch(`https://akc-expense-server.vercel.app/api/sales/${year}/${month}`),
          fetch(`https://akc-expense-server.vercel.app/api/cardsale/${year}/${month}`),
          fetch(`https://akc-expense-server.vercel.app/api/sales/${year}/${month}/${day}`),
          fetch(`https://akc-expense-server.vercel.app/api/cardsale/${year}/${month}/${day}`),
          fetch(`https://akc-expense-server.vercel.app/api/expense/${year}/${month}`), 
          fetch(`https://akc-expense-server.vercel.app/api/expense/${year}/${month}/${day}`),
          fetch(`https://akc-expense-server.vercel.app/api/brooze/${year}/${month}`),
          fetch(`https://akc-expense-server.vercel.app/api/brooze/${year}/${month}/${day}`),
          fetch(`https://akc-expense-server.vercel.app/api/kpmg/${year}/${month}`),
          fetch(`https://akc-expense-server.vercel.app/api/kpmg/${year}/${month}/${day}`),
          fetch(`https://akc-expense-server.vercel.app/api/keeta/${year}/${month}`),
          fetch(`https://akc-expense-server.vercel.app/api/keeta/${year}/${month}/${day}`),
          fetch(`https://akc-expense-server.vercel.app/api/hunger/${year}/${month}`), 
          fetch(`https://akc-expense-server.vercel.app/api/hunger/${year}/${month}/${day}`),
          fetch(`https://akc-expense-server.vercel.app/api/noon/${year}/${month}`), 
          fetch(`https://akc-expense-server.vercel.app/api/noon/${year}/${month}/${day}`),
          fetch(`https://akc-expense-server.vercel.app/api/jahez/${year}/${month}`), 
          fetch(`https://akc-expense-server.vercel.app/api/jahez/${year}/${month}/${day}`),
          fetch(`https://akc-expense-server.vercel.app/api/marsool/${year}/${month}`), 
          fetch(`https://akc-expense-server.vercel.app/api/marsool/${year}/${month}/${day}`),
          fetch(`https://akc-expense-server.vercel.app/api/ninja/${year}/${month}`), 
          fetch(`https://akc-expense-server.vercel.app/api/ninja/${year}/${month}/${day}`),
          fetch(`https://akc-expense-server.vercel.app/api/loan/${year}/${month}`),
          fetch(`https://akc-expense-server.vercel.app/api/loan/${year}/${month}/${day}`),
          fetch(`https://akc-expense-server.vercel.app/api/receiving/${year}/${month}`),
          fetch(`https://akc-expense-server.vercel.app/api/receiving/${year}/${month}/${day}`)
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
        setMonthlyLoan(data[22]);
        setDailyLoan(data[23]);
        setMonthlyReceiving(data[24]);
        setDailyReceiving(data[25]);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
// In your useEffect for net sales calculations
useEffect(() => {
  const cash = cashSales.totalAmount || 0;
  const card = cardSales.totalAmount || 0;
  const broozeTotal = monthlyBrooze.reduce((acc, loan) => acc + (loan?.amount || 0), 0);
  setNetSalesMonthly(cash + card + broozeTotal);
}, [cashSales, cardSales, monthlyBrooze]);

useEffect(() => {
  const dailyCash = dailySales.totalAmount || 0;
  const dailyCard = dailyCardSales.totalAmount || 0;
  const dailyBroozeTotal = dailyBrooze.reduce((acc, loan) => acc + (loan?.amount || 0), 0);
  setNetDailyTotal(dailyCash + dailyCard + dailyBroozeTotal);
}, [dailySales, dailyCardSales, dailyBrooze]);
  const pdfRef = useRef();

  //PDF Download
const generatePDF = () => {
  const input = pdfRef.current;
  html2canvas(input, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("Financial_Report.pdf");
  });
}


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 font-inter">
      <motion.h1 
        className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Business Performance Dashboard
      </motion.h1>
      {/* Download PDF Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={generatePDF}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Download PDF
        </button>
      </div>

      <div ref={pdfRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full max-w-7xl">
        
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
        <StatCard title="Monthly Expenses" value={monthlyExpense.totalAmount || 0} isAmount colorClass="text-red-600" />
        <StatCard title="Daily Expenses" value={dailyExpense.totalAmount} isAmount colorClass="text-red-600" />

        

        <div className="col-span-full">
          <SectionHeader title="Brooze Company" />
          <BroozeTable 
            loans={[...monthlyBrooze, ...dailyBrooze]} 
            title="Transactions Overview"
          />
        </div>

        <div className="col-span-full">
          <SectionHeader title="KPMG Company" />
          <KPMGTable 
            loans={[...monthlyKpmg, ...dailyKpmg]} 
            title="Transactions Overview"
          />
        </div>

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

        <div className="col-span-full">
          <SectionHeader title="Loan Management" />
          <LoanTable 
            loans={[...monthlyLoan, ...dailyLoan]} 
            title="Loan Transactions Overview"
          />
        </div>

        <div className="col-span-full">
          <SectionHeader title="Receiving Management" />
          <ReceivingTable 
            loans={[...monthlyReceiving, ...dailyReceiving]} 
            title="Receiving Transactions Overview"
          />
        </div>

      </div>
    </div>
  );
};

export default Home;