// =============================================
// File : src/components/admin/PeriodeBatchDetailModal.jsx
// =============================================

import { useEffect, useState } from "react";
import { FaTimes, FaTrashAlt } from "react-icons/fa";

import akunService from "../../services/akunService";
import periodeBatchService from "../../services/periodeBatchService";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function PeriodeBatchDetailModal({ batchId, mode = "view", onClose }) {
    const [batch, setBatch] = useState(null);
    const [mahasiswa, setMahasiswa] = useState([]);
    const [mahasiswaList, setMahasiswaList] = useState([]);
    const [pembimbingList, setPembimbingList] = useState([]);
    const [selectedMahasiswaId, setSelectedMahasiswaId] = useState("");
    const [selectedPembimbingId, setSelectedPembimbingId] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const loadData = async () => {
        if (!batchId) return;

        try {
            setLoading(true);
            const response = await periodeBatchService.getDetail(batchId);
            setBatch(response.data ?? null);
            setMahasiswa(response.mahasiswa ?? []);

            const mahasiswaResponse = await akunService.getAll({ role: "mahasiswa" });
            const pembimbingResponse = await akunService.getAll({ role: "pembimbing" });

            setMahasiswaList(mahasiswaResponse.data ?? []);
            setPembimbingList(pembimbingResponse.data ?? []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (batchId) {
            loadData();
        }
    }, [batchId]);

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

    const handleAddMahasiswa = async () => {
        if (!selectedMahasiswaId || !selectedPembimbingId) return;

        try {
            setSubmitting(true);
            await periodeBatchService.addMahasiswa(batchId, {
                mahasiswa_id: Number(selectedMahasiswaId),
                pembimbing_id: Number(selectedPembimbingId),
            });

            setSelectedMahasiswaId("");
            setSelectedPembimbingId("");
            await loadData();
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message ?? "Gagal menambahkan mahasiswa");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;

        try {
            await periodeBatchService.removeMahasiswa(batchId, confirmDelete.id);
            setConfirmDelete(null);
            await loadData();
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message ?? "Gagal menghapus mahasiswa");
        }
    };

    if (!batchId) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {mode === "manage" ? "Kelola Mahasiswa Batch" : "Detail Periode Batch"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {batch?.nama_batch ?? "Memuat data..."}
                            </p>
                        </div>

                        <button
                            type="button"
                            aria-label="Tutup detail batch"
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-600"
                        >
                            <FaTimes className="mx-auto" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-6 text-center text-gray-600">Memuat detail batch...</div>
                    ) : (
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <p className="text-xs uppercase tracking-wide text-gray-500">Nama Batch</p>
                                    <p className="mt-2 font-semibold text-gray-800">{batch?.nama_batch}</p>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <p className="text-xs uppercase tracking-wide text-gray-500">Instansi</p>
                                    <p className="mt-2 font-semibold text-gray-800">{batch?.instansi}</p>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <p className="text-xs uppercase tracking-wide text-gray-500">Status</p>
                                    <p className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                        {batch?.status === "aktif" ? "Berjalan" : "Selesai"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="border border-gray-200 rounded-xl p-4">
                                    <span className="font-semibold text-gray-700">Tanggal Mulai:</span> {formatDate(batch?.tanggal_mulai)}
                                </div>
                                <div className="border border-gray-200 rounded-xl p-4">
                                    <span className="font-semibold text-gray-700">Tanggal Selesai:</span> {formatDate(batch?.tanggal_selesai)}
                                </div>
                            </div>

                            {mode === "manage" && (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tambah Mahasiswa</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <select
                                            aria-label="Pilih mahasiswa"
                                            value={selectedMahasiswaId}
                                            onChange={(e) => setSelectedMahasiswaId(e.target.value)}
                                            className="border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700"
                                        >
                                            <option value="">Pilih Mahasiswa</option>
                                            {mahasiswaList.map((item) => (
                                                <option key={item.id} value={item.id}>{item.nama}</option>
                                            ))}
                                        </select>

                                        <select
                                            aria-label="Pilih pembimbing"
                                            value={selectedPembimbingId}
                                            onChange={(e) => setSelectedPembimbingId(e.target.value)}
                                            className="border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700"
                                        >
                                            <option value="">Pilih Pembimbing</option>
                                            {pembimbingList.map((item) => (
                                                <option key={item.id} value={item.id}>{item.nama}</option>
                                            ))}
                                        </select>

                                        <button
                                            type="button"
                                            aria-label="Tambah mahasiswa ke batch"
                                            onClick={handleAddMahasiswa}
                                            disabled={submitting || !selectedMahasiswaId || !selectedPembimbingId}
                                            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white rounded-xl font-semibold"
                                        >
                                            {submitting ? "Menambah..." : "Tambah"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nama Mahasiswa</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Pembimbing</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                            {mode === "manage" && <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Aksi</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {mahasiswa.length === 0 ? (
                                            <tr>
                                                <td colSpan={mode === "manage" ? 4 : 3} className="px-4 py-8 text-center text-gray-500">
                                                    Belum ada mahasiswa dalam batch ini.
                                                </td>
                                            </tr>
                                        ) : (
                                            mahasiswa.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-3 text-gray-800 font-medium">{item.mahasiswa?.nama ?? "-"}</td>
                                                    <td className="px-4 py-3 text-gray-600">{item.pembimbing?.nama ?? "-"}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${item.status === "aktif" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                                                            {item.status === "aktif" ? "Berjalan" : "Selesai"}
                                                        </span>
                                                    </td>
                                                    {mode === "manage" && (
                                                        <td className="px-4 py-3">
                                                            <button
                                                                aria-label={`Hapus mahasiswa ${item.mahasiswa?.nama ?? "terpilih"}`}
                                                                onClick={() => setConfirmDelete({ id: item.id, nama: item.mahasiswa?.nama ?? "Mahasiswa" })}
                                                                className="text-gray-400 hover:text-red-600"
                                                            >
                                                                <FaTrashAlt size={14} />
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {confirmDelete && (
                <ConfirmDeleteModal
                    title="Hapus Mahasiswa dari Batch"
                    message={`Yakin ingin menghapus ${confirmDelete.nama} dari batch ini?`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </>
    );
}

export default PeriodeBatchDetailModal;
