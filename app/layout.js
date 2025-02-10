import Sidebar from "../components/Sidebar/index.jsx";
import "./globals.css";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="flex">
                <Sidebar />
                <main className="flex-1">{children}</main>
            </body>
        </html>
    );
}
