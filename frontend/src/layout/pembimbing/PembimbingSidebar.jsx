import { NavLink, useNavigate } from "react-router-dom";
import { FaChartLine, FaClipboardCheck, FaFileAlt, FaHistory, FaSignOutAlt, FaTimes } from "react-icons/fa";
import Logo from "../../assets/images/logo-kemendikdasmen.png";
import { useAuth } from "../../context/AuthContext";

export default function PembimbingSidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const menus = [
        { title: "Dashboard monitoring", path: "/pembimbing/dashboard", icon: <FaChartLine /> },
        { title: "Rekapan Kehadiran", path: "/pembimbing/kehadiran", icon: <FaHistory /> },
        { title: "Penilaian", path: "/pembimbing/penilaian", icon: <FaClipboardCheck /> },
        { title: "Laporan", path: "/pembimbing/laporan", icon: <FaFileAlt /> },
    ];
    const handleLogout = async () => { await logout(); navigate("/login", { replace: true }); };

    return (
        <>
            {isOpen && <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}
            <aside className={`fixed left-0 top-0 z-50 h-screen w-72 transform border-r border-gray-200 bg-white shadow-xl transition-transform lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6">
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="SIMOLA" className="h-11 w-11 object-contain" />
                        <div><h2 className="text-xl font-extrabold text-sky-600">SIMOLA</h2><p className="text-xs text-gray-500">Panel Pembimbing</p></div>
                    </div>
                    <button aria-label="Tutup sidebar" onClick={onClose} className="text-gray-600 lg:hidden"><FaTimes size={20} /></button>
                </div>
                <div className="p-5">
                    <p className="mb-3 px-1 text-xs font-bold uppercase tracking-wide text-gray-400">Menu Utama</p>
                    <nav className="space-y-2">{menus.map((menu) => <NavLink key={menu.path} to={menu.path} onClick={onClose} className={({ isActive }) => `flex items-center gap-4 rounded-xl px-4 py-3 transition ${isActive ? "bg-sky-600 text-white shadow-md" : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"}`}><span className="text-lg">{menu.icon}</span><span className="font-medium">{menu.title}</span></NavLink>)}</nav>
                </div>
                <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-5">
                    <p className="font-semibold text-gray-800">{user?.nama ?? "Pembimbing"}</p><p className="mb-4 text-sm text-gray-500">Pembimbing</p>
                    <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-red-600 hover:bg-red-100"><FaSignOutAlt /> Keluar</button>
                </div>
            </aside>
        </>
    );
}
