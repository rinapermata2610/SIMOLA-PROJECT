// =============================================
// File : src/hooks/useLogAktivitas.js
// =============================================

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import logAktivitasService from "../services/logAktivitasService";

function useLogAktivitas() {
    const [loading, setLoading] = useState(false);

    const [logs, setLogs] = useState([]);

    const [filters, setFilters] = useState({
        tanggal_mulai: "",
        tanggal_selesai: "",
        status: "",
    });

    /**
     * Mengambil seluruh data log aktivitas
     */
    const fetchLogs = async () => {
        try {
            setLoading(true);

            const response = await logAktivitasService.getAll(filters);

            setLogs(response.data ?? []);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ??
                    "Gagal mengambil data aktivitas.",
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load pertama
     */
    useEffect(() => {
        fetchLogs();
    }, []);

    /**
     * Mengubah filter
     */
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * Tombol Cari
     */
    const handleSearch = () => {
        fetchLogs();
    };

    /**
     * Refresh data
     */
    const refresh = () => {
        fetchLogs();
    };

    /**
     * Hapus aktivitas
     */
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Hapus Aktivitas?",
            text: "Data yang dihapus tidak dapat dikembalikan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc2626",
        });

        if (!result.isConfirmed) return;

        try {
            setLoading(true);

            const response =
                await logAktivitasService.destroy(id);

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: response.message,
                timer: 1500,
                showConfirmButton: false,
            });

            fetchLogs();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ??
                    "Gagal menghapus aktivitas.",
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,

        logs,

        filters,

        fetchLogs,

        refresh,

        handleDelete,

        handleSearch,

        handleFilterChange,
    };
}

export default useLogAktivitas;