// =============================================
// File : src/components/layout/Navbar.jsx
// =============================================

import { FaBars } from "react-icons/fa";

function Navbar({ onMenuClick }) {
    return (
        <button
            type="button"
            aria-label="Buka menu navigasi"
            onClick={onMenuClick}
            className="fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-sky-50 hover:text-sky-600 lg:hidden"
        >
            <FaBars size={19} />
        </button>
    );
}

export default Navbar;