// =============================================
// File : src/layout/admin/AdminNavbar.jsx
// =============================================

import {
    FaBars,
    FaSearch,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

function AdminNavbar({ onMenuClick }) {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1">
                <button
                    aria-label="Buka sidebar"
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-700"
                >
                    <FaBars size={20} />
                </button>

                {/* <div className="relative hidden md:block w-full max-w-md">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        aria-label="Cari data, periode, atau mahasiswa"
                        placeholder="Cari data, periode, atau mahasiswa..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-700"
                    />
                </div> */}
            </div>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                        {(user?.nama ?? "A")
                            .split(" ")
                            .map((item) => item[0])
                            .slice(0, 2)
                            .join("")
                        }
                    </div>

                    <div className="hidden md:block">
                        <p className="font-semibold text-gray-800">{user?.nama ?? "Admin"}</p>
                        <p className="text-[11px] font-medium text-gray-500 uppercase">
                            {user?.role ?? "ADMIN"}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default AdminNavbar;
