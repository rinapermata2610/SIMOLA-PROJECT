// =============================================
// File : src/components/admin/PeriodeBatchFormModal.jsx
// =============================================

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

function PeriodeBatchFormModal({ open, mode = "create", initialData = null, loading = false, onClose, onSubmit }) {
    const [form, setForm] = useState({
        nama_batch: "",
        instansi: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        status: "aktif",
    });

    useEffect(() => {
        if (open && initialData) {
            setForm({
                nama_batch: initialData.nama_batch ?? "",
                instansi: initialData.instansi ?? "",
                tanggal_mulai: initialData.tanggal_mulai ?? "",
                tanggal_selesai: initialData.tanggal_selesai ?? "",
                status: initialData.status ?? "aktif",
            });
        } else if (open) {
            setForm({
                nama_batch: "",
                instansi: "",
                tanggal_mulai: "",
                tanggal_selesai: "",
                status: "aktif",
            });
        }
    }, [open, initialData]);

    if (!open) return null;

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.tanggal_selesai && form.tanggal_mulai && form.tanggal_selesai < form.tanggal_mulai) {
            return;
        }

        onSubmit(form);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {mode === "edit" ? "Edit Periode Batch" : "Buat Periode Baru"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {mode === "edit" ? "Perbarui data batch magang" : "Buat gelombang magang baru"}
                            </p>
                        </div>

                        <button
                            type="button"
                            aria-label="Tutup modal periode"
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-600"
                        >
                            <FaTimes className="mx-auto" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block md:col-span-2">
                                <span className="text-sm font-semibold text-gray-600">Nama Batch</span>
                                <input
                                    aria-label="Nama batch"
                                    value={form.nama_batch}
                                    onChange={(e) => handleChange("nama_batch", e.target.value)}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </label>

                            <label className="block md:col-span-2">
                                <span className="text-sm font-semibold text-gray-600">Instansi</span>
                                <input
                                    aria-label="Instansi batch"
                                    value={form.instansi}
                                    onChange={(e) => handleChange("instansi", e.target.value)}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-gray-600">Tanggal Mulai</span>
                                <input
                                    aria-label="Tanggal mulai batch"
                                    type="date"
                                    value={form.tanggal_mulai}
                                    onChange={(e) => handleChange("tanggal_mulai", e.target.value)}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-gray-600">Tanggal Selesai</span>
                                <input
                                    aria-label="Tanggal selesai batch"
                                    type="date"
                                    value={form.tanggal_selesai}
                                    onChange={(e) => handleChange("tanggal_selesai", e.target.value)}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </label>
                        </div>

                        {mode === "edit" && (
                            <label className="block">
                                <span className="text-sm font-semibold text-gray-600">Status</span>
                                <select
                                    aria-label="Status periode batch"
                                    value={form.status}
                                    onChange={(e) => handleChange("status", e.target.value)}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="selesai">Selesai</option>
                                </select>
                            </label>
                        )}

                        {form.tanggal_mulai && form.tanggal_selesai && form.tanggal_selesai < form.tanggal_mulai && (
                            <p className="text-sm text-red-600">Tanggal selesai harus sama atau setelah tanggal mulai.</p>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                aria-label="Batal form periode"
                                onClick={onClose}
                                className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50"
                            >
                                Batal
                            </button>

                            <button
                                type="submit"
                                aria-label={mode === "edit" ? "Simpan perubahan periode" : "Simpan periode baru"}
                                disabled={loading}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm"
                            >
                                {loading ? "Menyimpan..." : mode === "edit" ? "Simpan" : "Buat Periode"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default PeriodeBatchFormModal;
