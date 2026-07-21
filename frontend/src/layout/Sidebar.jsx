// =============================================
// File : src/components/layout/Sidebar.jsx
// =============================================

import { NavLink } from "react-router-dom";

import {
    FaHome,
    FaClipboardList,
    FaUserGraduate,
    FaSignOutAlt,
    FaTimes,
} from "react-icons/fa";

import Logo from "../assets/images/logo-kemendikdasmen.png";

function Sidebar({ isOpen, onClose }) {

    const menus = [
        {
            title: "Dashboard",
            icon: <FaHome />,
            path: "/dashboard",
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
                    "
                >
                    <div className="flex items-center gap-3">

                        <img
                            src={Logo}
                            alt="SIMOLA"
                            className="w-11 h-11 object-contain"
                        />

                        <div>

                            <h2 className="font-bold text-xl text-sky-600">
                                SIMOLA
                            </h2>

                            <p className="text-xs text-gray-500">
                                Monitoring Magang
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="lg:hidden text-gray-600"
                    >
                        <FaTimes size={20} />
                    </button>

                </div>

                {/* Menu */}
                <div className="p-5">

                    <p className="text-xs font-semibold text-gray-400 uppercase mb-3">
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
                                    gap-4
                                    px-4
                                    py-3
                                    rounded-xl
                                    transition-all
                                    duration-200
                                    ${
                                        isActive
                                            ? "bg-sky-600 text-white shadow-md"
                                            : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                                    }
                                `
                                }
                            >
                                <span className="text-lg">
                                    {menu.icon}
                                </span>

                                <span className="font-medium">
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
                        border-t
                        p-5
                        bg-white
                    "
                >

                    <div className="mb-4">

                        <p className="font-semibold text-gray-800">
                            Ahmad Fauzi
                        </p>

                        <p className="text-sm text-gray-500">
                            Mahasiswa Magang
                        </p>

                    </div>

                    <button
                        className="
                            w-full
                            flex
                            items-center
                            justify-center
                            gap-2
                            py-3
                            rounded-xl
                            bg-red-50
                            text-red-600
                            hover:bg-red-100
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