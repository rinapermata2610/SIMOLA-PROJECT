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
        <header className="bg-white/95 backdrop-blur border-b border-slate-200 h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1">
                <button
                    aria-label="Buka sidebar"
                    onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl hover:bg-sky-50 text-slate-700"
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shadow-sky-200">
                        {(user?.nama ?? "A")
                            .split(" ")
                            .map((item) => item[0])
                            .slice(0, 2)
                            .join("")
                        }
                    </div>

                    <div className="hidden md:block">
                        <p className="font-bold text-slate-800">{user?.nama ?? "Admin"}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {user?.role ?? "ADMIN"}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default AdminNavbar;
