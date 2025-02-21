'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MdDashboard, 
  MdOutlineAttachMoney, 
  MdCreditCard, 
  MdBusiness, 
  MdAccountBalance, 
  MdMenu 
} from 'react-icons/md';

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const Menus = [
    { title: 'Dashboard', icon: <MdDashboard />, path: '/' },
    { title: 'Expense by Cash', icon: <MdOutlineAttachMoney />, path: '/expense-by-cash' },
    { title: 'Expense by Credit', icon: <MdCreditCard />, path: '/expense-by-credit' },
    { title: 'Sale by Cash', icon: <MdOutlineAttachMoney />, path: '/SaleByCash' },
    { title: 'Sale by Card', icon: <MdCreditCard />, path: '/CardSale' },
    { title: 'Bruce Company', icon: <MdBusiness />, path: '/BruceCompany' },
    { title: 'KPMG Company', icon: <MdBusiness />, path: '/KPMGCompany' },
    { title: 'Loan', icon: <MdAccountBalance />, path: '/loan' },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar Container */}
      <motion.div
        animate={{ width: open ? '18rem' : '4rem' }}
        className="bg-gray-900 text-white h-full p-5 pt-8 relative shadow-xl transition-all duration-300"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-4 top-9 bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-700 transition"
        >
          <MdMenu className="text-white text-xl" />
        </button>

        {/* Sidebar Header */}
        <div className="flex items-center gap-4">
          <motion.div animate={{ rotate: open ? 360 : 0 }} transition={{ duration: 0.5 }}>
            <MdDashboard className="text-blue-500 text-3xl" />
          </motion.div>
          {open && <h1 className="text-2xl font-semibold">AKC Expense</h1>}
        </div>

        {/* Sidebar Menu */}
        <ul className="pt-6">
          {Menus.map((menu, index) => (
            <li key={index} className="mt-2">
              <Link href={menu.path}>
                <div className="flex items-center gap-4 p-3 cursor-pointer rounded-md hover:bg-blue-500 transition-all duration-200">
                  <span className="text-xl text-white">{menu.icon}</span>
                  {open && <span className="text-lg">{menu.title}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default Sidebar;
