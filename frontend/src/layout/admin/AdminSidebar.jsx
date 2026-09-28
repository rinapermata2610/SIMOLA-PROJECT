// =============================================
// File : src/layout/admin/AdminSidebar.jsx
// =============================================

import { NavLink, useNavigate } from "react-router-dom";
import {
    FaCalendarAlt,
    FaSignOutAlt,
    FaThLarge,
    FaTimes,
    FaUsersCog,
} from "react-icons/fa";

import Logo from "../../assets/images/logo-kemendikdasmen.png";
import { useAuth } from "../../context/AuthContext";

function AdminSidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menus = [
        {
            title: "Dashboard",
            icon: <FaThLarge />,
            path: "/admin/dashboard",
        },
        {
            title: "Manajemen Akun",
            icon: <FaUsersCog />,
            path: "/admin/akun",
        },
        {
            title: "Manajemen Periode",
            icon: <FaCalendarAlt />,
            path: "/admin/periode",
        },
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    return (
        <>
            {isOpen && (
                <div
                    aria-label="Tutup sidebar mobile"
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                />
            )}

            <aside
                className={`
                    fixed
                    top-0
                    left-0
                    z-50
                    w-72
                    h-screen
                    bg-white
                    border-r
                    border-slate-200
                    shadow-[8px_0_30px_rgba(15,23,42,0.05)]
                    transform
                    transition-transform
                    duration-300
                    lg:translate-x-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="h-20 px-5 flex items-center justify-between border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <img
                            src={Logo}
                            alt="SIMOLA"
                            className="w-12 h-12 object-contain"
                        />

                        <div>
                            <h2 className="font-extrabold text-xl text-sky-600 tracking-tight">
                                SIMOLA
                            </h2>
                            <p className="text-xs text-slate-500">
                                Sistem Monitoring & Layanan Magang
                            </p>
                        </div>
                    </div>

                    <button
                        aria-label="Tutup sidebar"
                        onClick={onClose}
                        className="lg:hidden text-gray-600"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-5">
                    <p className="text-xs font-bold tracking-[0.16em] text-slate-400 uppercase mb-3">
                        Menu Utama
                    </p>

                    <nav className="space-y-2">
                        {menus.map((menu) => (
                            <NavLink
                                key={menu.path}
                                to={menu.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-200"
                                            : "text-slate-600 hover:bg-sky-50 hover:text-sky-600"
                                    }`
                                }
                            >
                                <span className="text-lg">{menu.icon}</span>
                                <span className="font-medium">{menu.title}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-5 bg-white">
                    <div className="mb-4">
                        <p className="font-bold text-slate-800">
                            {user?.nama ?? "Administrator"}
                        </p>
                        <p className="text-sm text-slate-500">
                            Administrator
                        </p>
                    </div>

                    <button
                        aria-label="Keluar dari akun admin"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                    >
                        <FaSignOutAlt />
                        Keluar
                    </button>
                </div>
            </aside>
        </>
    );
}

export default AdminSidebar;
