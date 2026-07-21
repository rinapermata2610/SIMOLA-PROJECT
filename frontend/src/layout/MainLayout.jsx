// =============================================
// File : src/layouts/MainLayout.jsx
// =============================================

import { Outlet } from "react-router-dom";
import { useState } from "react";

import { FaBars } from "react-icons/fa";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* ================= Sidebar ================= */}

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* ================= Main ================= */}

            <div className="flex-1 flex flex-col lg:ml-64">

                {/* ================= Navbar ================= */}

                <Navbar>

                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-700"
                    >
                        <FaBars size={22} />
                    </button>

                </Navbar>

                {/* ================= Content ================= */}

                <main className="flex-1 p-6">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default MainLayout;