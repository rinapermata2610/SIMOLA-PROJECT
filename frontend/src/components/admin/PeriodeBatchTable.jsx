// =============================================
// File : src/components/admin/PeriodeBatchTable.jsx
// =============================================

import { FaCalendarAlt, FaEye, FaTasks } from "react-icons/fa";

function PeriodeBatchTable({ data = [], meta = null, loading = false, onView, onManage, onPageChange }) {
    const formatDate = (value) => {
        if (!value) return "-";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const badgeStatus = (status) => {
        if (status === "aktif") {
            return "bg-emerald-100 text-emerald-700";
        }

        return "bg-gray-100 text-gray-600";
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-600">Memuat data periode...</div>;
    }

    return (
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nama Periode / Batch</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Rentang Waktu</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Instansi</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">MHS</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    Belum ada periode magang.
                                </td>
                            </tr>
                        ) : (
                            data.map((batch) => (
                                <tr key={batch.id}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                                <FaCalendarAlt size={14} />
                                            </span>
                                            <div>
                                                <p className="font-semibold text-gray-800">{batch.nama_batch}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {formatDate(batch.tanggal_mulai)} s/d {formatDate(batch.tanggal_selesai)}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">{batch.instansi}</td>

                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                                            {Number(batch.jumlah_mahasiswa ?? 0)}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${badgeStatus(batch.status)}`}>
                                            <span className="inline-block w-2 h-2 rounded-full bg-current" />
                                            {batch.status === "aktif" ? "Berjalan" : "Selesai"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                aria-label={`Kelola mahasiswa batch ${batch.nama_batch}`}
                                                onClick={() => onManage(batch.id)}
                                                className="text-amber-600 hover:text-amber-700"
                                                title="Kelola Mahasiswa"
                                            >
                                                <FaTasks size={16} />
                                            </button>

                                            <button
                                                aria-label={`Lihat detail batch ${batch.nama_batch}`}
                                                onClick={() => onView(batch.id)}
                                                className="text-sky-600 hover:text-sky-700"
                                                title="Lihat Detail"
                                            >
                                                <FaEye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {meta && (
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-gray-500">
                        Menampilkan {data.length} dari {meta.total} periode
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                        {[...Array(Math.max(1, meta.last_page ?? 1))].map((_, index) => {
                            const page = index + 1;
                            const isActive = page === (meta.current_page ?? 1);

                            return (
                                <button
                                    key={page}
                                    aria-label={`Halaman ${page}`}
                                    onClick={() => onPageChange(page)}
                                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${
                                        isActive ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}

export default PeriodeBatchTable;
