// =============================================
// File : src/components/admin/AkunFilterBar.jsx
// =============================================

import { FaFilter, FaRedo } from "react-icons/fa";

function AkunFilterBar({ filters, onChange, onReset, loading }) {
    return (
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaFilter />
                        <span className="text-sm font-semibold">Filter</span>
                    </div>

                    <select
                        aria-label="Filter role akun"
                        value={filters.role ?? ""}
                        onChange={(e) => onChange("role", e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 bg-white"
                    >
                        <option value="">Semua Role</option>
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="pembimbing">Pembimbing</option>
                        <option value="admin">Admin</option>
                    </select>

                    <select
                        aria-label="Filter status akun"
                        value={filters.status ?? ""}
                        onChange={(e) => onChange("status", e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 bg-white"
                    >
                        <option value="">Semua Status Akun</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Nonaktif</option>
                    </select>
                </div>

                <button
                    aria-label="Reset filter akun"
                    disabled={loading}
                    onClick={onReset}
                    className="flex items-center gap-2 text-amber-600 text-sm font-medium hover:text-amber-700"
                >
                    <FaRedo />
                    Reset Filter
                </button>
            </div>
        </section>
    );
}

export default AkunFilterBar;
