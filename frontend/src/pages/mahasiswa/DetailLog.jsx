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
                <div className="bg-white rounded-2xl p-10 shadow text-center">
                    Memuat data...
                </div>
            </MainLayout>
        );
    }

    if (!activity) {
        return (
            <MainLayout>
                <div className="bg-white rounded-2xl p-10 shadow text-center">
                    <p className="text-red-600">{errorMessage || "Data tidak ditemukan."}</p>
                    <button
                        type="button"
                        onClick={() => navigate("/log-aktivitas")}
                        className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                    >
                        Kembali ke Log Aktivitas
                    </button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>

            <div className="space-y-6">

                {/* Header */}

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-4">

                        <button
                            type="button"
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
                                Detail Aktivitas
                            </h1>

                            <p className="text-slate-500">
                                Informasi lengkap aktivitas
                                magang
                            </p>

                        </div>

                    </div>

                    <StatusBadge
                        status={activity.status}
                    />

                </div>

                {/* Card */}

                <div className="bg-white rounded-2xl shadow border border-slate-200 p-8 space-y-8">

                    {/* Informasi */}

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>

                            <p className="text-sm text-slate-500">
                                Tanggal
                            </p>

                            <div className="mt-2 flex items-center gap-3">

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

                            <p className="text-sm text-slate-500">
                                Judul Aktivitas
                            </p>

                            <div className="mt-2 flex items-center gap-3">

                                <FaClipboardList className="text-sky-600" />

                                <span className="font-semibold">
                                    {activity.judul}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Deskripsi */}

                    <div>

                        <h3 className="font-semibold text-lg mb-3">
                            Deskripsi Kegiatan
                        </h3>

                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 leading-7">
                            {activity.deskripsi}
                        </div>

                    </div>

                    {/* Hasil */}

                    <div>

                        <h3 className="font-semibold text-lg mb-3">
                            Hasil / Output
                        </h3>

                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 leading-7">
                            {activity.hasil}
                        </div>

                    </div>

                    {/* Lampiran */}

                    <div>

                        <h3 className="font-semibold text-lg mb-4">
                            Lampiran
                        </h3>

                        {activity.lampiran?.length > 0 ? (
                            <div className="space-y-3">
                                {activity.lampiran.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between border rounded-xl p-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <FaFileAlt size={24} className="text-red-500 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{file.nama_file}</p>
                                                <p className="text-sm text-slate-500">File Lampiran</p>
                                            </div>
                                        </div>
                                        {file.url && (
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 flex items-center gap-2 shrink-0"
                                            >
                                                <FaDownload />
                                                Lihat
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (

                            <div className="border rounded-xl p-6 text-center text-slate-500">
                                Tidak ada lampiran.
                            </div>

                        )}

                    </div>

                </div>

            </div>

        </MainLayout>
    );
}

export default DetailLog;