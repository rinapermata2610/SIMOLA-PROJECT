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
import logAktivitasService from "../../services/logAktivitasService";

function EditLog() {
    const { id } = useParams();

    const navigate = useNavigate();

    const {
        form,
        loading,
        setForm,
        handleChange,
        updateForm,
    } = useFormAktivitas();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await logAktivitasService.getById(id);

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
            await updateForm(id);

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
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Header */}

                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-sky-600 to-cyan-500 p-5 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">

                    <div className="flex items-center gap-4">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/log-aktivitas")
                            }
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30"
                        >
                            <FaArrowLeft className="mx-auto" />
                        </button>

                        <div>

                            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-100">SIMOLA / Aktivitas</p>
                            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                Edit Aktivitas
                            </h1>

                            <p className="text-sm text-white/85">
                                Perbarui data aktivitas magang.
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-sky-700 shadow-md hover:bg-sky-50 hover:shadow-lg disabled:opacity-50 sm:px-5"
                    >
                        <FaSave />

                        {loading
                            ? "Menyimpan..."
                            : "Simpan Perubahan"}
                    </button>

                </div>

                {/* Form */}

                <div
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
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