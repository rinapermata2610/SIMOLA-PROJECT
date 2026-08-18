// =============================================
// File : src/pages/admin/ManajemenPeriode.jsx
// =============================================

import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaPlusCircle, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";

import StatCard from "../../components/admin/StatCard";
import PeriodeBatchTable from "../../components/admin/PeriodeBatchTable";
import PeriodeBatchFormModal from "../../components/admin/PeriodeBatchFormModal";
import PeriodeBatchDetailModal from "../../components/admin/PeriodeBatchDetailModal";
import periodeBatchService from "../../services/periodeBatchService";

function ManajemenPeriode() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [formMode, setFormMode] = useState("create");
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [detailModal, setDetailModal] = useState({ open: false, mode: "view", batchId: null });

    const fetchData = async (nextPage = page) => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                page: nextPage,
                status: statusFilter !== "all" ? statusFilter : undefined,
                q: searchTerm || undefined,
            };

            const response = await periodeBatchService.getAll(params);
            setData(response.data ?? []);
            setMeta(response.meta ?? null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [statusFilter, searchTerm, page]);

    const stats = useMemo(() => {
        const aktif = data.filter((item) => item.status === "aktif").length;
        const totalMahasiswa = data.reduce((sum, item) => sum + Number(item.jumlah_mahasiswa ?? 0), 0);

        return {
            aktif,
            totalMahasiswa,
        };
    }, [data]);

    const handleCreate = () => {
        setFormMode("create");
        setSelectedBatch(null);
        setFormModalOpen(true);
    };

    const handleEdit = (batch) => {
        setFormMode("edit");
        setSelectedBatch(batch);
        setFormModalOpen(true);
    };

    const handleSubmit = async (payload) => {
        try {
            setLoading(true);

            if (formMode === "edit" && selectedBatch?.id) {
                await periodeBatchService.update(selectedBatch.id, payload);
            } else {
                await periodeBatchService.create(payload);
            }

            setFormModalOpen(false);
            setSelectedBatch(null);
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: formMode === "edit" ? "Periode batch diperbarui." : "Periode batch dibuat.",
            });
            fetchData(page);
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

    return (
        <div className="space-y-6">
            <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Manajemen Periode Magang
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Atur dan pantau jadwal pelaksanaan program magang mahasiswa.
                    </p>
                </div>

                <button
                    aria-label="Buat periode baru"
                    onClick={handleCreate}
                    className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2.5 font-semibold shadow-sm flex items-center gap-2"
                >
                    <FaPlusCircle />
                    + Buat Periode Baru
                </button>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatCard title="Periode Aktif" value={String(stats.aktif)} icon={<FaCalendarAlt />} color="sky" />
                <StatCard title="Total Mahasiswa" value={String(stats.totalMahasiswa)} icon={<FaUsers />} color="emerald" />
            </div>

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h2 className="font-semibold text-gray-800 text-lg">Daftar Periode Magang</h2>

                    <div className="flex flex-col sm:flex-row items-stretch gap-3">
                        <input
                            aria-label="Cari periode batch"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Cari periode atau instansi"
                            className="border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />

                        <select
                            aria-label="Filter status periode"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="all">Semua</option>
                            <option value="aktif">Aktif</option>
                            <option value="selesai">Selesai</option>
                        </select>
                    </div>
                </div>

                {error ? (
                    <div className="py-10 text-center text-red-600">
                        Gagal memuat data periode.
                    </div>
                ) : (
                    <PeriodeBatchTable
                        data={data}
                        meta={meta}
                        loading={loading}
                        onView={(batchId) => setDetailModal({ open: true, mode: "view", batchId })}
                        onManage={(batchId) => setDetailModal({ open: true, mode: "manage", batchId })}
                        onPageChange={(nextPage) => setPage(nextPage)}
                    />
                )}
            </section>

            <PeriodeBatchFormModal
                open={formModalOpen}
                mode={formMode}
                initialData={selectedBatch}
                loading={loading}
                onClose={() => {
                    setFormModalOpen(false);
                    setSelectedBatch(null);
                }}
                onSubmit={handleSubmit}
            />

            {detailModal.open && (
                <PeriodeBatchDetailModal
                    batchId={detailModal.batchId}
                    mode={detailModal.mode}
                    onClose={() => setDetailModal({ open: false, mode: "view", batchId: null })}
                />
            )}
        </div>
    );
}

export default ManajemenPeriode;
