import { useState, useEffect, useCallback } from "react";
import api from "../services/api"; // Sesuaikan lokasi instance axios proyekmu

export default function useLogAktivitas() {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
    });

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/mahasiswa/log-aktivitas", {
                params: filters,
            });
            if (response.data.success) {
                setLogs(response.data.data);
            }
        } catch (error) {
            console.error("Gagal memuat log aktivitas:", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleSearch = () => {
        fetchLogs();
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data log ini?")) return;
        try {
            const response = await api.delete(`/mahasiswa/form-aktivitas/${id}`);
            if (response.data.success) {
                fetchLogs();
            }
        } catch (error) {
            alert(error.response?.data?.message || "Gagal menghapus log.");
        }
    };

    return {
        loading,
        logs,
        filters,
        handleSearch,
        handleFilterChange,
        handleDelete,
        refreshLogs: fetchLogs,
    };
}