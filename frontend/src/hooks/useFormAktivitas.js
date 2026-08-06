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
    files: [],
};

function useFormAktivitas() {
    const [loading, setLoading] = useState(false);

    const [mode, setMode] = useState("create");

    const [activityId, setActivityId] = useState(null);

    const [form, setForm] = useState(initialForm);

    /**
     * Input Text
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * Upload File
     */
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (!selectedFiles.length) return;

        setForm((prev) => ({
            ...prev,
            files: [...prev.files, ...selectedFiles],
        }));
    };

    /**
     * Hapus File
     */
    const removeFile = (index) => {
        setForm((prev) => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index),
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
     * Load Data Berdasarkan Tanggal
     */
    const loadData = async (tanggal) => {
        try {
            setLoading(true);

            const response = await formAktivitasService.check(tanggal);

            if (response.exists) {
                setMode("edit");
                setActivityId(response.data.id);

                setForm({
                    tanggal: response.data.tanggal,
                    judul: response.data.judul || "",
                    deskripsi: response.data.deskripsi || "",
                    hasil: response.data.hasil || "",
                    files: [],
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
            console.error(error);

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
     * Simpan Draft
     */
    const saveDraft = async () => {
        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("tanggal", form.tanggal);
            formData.append("judul", form.judul);
            formData.append("deskripsi", form.deskripsi);
            formData.append("hasil", form.hasil);
            formData.append("status", "draft");

            form.files.forEach((file) => {
                formData.append("lampiran[]", file);
            });

            let response;

            if (mode === "create") {
                response = await formAktivitasService.store(formData);
            } else {
                response = await formAktivitasService.update(
                    activityId,
                    formData
                );
            }

            Swal.fire({
                icon: "success",
                title: "Draft berhasil disimpan",
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
                    "Gagal menyimpan draft.",
            });

            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Kirim Aktivitas
     */
    const submitForm = async (e) => {
        if (e) e.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("tanggal", form.tanggal);
            formData.append("judul", form.judul);
            formData.append("deskripsi", form.deskripsi);
            formData.append("hasil", form.hasil);
            formData.append("status", "submitted");

            form.files.forEach((file) => {
                formData.append("lampiran[]", file);
            });

            let response;

            if (mode === "create") {
                response = await formAktivitasService.store(formData);
            } else {
                response = await formAktivitasService.update(
                    activityId,
                    formData
                );
            }

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Aktivitas berhasil dikirim.",
                timer: 1500,
                showConfirmButton: false,
            });

            resetForm();

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
        handleFileChange,
        removeFile,

        loadData,
        saveDraft,
        submitForm,
        resetForm,
    };
}

export default useFormAktivitas;