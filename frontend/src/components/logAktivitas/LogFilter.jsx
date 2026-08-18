// =============================================
// File : src/components/logAktivitas/LogFilter.jsx
// =============================================

import { FaSearch, FaSyncAlt } from "react-icons/fa";

function LogFilter({
    filters,
    onChange,
    onSearch,
    onReset,
}) {
    return (
        <div
            className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                shadow-sm
                p-6
            "
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Tanggal Mulai */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tanggal Mulai
                    </label>

                    <input
                        type="date"
                        name="tanggal_mulai"
                        value={filters.tanggal_mulai}
                        onChange={onChange}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            px-4
                            py-3
                            focus:outline-none
                            focus:ring-2
                            focus:ring-sky-500
                        "
                    />
                </div>

                {/* Tanggal Selesai */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tanggal Selesai
                    </label>

                    <input
                        type="date"
                        name="tanggal_selesai"
                        value={filters.tanggal_selesai}
                        onChange={onChange}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            px-4
                            py-3
                            focus:outline-none
                            focus:ring-2
                            focus:ring-sky-500
                        "
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status
                    </label>

                    <select
                        name="status"
                        value={filters.status}
                        onChange={onChange}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            px-4
                            py-3
                            focus:outline-none
                            focus:ring-2
                            focus:ring-sky-500
                        "
                    >
                        <option value="">
                            Semua Status
                        </option>

                        <option value="draft">
                            Draft
                        </option>

                        <option value="terkirim">
                            Terkirim
                        </option>
                    </select>
                </div>

                {/* Tombol */}
                <div className="flex items-end gap-3">

                    <button
                        onClick={onSearch}
                        className="
                            flex-1
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-sky-600
                            px-4
                            py-3
                            text-white
                            hover:bg-sky-700
                            transition
                        "
                    >
                        <FaSearch />

                        Cari
                    </button>

                    <button
                        onClick={onReset}
                        className="
                            w-12
                            h-12
                            rounded-xl
                            border
                            border-slate-300
                            flex
                            items-center
                            justify-center
                            hover:bg-slate-100
                            transition
                        "
                        title="Reset Filter"
                    >
                        <FaSyncAlt />
                    </button>

                </div>

            </div>
        </div>
    );
}

export default LogFilter;