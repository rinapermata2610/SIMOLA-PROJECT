// =============================================
// File : src/components/layout/Sidebar.jsx
// =============================================

import { NavLink } from "react-router-dom";
import {
    FaTimes,
    FaHome,
    FaClipboardList,
    FaPaperclip,
    FaUserCircle,
    FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const { user, logout } = useAuth();

    const menus = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <FaHome />,
        },
        {
            name: "Log Aktivitas",
            path: "/log-aktivitas",
            icon: <FaClipboardList />,
        },
        {
            name: "Lampiran",
            path: "/lampiran",
            icon: <FaPaperclip />,
        },
        {
            name: "Profil",
            path: "/profile",
            icon: <FaUserCircle />,
        },
    ];

    return (
        <>
            {/* Overlay Mobile */}

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}

            <aside
                className={`
                    fixed
                    top-0
                    left-0
                    z-50
                    h-screen
                    w-64
                    bg-white
                    shadow-xl
                    transform
                    transition-transform
                    duration-300

                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }

                    lg:translate-x-0
                `}
            >
                {/* Header */}

                <div className="bg-blue-700 text-white p-6">

                    <div className="flex justify-between items-center">

                        <div>

                            <h1 className="text-2xl font-bold">
                                SIMOLA
                            </h1>

                            <p className="text-sm text-blue-100">
                                Mahasiswa
                            </p>

                        </div>

                        <button
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <FaTimes size={20} />
                        </button>

                    </div>

                </div>

                {/* User */}

                <div className="border-b p-5">

                    <p className="font-semibold text-gray-800">
                        {user?.nama}
                    </p>

                    <p className="text-sm text-gray-500">
                        {user?.username}
                    </p>

                </div>

                {/* Menu */}

                <nav className="p-4 space-y-2">

                    {menus.map((menu) => (
                        <NavLink
                            key={menu.path}
                            to={menu.path}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                rounded-xl
                                transition

                                ${
                                    isActive
                                        ? "bg-blue-700 text-white"
                                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                }
                                `
                            }
                        >
                            {menu.icon}

                            <span>{menu.name}</span>
                        </NavLink>
                    ))}

                </nav>

                {/* Logout */}

                <div className="absolute bottom-5 left-0 right-0 px-4">

                    <button
                        onClick={logout}
                        className="
                            w-full
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-red-500
                            hover:bg-red-600
                            text-white
                            py-3
                            rounded-xl
                            transition
                        "
                    >
                        <FaSignOutAlt />

                        Logout
                    </button>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;