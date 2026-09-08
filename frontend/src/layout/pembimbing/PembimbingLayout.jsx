import { useState } from "react";
import PembimbingSidebar from "./PembimbingSidebar";
import Navbar from "../Navbar";

export default function PembimbingLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100">
            <PembimbingSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="lg:ml-72">
                <div className="print:hidden"><Navbar onMenuClick={() => setSidebarOpen(true)} /></div>
                <main className="min-h-screen bg-slate-100 p-6 pt-20 lg:p-8 print:bg-white print:p-0">{children}</main>
            </div>
        </div>
    );
}
