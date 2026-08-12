// =============================================
// File : src/layout/admin/AdminLayout.jsx
// =============================================

import { useState } from "react";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="lg:ml-72 min-h-screen">
                <AdminNavbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="bg-gray-50 min-h-screen px-4 py-6 md:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
