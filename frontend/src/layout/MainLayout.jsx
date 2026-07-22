// =============================================
// File : src/layouts/MainLayout.jsx
// =============================================

import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Content */}
            <div className="lg:ml-72">

                {/* Navbar */}
                <Navbar
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* Main */}
                <main
                    className="
                        p-6
                        lg:p-8
                    "
                >
                    {children}
                </main>

            </div>

        </div>
    );
}

export default MainLayout;