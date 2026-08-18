// =============================================
// File : src/pages/mahasiswa/EditLog.jsx
// =============================================

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
} from "react-icons/fa";

import Swal from "sweetalert2";

import MainLayout from "../../layout/MainLayout";

import ActivityForm from "../../components/dashboard/ActivityForm";

import useFormAktivitas from "../../hooks/useFormAktivitas";

function EditLog() {
    const { id } = useParams();

    const navigate = useNavigate();

    const {
        form,
        loading,
        setForm,
        handleChange,
        handleSubmit,
    } = useFormAktivitas();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/mahasiswa/log-aktivitas/${id}`
            );

            const result = await response.json();

            if (result.data) {
                setForm({
                    tanggal: result.data.tanggal,
                    judul: result.data.judul,
                    deskripsi: result.data.deskripsi,
                    hasil: result.data.hasil,
                    lampiran: null,
                    lampiran_lama:
                        result.data.lampiran,
                    status: result.data.status,
                });
            }
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Data aktivitas gagal dimuat.",
            });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await handleSubmit(id);

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Aktivitas berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/log-aktivitas");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">

                {/* Header */}

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() =>
                                navigate("/log-aktivitas")
                            }
                            className="
                                w-10
                                h-10
                                rounded-lg
                                bg-slate-100
                                hover:bg-slate-200
                            "
                        >
                            <FaArrowLeft className="mx-auto" />
                        </button>

                        <div>

                            <h1 className="text-3xl font-bold text-slate-800">
                                Edit Aktivitas
                            </h1>

                            <p className="text-slate-500">
                                Perbarui data aktivitas
                                magang.
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="
                            flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            rounded-xl
                            bg-sky-600
                            text-white
                            hover:bg-sky-700
                            disabled:opacity-50
                        "
                    >
                        <FaSave />

                        {loading
                            ? "Menyimpan..."
                            : "Simpan Perubahan"}
                    </button>

                </div>

                {/* Form */}

                <div
                    className="
                        bg-white
                        rounded-2xl
                        shadow-sm
                        border
                        border-slate-200
                        p-8
                    "
                >
                    <ActivityForm
                        form={form}
                        loading={loading}
                        onChange={handleChange}
                        onSubmit={handleUpdate}
                    />
                </div>

            </div>
        </MainLayout>
    );
}

export default EditLog;