// =============================================
// File : src/pages/admin/ManajemenAkun.jsx
// =============================================

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import akunService from "../../services/akunService";
import penugasanService from "../../services/penugasanService";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/common/Loading";
import AkunStatCard from "../../components/admin/AkunStatCard";
import AkunFilterBar from "../../components/admin/AkunFilterBar";
import AkunTable from "../../components/admin/AkunTable";
import AkunFormModal from "../../components/admin/AkunFormModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";

function ManajemenAkun() {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);

    const [targetPage, setTargetPage] = useState(1);
    const [filters, setFilters] = useState({
        role: "",
        status: "",
        q: "",
    });

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [mode, setMode] = useState("create");
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const fetchData = async (nextPage = targetPage) => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                page: nextPage,
                role: filters.role || undefined,
                status: filters.status || undefined,
                q: filters.q || undefined,
            };

            const response = await akunService.getAll(params);
            setData(response.data ?? []);
            setMeta(response.meta ?? null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(targetPage);
    }, [filters.role, filters.status, filters.q, targetPage]);

    const stats = useMemo(() => {
        const total = data.length;
        const mahasiswaAktif = data.filter((item) => item.role === "mahasiswa" && item.is_active).length;
        const pembimbingAktif = data.filter((item) => item.role === "pembimbing" && item.is_active).length;
        const nonaktif = data.filter((item) => item.is_active === false).length;

        return {
            total,
            mahasiswaAktif,
            pembimbingAktif,
            nonaktif,
        };
    }, [data]);

    const openCreateModal = () => {
        setMode("create");
        setSelectedUser(null);
        setFormModalOpen(true);
    };

    const openEditModal = (user) => {
        setMode("edit");
        setSelectedUser(user);
        setFormModalOpen(true);
    };

    const handleSave = async (payload) => {
        try {
            setLoading(true);

            if (mode === "edit" && selectedUser?.id) {
                await akunService.update(selectedUser.id, payload);
                Swal.fire({ icon: "success", title: "Berhasil", text: "Akun diperbarui." });
            } else {
                const response = await akunService.create(payload);

                if (response.password) {
                    Swal.fire({
                        icon: "success",
                        title: "Akun berhasil dibuat",
                        text: `Password awal: ${response.password}`,
                    });
                }
            }

            setFormModalOpen(false);
            fetchData(targetPage);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err?.response?.data?.message ?? "Terjadi kesalahan.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            if (user.is_active) {
                await akunService.deactivate(user.id);
            } else {
                await akunService.activate(user.id);
            }

            Swal.fire({ icon: "success", title: "Berhasil", text: "Status akun diperbarui." });
            fetchData(targetPage);
        } catch (err) {
            Swal.fire({ icon: "error", title: "Gagal", text: err?.response?.data?.message ?? "Gagal ubah status akun." });
        }
    };

    const handleResetPassword = async (user) => {
        try {
            const response = await akunService.resetPassword(user.id);
            Swal.fire({
                icon: "success",
                title: "Password direset",
                text: `Password baru: ${response.password}`,
            });
        } catch (err) {
            Swal.fire({ icon: "error", title: "Gagal", text: err?.response?.data?.message ?? "Gagal reset password." });
        }
    };

    const handleDelete = async (user) => {
        setConfirmDelete({ user });
    };

    const confirmDeleteUser = async () => {
        if (!confirmDelete?.user) return;

        try {
            setLoading(true);
            await akunService.destroy(confirmDelete.user.id);
            Swal.fire({ icon: "success", title: "Berhasil", text: "Akun dihapus." });
            setConfirmDelete(null);
            fetchData(targetPage);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err?.response?.data?.message ?? "Akun tidak bisa dihapus.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAssignPembimbing = async (user, pembimbingId) => {
        if (!user || user.role !== "mahasiswa") return;

        try {
            const payload = {
                mahasiswa_id: user.id,
                pembimbing_id: pembimbingId,
            };

            if (user.has_active_period) {
                await penugasanService.reassign(payload);
            } else {
                await penugasanService.assign(payload);
            }

            Swal.fire({ icon: "success", title: "Berhasil", text: "Pembimbing terkait diperbarui." });
            fetchData(targetPage);
        } catch (err) {
            Swal.fire({ icon: "error", title: "Gagal", text: err?.response?.data?.message ?? "Gagal mengubah pembimbing." });
        }
    };

    return (
        <div className="space-y-6">
            <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Manajemen Akun Pengguna
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Kelola akses, peranan, dan status akun mahasiswa serta pembimbing dalam sistem SIMOLA.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        aria-label="Tambah akun baru"
                        onClick={openCreateModal}
                        className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2.5 font-semibold shadow-sm"
                    >
                        + Tambah Akun
                    </button>
                </div>
            </section>

            {error ? (
                <section className="bg-white border border-gray-200 rounded-2xl p-6">
                    <p className="text-red-600">Gagal memuat data akun.</p>
                    <button aria-label="Coba lagi" onClick={() => fetchData()} className="mt-4 border border-gray-300 rounded-xl px-4 py-2 text-gray-700">
                        Coba Lagi
                    </button>
                </section>
            ) : (
                <>
                    <AkunStatCard stats={stats} />

                    <AkunFilterBar
                        filters={filters}
                        loading={loading}
                        onChange={(key, value) => {
                            setFilters((prev) => ({ ...prev, [key]: value }));
                            setTargetPage(1);
                        }}
                        onReset={() => {
                            setFilters({ role: "", status: "", q: "" });
                            setTargetPage(1);
                        }}
                    />

                    <AkunTable
                        data={data}
                        loading={loading}
                        onEdit={openEditModal}
                        onToggleStatus={handleToggleStatus}
                        onResetPassword={handleResetPassword}
                        onDelete={handleDelete}
                        onAssignPembimbing={handleAssignPembimbing}
                    />

                    {meta && (
                        <section className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Menampilkan {((meta.current_page - 1) * meta.per_page) + 1}-{Math.min(meta.current_page * meta.per_page, meta.total)} dari {meta.total} data
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    aria-label="Halaman sebelumnya"
                                    disabled={meta.current_page <= 1}
                                    onClick={() => setTargetPage((prev) => Math.max(prev - 1, 1))}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Prev
                                </button>

                                {Array.from({ length: meta.last_page }, (_, index) => index + 1).map((page) => (
                                    <button
                                        key={page}
                                        aria-label={`Halaman ${page}`}
                                        onClick={() => setTargetPage(page)}
                                        className={`px-3 py-2 rounded-lg text-sm border ${page === meta.current_page ? "bg-amber-500 text-white border-amber-500" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    aria-label="Halaman berikutnya"
                                    disabled={meta.current_page >= meta.last_page}
                                    onClick={() => setTargetPage((prev) => Math.min(prev + 1, meta.last_page))}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </section>
                    )}
                </>
            )}

            <AkunFormModal
                open={formModalOpen}
                mode={mode}
                initialData={selectedUser}
                onClose={() => setFormModalOpen(false)}
                onSubmit={handleSave}
                loading={loading}
            />

            {confirmDelete && (
                <ConfirmDeleteModal
                    title="Konfirmasi Hapus"
                    message={`Yakin ingin menghapus akun ${confirmDelete.user.nama}? Tindakan ini permanen.`}
                    loading={loading}
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={confirmDeleteUser}
                />
            )}
        </div>
    );
}

export default ManajemenAkun;
