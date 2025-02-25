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
  MdMenu, 
  MdMoney,
} from 'react-icons/md';
import { GrDeliver } from "react-icons/gr";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  const Menus = [
    { title: 'Dashboard', icon: <MdDashboard />, path: '/' },
    { title: 'Expense', icon: <MdMoney />, path: '/Expense' },
    { title: 'Cash Sale', icon: <MdOutlineAttachMoney />, path: '/SaleByCash' },
    { title: 'Card Sale', icon: <MdCreditCard />, path: '/CardSale' },
    { title: 'Brooze Company', icon: <MdBusiness />, path: '/Brooze' },
    { title: 'KPMG Company', icon: <MdBusiness />, path: '/Kpmg' },
    { title: 'Loan', icon: <MdAccountBalance />, path: '/loan' },
  ];

  const Deliveries = [
    { title: 'Keeta Delivery', path: '/Keeta' },
    { title: 'Hunger Delivery', path: '/Hunger' },
    { title: 'Noon Delivery', path: '/Noon' },
    { title: 'Jahez Delivery', path: '/Jahez' },
    { title: 'Marsool Delivery', path: '/Marsool' },
    { title: 'Ninja Delivery', path: '/Ninja' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <motion.div
        animate={{ width: open ? '14rem' : '4rem' }}
        className="bg-gray-900 text-white h-full p-4 pt-6 relative shadow-lg transition-all duration-300 flex flex-col"
      >
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-4 top-6 bg-gray-800 p-2 rounded-full shadow hover:bg-gray-700 transition"
        >
          <MdMenu className="text-white text-lg" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <MdDashboard className="text-blue-500 text-2xl" />
          {open && <h1 className="text-lg font-semibold">AKC Expense</h1>}
        </div>

        <ul className="space-y-2 flex-1 overflow-auto">
          {Menus.map((menu, index) => (
            <li key={index}>
              <Link href={menu.path}>
                <div className="flex items-center gap-3 p-2 cursor-pointer rounded-md hover:bg-blue-500 transition-all">
                  <span className="text-white text-lg">{menu.icon}</span>
                  {open && <span>{menu.title}</span>}
                </div>
              </Link>
            </li>
          ))}
          
          <li>
            <button 
              onClick={() => setDeliveryOpen(!deliveryOpen)}
              className="flex items-center w-full gap-3 p-2 rounded-md hover:bg-blue-500 transition-all"
            >
              <GrDeliver className="text-white text-lg" />
              {open && <span>Deliveries</span>}
              {open && <MdMenu className={`ml-auto transition-transform ${deliveryOpen ? 'rotate-180' : ''}`} />}
            </button>
            {deliveryOpen && (
              <ul className="ml-5 mt-1 space-y-1">
                {Deliveries.map((delivery, index) => (
                  <li key={index}>
                    <Link href={delivery.path}>
                      <div className="flex items-center gap-3 p-2 cursor-pointer rounded-md hover:bg-blue-500 transition-all">
                        <span className="text-white text-sm">•</span>
                        {open && <span>{delivery.title}</span>}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Sidebar;