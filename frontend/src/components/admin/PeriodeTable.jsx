// =============================================
// File : src/components/admin/PeriodeTable.jsx
// =============================================

import { Link } from "react-router-dom";
import { getPeriodeStatus } from "../../utils/periodeStatus";

function PeriodeTable({ data = [] }) {
    const formatDate = (value) => {
        if (!value) return "-";

        const parsed = new Date(value);

        if (Number.isNaN(parsed.getTime())) {
            return value;
        }

        return parsed.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <section className="bg-white border border-slate-200 rounded-2xl shadow-[0_4px_18px_rgba(15,23,42,0.06)] p-5 md:p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800">
                        Periode Magang Berjalan
                    </h2>
                </div>

                <Link
                    aria-label="Lihat semua periode"
                    to="/admin/periode"
                    className="text-sky-600 text-sm font-bold hover:text-cyan-600 hover:underline"
                >
                    Lihat Semua →
                </Link>
            </div>

            {data.length === 0 ? (
                <div className="py-10 text-center text-gray-600">
                    Belum ada data periode magang.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Nama Instansi
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Peserta
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {data.map((item, index) => {
                                const status = getPeriodeStatus(
                                    item.tanggal_mulai,
                                    item.tanggal_selesai,
                                    item.status,
                                );

                                return (
                                <tr key={`${item.instansi}-${item.tanggal_mulai}-${index}`}>
                                    <td className="px-4 py-4">
                                        <p className="font-bold text-slate-800">
                                            {item.instansi}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {formatDate(item.tanggal_mulai)} • {status.label}
                                        </p>
                                    </td>

                                    <td className="px-4 py-4 text-sm text-slate-600">
                                        {formatDate(item.tanggal_mulai)} - {formatDate(item.tanggal_selesai)}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className="font-extrabold text-slate-800">
                                            {Number(item.jumlah_peserta ?? 0).toLocaleString("id-ID")}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${status.className}`}>
                                            {status.label.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default PeriodeTable;
