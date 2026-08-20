// =============================================
// File : src/components/admin/AkunFormModal.jsx
// =============================================

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

function AkunFormModal({ open, mode = "create", initialData = null, loading = false, onClose, onSubmit }) {
    const [form, setForm] = useState({
        nama: "",
        email: "",
        username: "",
        nim: "",
        role: "mahasiswa",
        password: "",
    });

    useEffect(() => {
        if (open && initialData) {
            setForm({
                nama: initialData.nama ?? "",
                email: initialData.email ?? "",
                username: initialData.username ?? "",
                nim: initialData.nim ?? "",
                role: initialData.role ?? "mahasiswa",
                password: "",
            });
        } else if (open) {
            setForm({
                nama: "",
                email: "",
                username: "",
                nim: "",
                role: "mahasiswa",
                password: "",
            });
        }
    }, [open, initialData]);

    if (!open) return null;

    const handleChange = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {mode === "edit" ? "Edit Akun" : "Tambah Akun"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {mode === "edit" ? "Ubah data pengguna" : "Buat akun baru"}
                            </p>
                        </div>

                        <button aria-label="Tutup modal" onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-600">
                            <FaTimes />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-semibold text-gray-600">Nama Lengkap</span>
                                <input
                                    aria-label="Nama lengkap"
                                    value={form.nama}
                                    onChange={(e) => handleChange("nama", e.target.value)}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-gray-600">Email</span>
                                <input
                                    aria-label="Email akun"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-semibold text-gray-600">Username</span>
                                <input
                                    aria-label="Username akun"
                                    value={form.username}
                                    onChange={(e) => handleChange("username", e.target.value)}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-gray-600">NIM</span>
                                <input
                                    aria-label="NIM akun"
                                    value={form.nim}
                                    onChange={(e) => handleChange("nim", e.target.value)}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-semibold text-gray-600">Role</span>
                                <select
                                    aria-label="Role akun"
                                    value={form.role}
                                    onChange={(e) => handleChange("role", e.target.value)}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="mahasiswa">Mahasiswa</option>
                                    <option value="pembimbing">Pembimbing</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-gray-600">Password</span>
                                <input
                                    aria-label="Password akun"
                                    type="text"
                                    value={form.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    placeholder={mode === "edit" ? "Kosongkan bila tidak berubah" : "Password awal"}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                aria-label="Batal"
                                onClick={onClose}
                                className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50"
                            >
                                Batal
                            </button>

                            <button
                                type="submit"
                                aria-label={mode === "edit" ? "Simpan perubahan akun" : "Simpan akun baru"}
                                disabled={loading}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm"
                            >
                                {loading ? "Menyimpan..." : mode === "edit" ? "Simpan" : "Tambah Akun"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AkunFormModal;
