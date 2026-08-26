// =============================================
// File : src/pages/mahasiswa/DetailLog.jsx
// =============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClipboardList,
    FaFileAlt,
    FaDownload,
} from "react-icons/fa";

import MainLayout from "../../layout/MainLayout";
import logAktivitasService from "../../services/logAktivitasService";
import StatusBadge from "../../components/logAktivitas/StatusBadge";

function DetailLog() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [activity, setActivity] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        loadDetail();
    }, [id]);

    const loadDetail = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const response =
                await logAktivitasService.getById(id);

            if (!response?.success || !response.data) {
                throw new Error(response?.message || "Data aktivitas tidak ditemukan.");
            }

            setActivity(response.data);
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error.response?.data?.message ||
                error.message ||
                "Data aktivitas gagal dimuat."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-medium text-slate-500 shadow-sm">
                    Memuat detail aktivitas...
                </div>
            </MainLayout>
        );
    }

    if (!activity) {
        return (
            <MainLayout>
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-sm font-semibold text-red-600">{errorMessage || "Data tidak ditemukan."}</p>
                    <button
                        type="button"
                        onClick={() => navigate("/log-aktivitas")}
                        className="mt-5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg"
                    >
                        Kembali ke Log Aktivitas
                    </button>
                </div>
            </MainLayout>
        );
    }

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
                                Detail Aktivitas
                            </h1>

                            <p className="text-sm text-white/85">
                                Informasi lengkap aktivitas magang
                            </p>

                        </div>

                    </div>

                    <div className="w-fit rounded-full bg-white px-1 py-1 shadow-md">
                        <StatusBadge status={activity.status} />
                    </div>

                </div>

                {/* Card */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* Informasi */}

                    <div className="grid gap-4 border-b border-slate-100 bg-slate-50/70 p-5 sm:p-6 md:grid-cols-2">

                        <div>

                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Tanggal
                            </p>

                            <div className="mt-2 flex items-center gap-3 text-sm font-bold text-slate-800">

                                <FaCalendarAlt className="text-sky-600" />

                                <span className="font-medium">
                                    {new Date(
                                        activity.tanggal
                                    ).toLocaleDateString(
                                        "id-ID",
                                        {
                                            weekday:
                                                "long",
                                            day: "numeric",
                                            month:
                                                "long",
                                            year: "numeric",
                                        }
                                    )}
                                </span>

                            </div>

                        </div>

                        <div>

                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Judul Aktivitas
                            </p>

                            <div className="mt-2 flex items-center gap-3 text-sm font-bold text-slate-800">

                                <FaClipboardList className="text-sky-600" />

                                <span className="font-semibold">
                                    {activity.judul}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Deskripsi */}

                    <div className="space-y-8 p-5 sm:p-8">

                    <div>

                        <h3 className="mb-3 text-base font-extrabold text-slate-800">
                            Deskripsi Kegiatan
                        </h3>

                        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 text-sm leading-7 text-slate-600">
                            {activity.deskripsi}
                        </div>

                    </div>

                    {/* Hasil */}

                    <div>

                        <h3 className="mb-3 text-base font-extrabold text-slate-800">
                            Hasil / Output
                        </h3>

                        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 text-sm leading-7 text-slate-600">
                            {activity.hasil}
                        </div>

                    </div>

                    {/* Lampiran */}

                    <div>

                        <h3 className="mb-4 text-base font-extrabold text-slate-800">
                            Lampiran
                        </h3>

                        {activity.lampiran?.length > 0 ? (
                            <div className="space-y-3">
                                {activity.lampiran.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-sky-200 hover:bg-sky-50/40">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <FaFileAlt size={22} className="shrink-0 text-sky-600" />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-slate-700">{file.nama_file}</p>
                                                <p className="text-xs text-slate-400">File Lampiran</p>
                                            </div>
                                        </div>
                                        {file.url && (
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:shadow-md"
                                            >
                                                <FaDownload />
                                                Lihat
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (

                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
                                Tidak ada lampiran.
                            </div>

                        )}

                    </div>

                </div>

            </div>

            </div>

        </MainLayout>
    );
}

export default DetailLog;