// =============================================
// File : src/components/layout/Sidebar.jsx
// =============================================

import { NavLink, useNavigate } from "react-router-dom";

import {
    FaHome,
    FaClipboardList,
    FaCalendarCheck,
    FaUserGraduate,
    FaUserCircle,
    FaSignOutAlt,
    FaTimes,
} from "react-icons/fa";

import Logo from "../assets/images/logo-kemendikdasmen.png";
import { useAuth } from "../context/AuthContext";

function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    const menus = [
        {
            title: "Dashboard",
            icon: <FaHome />,
            path: "/dashboard",
        },
        {
            title: "Absensi",
            icon: <FaCalendarCheck />,
            path: "/absensi",
        },
        {
            title: "Log Aktivitas",
            icon: <FaClipboardList />,
            path: "/log-aktivitas",
        },
        {
            title: "Profil",
            icon: <FaUserGraduate />,
            path: "/profil",
        },
    ];

    return (
        <>
            {/* Overlay Mobile */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="
                        fixed
                        inset-0
                        bg-black/40
                        z-40
                        lg:hidden
                    "
                />
            )}

            {/* Sidebar */}
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
                    border-gray-200
                    shadow-xl
                    transform
                    transition-transform
                    duration-300
                    lg:translate-x-0
                    ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* Header */}
                <div
                    className="
                        h-20
                        px-6
                        flex
                        items-center
                        justify-between
                        border-b
                        border-gray-200
                    "
                >
                    <div className="flex items-center gap-3">

                        <img
                            src={Logo}
                            alt="SIMOLA"
                            className="w-11 h-11 object-contain"
                        />

                        <div>

                            <h2 className="text-xl font-extrabold tracking-tight text-sky-600">
                                SIMOLA
                            </h2>

                            <p className="max-w-[170px] text-[11px] font-semibold leading-4 text-slate-500">
                                Sistem Monitoring &amp; Layanan Magang
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

                {/* Menu */}
                <div className="p-5">

                    <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Menu Utama
                    </p>

                    <nav className="space-y-2">

                        {menus.map((menu) => (

                            <NavLink
                                key={menu.path}
                                to={menu.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-2.5
                                    group
                                    transition-all
                                    duration-200
                                    hover:translate-x-1
                                    ${
                                        isActive
                                            ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-500/20 [&>span:first-child]:bg-white/20 [&>span:first-child]:text-white"
                                            : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                                    }
                                `
                                }
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[18px] text-slate-500 transition-colors duration-200 group-hover:bg-white group-hover:text-sky-600">
                                    {menu.icon}
                                </span>

                                <span className="text-sm font-bold tracking-[-0.01em]">
                                    {menu.title}
                                </span>

                            </NavLink>

                        ))}

                    </nav>

                </div>

                {/* Footer */}
                <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        p-5
                        bg-white
                    "
                >

                    <div className="mb-4 flex items-center gap-3">
                        <FaUserCircle className="shrink-0 text-sky-600" size={38} />
                        <div>
                            <p className="text-base font-extrabold text-slate-800">
                                {user?.nama ?? "Ahmad Fauzi"}
                            </p>

                            <p className="mt-0.5 text-sm font-medium text-slate-500">
                                Mahasiswa Magang
                            </p>
                        </div>

                    </div>

                    <button
                        aria-label="Keluar dari akun mahasiswa"
                        onClick={handleLogout}
                        className="
                            w-full
                            flex
                            items-center
                            justify-center
                            gap-2
                            py-3
                            rounded-xl
                            border
                            border-red-100
                            bg-red-50
                            text-red-600
                            hover:bg-red-100
                            hover:border-red-200
                            font-bold
                            transition
                        "
                    >
                        <FaSignOutAlt />

                        Keluar
                    </button>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;