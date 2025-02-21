import Sidebar from "../components/Sidebar/index.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`flex min-h-screen bg-gray-900 text-white ${poppins.className}`}>
                <Sidebar />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            </body>
        </html>
    );
}