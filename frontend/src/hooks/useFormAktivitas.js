// =============================================
// File : src/hooks/useFormAktivitas.js
// =============================================

import { useState } from "react";
import Swal from "sweetalert2";

import formAktivitasService from "../services/formAktivitasService";

const initialForm = {
    tanggal: "",
    judul: "",
    deskripsi: "",
    hasil: "",
    jam_mulai: "",
    jam_selesai: "",
    lampiran: null,
};

function useFormAktivitas() {
    const [loading, setLoading] = useState(false);

    const [mode, setMode] = useState("create");

    const [activityId, setActivityId] = useState(null);

    const [form, setForm] = useState(initialForm);

    /**
     * Mengubah value form
     */
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    /**
     * Reset Form
     */
    const resetForm = () => {
        setMode("create");
        setActivityId(null);
        setForm(initialForm);
    };

    /**
     * Mengambil data berdasarkan tanggal
     */
    const loadData = async (tanggal) => {
        try {
            setLoading(true);

            const response =
                await formAktivitasService.check(tanggal);

            if (response.exists) {
                setMode("edit");
                setActivityId(response.data.id);

                setForm({
                    tanggal: response.data.tanggal,
                    judul: response.data.judul,
                    deskripsi: response.data.deskripsi,
                    hasil: response.data.hasil,
                    jam_mulai:
                        response.data.jam_mulai ?? "",
                    jam_selesai:
                        response.data.jam_selesai ?? "",
                    lampiran: null,
                });
            } else {
                setMode("create");
                setActivityId(null);

                setForm({
                    ...initialForm,
                    tanggal,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ??
                    "Gagal memuat data aktivitas.",
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Simpan Data
     */
    const handleSubmit = async () => {
        try {
            setLoading(true);

            const formData = new FormData();

            Object.keys(form).forEach((key) => {
                if (
                    form[key] !== null &&
                    form[key] !== ""
                ) {
                    formData.append(key, form[key]);
                }
            });

            let response;

            if (mode === "create") {
                response =
                    await formAktivitasService.store(
                        formData
                    );
            } else {
                response =
                    await formAktivitasService.update(
                        activityId,
                        formData
                    );
            }

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: response.message,
                timer: 1500,
                showConfirmButton: false,
            });

            return response;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ??
                    "Terjadi kesalahan.",
            });

            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        form,
        mode,
        activityId,
        setForm,
        setMode,
        handleChange,
        handleSubmit,
        loadData,
        resetForm,
    };
}

export default useFormAktivitas;