import { useEffect, useState } from "react";
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaDownload,
    FaFileAlt,
    FaTimesCircle,
    FaUserTie,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import PembimbingLayout from "../../layout/pembimbing/PembimbingLayout";
import pembimbingService from "../../services/pembimbingService";

const formatDateStr = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getMonthRange = (date) => ({
    tanggal_mulai: formatDateStr(new Date(date.getFullYear(), date.getMonth(), 1)),
    tanggal_selesai: formatDateStr(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
});

const formatReadableDate = (dateStr) => {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
};

export default function Penilaian() {
    const { user } = useAuth();
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [comment, setComment] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await pembimbingService.getDashboard();
                const list = response?.data ?? [];
                const studentList = Array.isArray(list) ? list : [];
                setStudents(studentList);
                setSelectedStudentId((previous) => previous ?? studentId ?? studentList[0]?.id ?? null);
            } catch (error) {
                console.error("Gagal memuat mahasiswa bimbingan:", error);
                setStudents([]);
            }
        };

        fetchStudents();
    }, [studentId]);

    const fetchActivities = async () => {
        if (!selectedStudentId) {
            setActivities([]);
            setSelectedActivity(null);
            setComment("");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await pembimbingService.getActivities({
                ...getMonthRange(currentMonth),
                mahasiswa_id: studentId || selectedStudentId,
                per_page: 100,
            });
            const list = response?.data ?? [];
            setActivities(Array.isArray(list) ? list : []);

            if (list.length > 0) {
                setSelectedActivity((previous) => previous || list[0]);
                setComment((previous) => previous || list[0]?.penilaian?.komentar || "");
            } else {
                setSelectedActivity(null);
                setComment("");
            }
        } catch (error) {
            console.error(error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSelectedActivity(null);
        fetchActivities();
    }, [currentMonth, selectedStudentId, studentId]);

    const handleDecision = async (status) => {
        if (!selectedActivity) return;

        try {
            setSaving(true);
            await pembimbingService.verifyActivity(selectedActivity.id, status, comment);
            await fetchActivities();
            alert(status === "approved" ? "Aktivitas disetujui." : "Aktivitas ditolak dan dikembalikan untuk revisi.");
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || "Gagal menyimpan keputusan.");
        } finally {
            setSaving(false);
        }
    };

    const handleViewAttachment = async (file) => {
        try {
            const response = await pembimbingService.viewAttachment(file.id);
            const fileUrl = URL.createObjectURL(response.data);
            window.open(fileUrl, "_blank", "noopener,noreferrer");
            window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
        } catch (error) {
            console.error(error);
            alert("File lampiran tidak dapat dibuka.");
        }
    };

    const monthLabel = new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
    }).format(currentMonth);

    return (
        <PembimbingLayout>
            <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
                <header className="rounded-3xl bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500 p-6 text-white shadow-lg shadow-sky-200">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            {studentId && (
                                <button
                                    type="button"
                                    onClick={() => navigate("/pembimbing/penilaian")}
                                    className="mb-3 text-sm font-semibold text-indigo-100 hover:text-white"
                                >
                                    ← Kembali ke daftar mahasiswa
                                </button>
                            )}
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-100">Pembimbing</p>
                            <h1 className="mt-2 text-2xl font-bold md:text-4xl">Penilaian Mahasiswa</h1>
                            <p className="mt-2 text-sm text-indigo-50 md:text-base">
                                Tinjau aktivitas harian mahasiswa, cek lampiran, dan beri keputusan persetujuan.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white">
                                    <FaUserTie />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-100">Pembimbing</p>
                                    <p className="text-lg font-semibold text-white">{user?.nama ?? "Rina Permata"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="grid gap-6 xl:grid-cols-[1.2fr_1.5fr]">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        {!studentId && <div className="mb-6 border-b border-slate-200 pb-5">
                            <div className="mb-3">
                                <h2 className="text-xl font-bold text-slate-800">Mahasiswa Bimbingan</h2>
                                <p className="text-sm text-slate-500">Pilih mahasiswa untuk melihat dan menilai aktivitasnya</p>
                            </div>

                            {students.length > 0 ? (
                                <div className="space-y-2">
                                    {students.map((student) => (
                                        <button
                                            key={student.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedStudentId(student.id);
                                                setSelectedActivity(null);
                                                setComment("");
                                            }}
                                            className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${selectedStudentId === student.id ? "border-violet-300 bg-violet-50" : "border-slate-200 bg-slate-50 hover:border-violet-200 hover:bg-white"}`}
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-slate-800">{student.nama}</p>
                                                <p className="text-xs text-slate-500">{student.nim || student.username || "NIM belum tersedia"}</p>
                                            </div>
                                            <span className="shrink-0 rounded-full bg-sky-100 px-2 py-1 text-[10px] font-bold text-sky-700">
                                                Pilih
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Belum ada mahasiswa bimbingan.</p>
                            )}
                        </div>}

                        <div className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Aktivitas Bulanan</h2>
                                <p className="text-sm text-slate-500">
                                    {students.find((student) => student.id === selectedStudentId)?.nama || "Pilih mahasiswa terlebih dahulu"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                    aria-label="Bulan sebelumnya"
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    ←
                                </button>
                                <span className="min-w-[150px] text-center text-sm font-bold capitalize text-slate-700">{monthLabel}</span>
                                <button
                                    type="button"
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                    aria-label="Bulan berikutnya"
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">Memuat aktivitas bulan ini...</div>
                        ) : activities.length > 0 ? (
                            <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1">
                                {activities.map((activity) => (
                                    <button
                                        key={activity.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedActivity(activity);
                                            setComment(activity?.penilaian?.komentar ?? "");
                                        }}
                                        className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition ${selectedActivity?.id === activity.id ? "border-violet-300 bg-violet-50 shadow-sm" : "border-slate-200 bg-slate-50 hover:border-violet-200 hover:bg-white"}`}
                                    >
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-500">{formatReadableDate(activity.tanggal)}</p>
                                            <p className="mt-1 truncate text-sm font-semibold text-slate-800">{activity.judul}</p>
                                            <p className="mt-1 truncate text-xs text-slate-500">{activity.mahasiswa?.nama ?? "Mahasiswa"} • {activity.mahasiswa?.nim ?? "-"}</p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${activity.status === "approved" ? "bg-emerald-100 text-emerald-700" : activity.status === "revision" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"}`}>
                                            {activity.status}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">Belum ada aktivitas pada bulan ini.</div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        {loading ? (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
                                Memuat aktivitas mahasiswa...
                            </div>
                        ) : selectedActivity ? (
                            <>
                                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Detail aktivitas</p>
                                        <h2 className="mt-2 text-2xl font-bold text-slate-800">{selectedActivity.judul}</h2>
                                        <p className="mt-1 text-sm text-slate-500">{selectedActivity.mahasiswa?.nama ?? "Mahasiswa"} • {selectedActivity.mahasiswa?.nim ?? "-"}</p>
                                    </div>
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                        selectedActivity.status === "approved"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : selectedActivity.status === "revision"
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-sky-100 text-sky-700"
                                    }`}>
                                        {selectedActivity.status}
                                    </span>
                                </div>

                                <div className="mt-5 space-y-5">
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                        <FaCalendarAlt className="text-violet-600" />
                                        <span>{formatReadableDate(selectedActivity.tanggal)}</span>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Deskripsi</h3>
                                        <p className="text-sm leading-7 text-slate-700">{selectedActivity.deskripsi || "-"}</p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Hasil</h3>
                                        <p className="text-sm leading-7 text-slate-700">{selectedActivity.hasil || "-"}</p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Lampiran</h3>
                                        {selectedActivity.lampiran && selectedActivity.lampiran.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedActivity.lampiran.map((file) => (
                                                    <div key={file.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
                                                        <div className="flex min-w-0 items-center gap-3">
                                                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                                                                <FaFileAlt />
                                                            </span>
                                                            <div className="min-w-0">
                                                                <p className="truncate text-sm font-semibold text-slate-700">{file.nama_file}</p>
                                                                <p className="text-xs text-slate-500">{file.tipe_file || "Dokumen"}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleViewAttachment(file)}
                                                            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-700"
                                                        >
                                                            <FaDownload />
                                                            Lihat
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-500">Tidak ada lampiran untuk aktivitas ini.</p>
                                        )}
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Keputusan</h3>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={4}
                                            placeholder="Masukkan catatan pembimbing..."
                                            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-violet-400"
                                        />

                                        <div className="mt-4 flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleDecision("approved")}
                                                disabled={saving}
                                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <FaCheckCircle />
                                                {saving ? "Menyimpan..." : "Disetujui"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDecision("revision")}
                                                disabled={saving}
                                                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <FaTimesCircle />
                                                {saving ? "Menyimpan..." : "Ditolak / Revisi"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                                Tidak ada aktivitas pada tanggal ini.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </PembimbingLayout>
    );
}
