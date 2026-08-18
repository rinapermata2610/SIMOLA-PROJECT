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

    useEffect(() => {
        loadDetail();
    }, []);

    const loadDetail = async () => {
        try {
            setLoading(true);

            const response =
                await logAktivitasService.getById(id);

            setActivity(response.data);
        } catch (error) {
            console.error(error);
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
                    Data tidak ditemukan.
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

                            <label className="text-sm text-slate-500">
                                Tanggal
                            </label>

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

                            <label className="text-sm text-slate-500">
                                Judul Aktivitas
                            </label>

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

                        {activity.lampiran ? (

                            <div className="flex items-center justify-between border rounded-xl p-4">

                                <div className="flex items-center gap-3">

                                    <FaFileAlt
                                        size={24}
                                        className="text-red-500"
                                    />

                                    <div>

                                        <p className="font-medium">
                                            {activity.lampiran}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            File Lampiran
                                        </p>

                                    </div>

                                </div>

                                <a
                                    href={activity.lampiran_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        px-4
                                        py-2
                                        rounded-lg
                                        bg-sky-600
                                        text-white
                                        hover:bg-sky-700
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <FaDownload />

                                    Download

                                </a>

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