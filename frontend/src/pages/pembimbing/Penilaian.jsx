import { useEffect, useMemo, useState } from "react";
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaDownload,
    FaFileAlt,
    FaTimesCircle,
    FaUserTie,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import PembimbingLayout from "../../layout/pembimbing/PembimbingLayout";
import pembimbingService from "../../services/pembimbingService";

const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();

    const days = [];
    for (let i = 0; i < startOffset; i += 1) {
        days.push(null);
    }

    for (let day = 1; day <= totalDays; day += 1) {
        days.push(new Date(year, month, day));
    }

    while (days.length % 7 !== 0) {
        days.push(null);
    }

    return days;
};

const formatDateStr = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

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
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [activities, setActivities] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [comment, setComment] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await pembimbingService.getActivities();
            const list = response?.data ?? [];
            setActivities(Array.isArray(list) ? list : []);

            if (list.length > 0) {
                setSelectedDate(list[0].tanggal || null);
                setSelectedActivity(list[0]);
                setComment(list[0]?.penilaian?.komentar ?? "");
            }
        } catch (error) {
            console.error(error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const dayMap = useMemo(() => {
        const map = {};
        activities.forEach((item) => {
            if (item?.tanggal) {
                map[item.tanggal] = item;
            }
        });
        return map;
    }, [activities]);

    const monthDays = useMemo(() => getMonthDays(currentMonth), [currentMonth]);

    const handleDateClick = (date) => {
        if (!date) return;
        const key = formatDateStr(date);
        const activity = dayMap[key];
        setSelectedDate(key);
        setSelectedActivity(activity || null);
        setComment(activity?.penilaian?.komentar ?? "");
    };

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
                <header className="rounded-3xl bg-gradient-to-r from-indigo-700 via-violet-600 to-sky-500 p-6 text-white shadow-lg shadow-indigo-200">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
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
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Kalender Aktivitas</h2>
                                <p className="text-sm text-slate-500">Klik tanggal untuk melihat detail kegiatan</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    ←
                                </button>
                                <span className="min-w-[150px] text-center text-sm font-bold text-slate-700">{monthLabel}</span>
                                <button
                                    type="button"
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
                            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                                <div key={day} className="py-2">{day}</div>
                            ))}
                        </div>

                        <div className="mt-2 grid grid-cols-7 gap-2">
                            {monthDays.map((date, index) => {
                                const key = date ? formatDateStr(date) : null;
                                const activity = key ? dayMap[key] : null;
                                const isSelected = key && selectedDate === key;
                                const isToday = date && formatDateStr(date) === formatDateStr(new Date());

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleDateClick(date)}
                                        disabled={!date}
                                        className={`relative min-h-[88px] rounded-2xl border p-2 text-left transition ${
                                            !date
                                                ? "cursor-default border-transparent bg-transparent"
                                                : isSelected
                                                    ? "border-violet-400 bg-violet-50 shadow-sm"
                                                    : "border-slate-200 bg-slate-50 hover:border-violet-200 hover:bg-white"
                                        }`}
                                    >
                                        {date && (
                                            <>
                                                <div className={`text-sm font-semibold ${isToday ? 'text-violet-600' : 'text-slate-700'}`}>
                                                    {date.getDate()}
                                                </div>
                                                {activity && (
                                                    <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                                                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                                                        {activity.judul}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
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
