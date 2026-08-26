import { useState } from "react";
import PembimbingSidebar from "./PembimbingSidebar";
import Navbar from "../Navbar";

export default function PembimbingLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100">
            <PembimbingSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="lg:ml-72">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="min-h-screen bg-slate-100 p-6 pt-20 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
