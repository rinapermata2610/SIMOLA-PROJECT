import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import api from "../../services/api";

export default function LogAktivitas() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Ambil data log dari Backend Laravel saat komponen dirender
    const fetchLogAktivitas = async () => {
        setLoading(true);
        try {
            const response = await api.get("/mahasiswa/log-aktivitas", {
                params: {
                    tanggal_mulai: startDate,
                    tanggal_selesai: endDate,
                    status: statusFilter,
                },
            });

            if (response.data && response.data.data) {
                setLogs(response.data.data);
            } else if (Array.isArray(response.data)) {
                setLogs(response.data);
            }
        } catch (error) {
            console.error("Gagal mengambil log aktivitas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogAktivitas();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchLogAktivitas();
    };

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        setStatusFilter("");
        fetchLogAktivitas();
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Log Aktivitas</h1>
                    <p className="text-sm text-slate-500">Riwayat aktivitas magang yang telah dibuat.</p>
                </div>

                {/* Filter / Search Bar */}
                <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Tanggal Mulai</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Tanggal Selesai</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Semua Status</option>
                            <option value="draft">Draft</option>
                            <option value="submitted">Dikirim</option>
                            <option value="approved">Disetujui</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                    <div className="flex items-end space-x-2 mt-auto">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all"
                        >
                            🔍 Cari
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs text-slate-600 transition-all"
                            title="Reset Filter"
                        >
                            🔄
                        </button>
                    </div>
                </form>

                {/* Tabel Log Aktivitas */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100 font-bold uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-3.5">Tanggal</th>
                                <th className="px-6 py-3.5">Judul Aktivitas</th>
                                <th className="px-6 py-3.5">Lampiran</th>
                                <th className="px-6 py-3.5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-slate-400 font-medium">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-slate-400 font-medium">
                                        Belum ada log aktivitas.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-700">{item.tanggal}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800">{item.judul}</p>
                                            <p className="text-slate-400 line-clamp-1">{item.deskripsi}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.lampiran && item.lampiran.length > 0 ? (
                                                <span className="inline-flex items-center text-blue-600 font-semibold">
                                                    📎 {item.lampiran.length} file
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                item.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : item.status === "draft"
                                                    ? "bg-slate-100 text-slate-600"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}