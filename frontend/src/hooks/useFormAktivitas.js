import { useState } from "react";
import api from "../services/api";

export default function useFormAktivitas() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [form, setForm] = useState({
        judul: "",
        deskripsi: "",
        hasil: "",
        tanggal: new Date().toISOString().split("T")[0],
        lampiran: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errorMessage) setErrorMessage("");
    };

    const handleFileChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const newFiles = Array.from(e.target.files);
        setForm((prev) => ({
            ...prev,
            lampiran: [...prev.lampiran, ...newFiles],
        }));
        e.target.value = "";
    };

    const removeFile = (index) => {
        setForm((prev) => ({
            ...prev,
            lampiran: prev.lampiran.filter((_, i) => i !== index),
        }));
    };

    const resetForm = () => {
        setForm({
            judul: "",
            deskripsi: "",
            hasil: "",
            tanggal: new Date().toISOString().split("T")[0],
            lampiran: [],
        });
        setErrorMessage("");
    };

    const submitForm = async (statusType = "submitted", customDate = null) => {
        setLoading(true);
        setErrorMessage("");

        try {
            const formData = new FormData();
            formData.append("judul", form.judul || "");
            formData.append("deskripsi", form.deskripsi || "");
            formData.append("hasil", form.hasil || "");

            const targetDate = customDate || form.tanggal || new Date().toISOString().split("T")[0];
            formData.append("tanggal", targetDate);
            formData.append("status", statusType);

            if (form.lampiran && form.lampiran.length > 0) {
                form.lampiran.forEach((file) => {
                    formData.append("lampiran[]", file);
                });
            }

            // Kirim HTTP POST ke Backend Laravel
            const response = await api.post("/mahasiswa/log-aktivitas", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200 || response.status === 201 || response.data?.success) {
                resetForm();
                return true; // Berhasil tersimpan ke database
            }
            return false;
        } catch (error) {
            console.error("Gagal menyimpan aktivitas:", error);
            let msg = "Terjadi kesalahan saat menyimpan data ke database.";
            if (error.response?.data?.errors) {
                const firstKey = Object.keys(error.response.data.errors)[0];
                msg = error.response.data.errors[firstKey][0];
            } else if (error.response?.data?.message) {
                msg = error.response.data.message;
            }
            setErrorMessage(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateForm = async (id) => {
        setLoading(true);
        setErrorMessage("");

        try {
            const formData = new FormData();
            formData.append("tanggal", form.tanggal || "");
            formData.append("judul", form.judul || "");
            formData.append("deskripsi", form.deskripsi || "");
            formData.append("hasil", form.hasil || "");
            formData.append("status", form.status || "draft");
            formData.append("_method", "PUT");

            if (form.lampiran && form.lampiran.length > 0) {
                form.lampiran.forEach((file) => {
                    formData.append("lampiran[]", file);
                });
            }

            const response = await api.post(`/mahasiswa/log-aktivitas/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (!response.data?.success) {
                throw new Error(response.data?.message || "Aktivitas gagal diperbarui.");
            }

            return response.data;
        } catch (error) {
            const message = error.response?.data?.errors
                ? Object.values(error.response.data.errors)[0][0]
                : error.response?.data?.message || error.message;
            setErrorMessage(message || "Terjadi kesalahan saat memperbarui aktivitas.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        setForm,
        loading,
        errorMessage,
        handleChange,
        handleFileChange,
        removeFile,
        submitForm,
        updateForm,
        resetForm,
    };
}