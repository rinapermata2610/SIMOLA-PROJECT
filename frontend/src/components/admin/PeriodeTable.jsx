// =============================================
// File : src/components/admin/PeriodeTable.jsx
// =============================================

import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Link } from "react-router-dom";

function PeriodeTable({ data = [] }) {
    const [openMenu, setOpenMenu] = useState(null);

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

    const statusClassMap = {
        aktif: "bg-emerald-100 text-emerald-700",
        selesai: "bg-gray-100 text-gray-600",
    };

    return (
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Periode Magang Berjalan
                    </h2>
                </div>

                <Link
                    aria-label="Lihat semua periode"
                    to="/admin/periode"
                    className="text-sky-600 text-sm hover:underline"
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
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Nama Instansi
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Tanggal
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Peserta
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <tr key={`${item.instansi}-${item.tanggal_mulai}-${index}`}>
                                    <td className="px-4 py-4">
                                        <p className="font-semibold text-gray-800">
                                            {item.instansi}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDate(item.tanggal_mulai)} • {item.status}
                                        </p>
                                    </td>

                                    <td className="px-4 py-4 text-sm text-gray-600">
                                        {formatDate(item.tanggal_mulai)} - {formatDate(item.tanggal_selesai)}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className="font-bold text-gray-800">
                                            {Number(item.jumlah_peserta ?? 0).toLocaleString("id-ID")}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusClassMap[item.status] ?? "bg-gray-100 text-gray-600"}`}> 
                                            {item.status === "aktif" ? "BERJALAN" : item.status === "selesai" ? "SELESAI" : item.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 relative">
                                        <button
                                            aria-label="Opsi lain untuk periode"
                                            onClick={() => setOpenMenu(openMenu === index ? null : index)}
                                            className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-600"
                                        >
                                            <FaEllipsisV />
                                        </button>

                                        {openMenu === index && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                    Detail
                                                </button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default PeriodeTable;
