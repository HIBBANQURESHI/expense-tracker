'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaChartPie, FaExchangeAlt, FaCreditCard, FaBalanceScale, FaBars } from 'react-icons/fa';
import { HiOutlineOfficeBuilding } from "react-icons/hi";


const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const Menus = [
    { title: 'Dashboard', icon: <FaChartPie />, path: '/' },
    { title: 'Expense', icon: <FaExchangeAlt />, path: '/expense' },
    { title: 'Sale', icon: <FaCreditCard />, path: '/sale', gap: true },
    { title: 'Bruce Company', icon: <HiOutlineOfficeBuilding />, path: '/bruce-company' },
    { title: 'Loan', icon: <FaBalanceScale />, path: '/loan' },
    { title: 'KPMG Company', icon: <HiOutlineOfficeBuilding />, path: '/kpmg-company' },
  ];

  return (
    <div className="flex h-screen">
      <motion.div
        animate={{ width: open ? '16rem' : '4rem' }}
        className="bg-gray-900 text-white h-full p-5 pt-8 relative shadow-lg"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-4 top-9 bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-700 transition"
        >
          <FaBars className="text-white text-lg" />
        </button>

        {/* Sidebar Header */}
        <div className="flex items-center gap-4">
          <motion.div animate={{ rotate: open ? 360 : 0 }} transition={{ duration: 0.5 }}>
            <FaChartPie className="text-yellow-500 text-3xl" />
          </motion.div>
          {open && <h1 className="text-2xl font-semibold">AKC Expense</h1>}
        </div>

        {/* Sidebar Menu */}
        <ul className="pt-6">
          {Menus.map((menu, index) => (
            <li key={index} className={`mt-2 ${menu.gap ? 'mt-6' : ''}`}>
              <Link
                href={menu.path}
                className="flex items-center gap-4 p-3 cursor-pointer rounded-md hover:bg-gray-700 transition"
              >
                <span className="text-xl text-yellow-400">{menu.icon}</span>
                {open && <span className="text-lg">{menu.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default Sidebar;
