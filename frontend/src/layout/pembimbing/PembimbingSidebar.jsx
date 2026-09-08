import { NavLink, useNavigate } from "react-router-dom";
import { FaChartLine, FaClipboardCheck, FaFileAlt, FaHistory, FaSignOutAlt, FaTimes, FaUserCircle } from "react-icons/fa";
import Logo from "../../assets/images/logo-kemendikdasmen.png";
import { useAuth } from "../../context/AuthContext";

export default function PembimbingSidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const menus = [
        { title: "Dashboard monitoring", path: "/pembimbing/dashboard", icon: <FaChartLine /> },
        { title: "Penilaian", path: "/pembimbing/penilaian", icon: <FaClipboardCheck /> },
        { title: "Rekapan Kehadiran", path: "/pembimbing/kehadiran", icon: <FaHistory /> },
        { title: "Laporan", path: "/pembimbing/laporan", icon: <FaFileAlt /> },
    ];
    const handleLogout = async () => { await logout(); navigate("/login", { replace: true }); };

    return (
        <>
            {isOpen && <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}
            <aside className={`print:hidden fixed left-0 top-0 z-50 h-screen w-72 transform border-r border-gray-200 bg-white shadow-xl transition-transform lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6">
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="SIMOLA" className="h-11 w-11 object-contain" />
                        <div>
                            <h2 className="text-xl font-extrabold tracking-tight text-sky-600">SIMOLA</h2>
                            <p className="max-w-[170px] text-[11px] font-semibold leading-4 text-slate-500">Sistem Monitoring &amp; Layanan Magang</p>
                        </div>
                    </div>
                    <button aria-label="Tutup sidebar" onClick={onClose} className="text-gray-600 lg:hidden"><FaTimes size={20} /></button>
                </div>
                <div className="p-5">
                    <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Menu Utama</p>
                    <nav className="space-y-2">
                        {menus.map((menu) => (
                            <NavLink
                                key={menu.path}
                                to={menu.path}
                                onClick={onClose}
                                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 group transition-all duration-200 hover:translate-x-1 ${isActive ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-500/20 [&>span:first-child]:bg-white/20 [&>span:first-child]:text-white" : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"}`}
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[18px] text-slate-500 transition-colors duration-200 group-hover:bg-white group-hover:text-sky-600">{menu.icon}</span>
                                <span className="text-sm font-bold tracking-[-0.01em]">{menu.title}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-5">
                    <div className="mb-4 flex items-center gap-3">
                        <FaUserCircle className="shrink-0 text-sky-600" size={38} />
                        <div>
                            <p className="text-base font-extrabold text-slate-800">{user?.nama ?? "Pembimbing"}</p>
                            <p className="mt-0.5 text-sm font-medium text-slate-500">Pembimbing</p>
                        </div>
                    </div>
                    <button aria-label="Keluar dari akun pembimbing" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-red-600 hover:bg-red-100"><FaSignOutAlt /> Keluar</button>
                </div>
            </aside>
        </>
    );
}
