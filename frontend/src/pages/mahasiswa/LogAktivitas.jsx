import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaCalendarAlt,
    FaEye,
    FaPaperclip,
    FaPen,
    FaRedoAlt,
    FaSearch,
    FaTrash,
} from "react-icons/fa";
import MainLayout from "../../layout/MainLayout";
import api from "../../services/api";
import logAktivitasService from "../../services/logAktivitasService";
import DeleteDialog from "../../components/logAktivitas/DeleteDialog";

export default function LogAktivitas() {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
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

            if (response.data?.data) {
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

    const openDeleteDialog = (activity) => {
        setSelectedActivity(activity);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedActivity) return;

        try {
            setDeleteLoading(true);
            await logAktivitasService.destroy(selectedActivity.id);
            setDeleteDialogOpen(false);
            setSelectedActivity(null);
            await fetchLogAktivitas();
        } catch (error) {
            console.error("Gagal menghapus aktivitas:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-sky-600 to-cyan-500 px-5 py-6 text-white shadow-sm sm:px-7">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-100">SIMOLA / Aktivitas</p>
                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Log Aktivitas</h1>
                    <p className="mt-1 text-sm text-white/85">Riwayat aktivitas magang yang telah dibuat.</p>
                </div>

                {/* Filter / Search Bar */}
                <form onSubmit={handleSearch} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-800">
                        <FaSearch className="text-sky-600" />
                        Filter aktivitas
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto] xl:items-end">
                        <div>
                        <label htmlFor="tanggal-mulai" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Tanggal Mulai</label>
                        <input
                            id="tanggal-mulai"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                        />
                        </div>
                        <div>
                        <label htmlFor="tanggal-selesai" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Tanggal Selesai</label>
                        <input
                            id="tanggal-selesai"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                        />
                        </div>
                        <div>
                        <label htmlFor="status-filter" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Status</label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                        >
                            <option value="">Semua Status</option>
                            <option value="draft">Draft</option>
                            <option value="submitted">Dikirim</option>
                            <option value="approved">Disetujui</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                        </div>
                        <div className="flex items-end gap-2">
                        <button
                            type="submit"
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-500/20 hover:shadow-lg"
                        >
                            <FaSearch />
                            Cari
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                            title="Refresh data"
                        >
                            <FaRedoAlt />
                        </button>
                        </div>
                    </div>
                </form>

                {/* Tabel Log Aktivitas */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm text-slate-600">
                        <thead className="border-b border-slate-100 bg-slate-50 font-bold uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4 text-xs tracking-wide">Tanggal</th>
                                <th className="px-6 py-4 text-xs tracking-wide">Judul Aktivitas</th>
                                <th className="px-6 py-4 text-xs tracking-wide">Lampiran</th>
                                <th className="px-6 py-4 text-xs tracking-wide">Status</th>
                                <th className="px-6 py-4 text-right text-xs tracking-wide">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-400 font-medium">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-400 font-medium">
                                        Belum ada log aktivitas.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-sky-50/30">
                                        <td className="px-6 py-4 font-semibold text-slate-700">{item.tanggal}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800">{item.judul}</p>
                                            <p className="text-slate-400 line-clamp-1">{item.deskripsi}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.lampiran && item.lampiran.length > 0 ? (
                                                <span className="inline-flex items-center text-blue-600 font-semibold">
                                                    <FaPaperclip className="mr-1.5" /> {item.lampiran.length} file
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
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/log-aktivitas/${item.id}`)}
                                                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Lihat aktivitas"
                                                >
                                                    <FaEye />
                                                </button>
                                                {(item.status === "draft" || item.status === "revision") && (
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/log-aktivitas/${item.id}/edit`)}
                                                        className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                                        title="Edit aktivitas"
                                                    >
                                                        <FaPen />
                                                    </button>
                                                )}
                                                {(item.status === "draft" || item.status === "submitted") && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteDialog(item)}
                                                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Hapus aktivitas"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
            <DeleteDialog
                open={deleteDialogOpen}
                loading={deleteLoading}
                activity={selectedActivity}
                onClose={() => {
                    if (!deleteLoading) {
                        setDeleteDialogOpen(false);
                        setSelectedActivity(null);
                    }
                }}
                onConfirm={handleDelete}
            />
        </MainLayout>
    );
}