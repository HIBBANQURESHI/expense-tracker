import Sidebar from "../components/Sidebar/index.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  display: 'swap', // Helps with FOUT issues
});

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <link rel="preload" href="/_next/static/css/0acef4df005bbe6c.css" as="style" />
            <body className={`flex min-h-screen bg-white text-black ${poppins.className}`}>
                <Sidebar />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            </body>
        </html>
    );
}
