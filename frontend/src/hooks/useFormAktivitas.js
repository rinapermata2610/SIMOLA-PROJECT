import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function useFormAktivitas() {
    const navigate = useNavigate();
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
            formData.append("judul", form.judul);
            formData.append("deskripsi", form.deskripsi);
            formData.append("hasil", form.hasil);
            
            // Pastikan tanggal selalu terisi
            const targetDate = customDate || form.tanggal || new Date().toISOString().split("T")[0];
            formData.append("tanggal", targetDate);
            formData.append("status", statusType);

            // Menambahkan lampiran file ke FormData
            if (form.lampiran && form.lampiran.length > 0) {
                form.lampiran.forEach((file) => {
                    formData.append("lampiran[]", file);
                });
            }

            const response = await api.post("/mahasiswa/form-aktivitas", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data && response.data.success) {
                resetForm();
                // Pindah ke halaman log aktivitas setelah berhasil
                navigate("/log-aktivitas");
            }
        } catch (error) {
            console.error("Gagal menyimpan aktivitas:", error);
            
            // Tangkap detail error dari Laravel Validation / Server Response
            let msg = "Terjadi kesalahan saat menyimpan data.";
            if (error.response?.data?.errors) {
                // Ambil pesan validasi pertama jika ada error validasi Laravel
                const firstErrorKey = Object.keys(error.response.data.errors)[0];
                msg = error.response.data.errors[firstErrorKey][0];
            } else if (error.response?.data?.message) {
                msg = error.response.data.message;
            }
            
            setErrorMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        loading,
        errorMessage,
        handleChange,
        handleFileChange,
        removeFile,
        submitForm,
        resetForm,
    };
}