import { useEffect, useState } from "react";
import {
    FaCheckCircle,
    FaClock,
    FaSpinner,
    FaUserCheck,
    FaUserTie,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import PembimbingLayout from "../../layout/pembimbing/PembimbingLayout";
import pembimbingService from "../../services/pembimbingService";

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(date);
};

export default function Dashboard() {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await pembimbingService.getDashboard();
                const data = response?.data ?? response ?? [];
                setStudents(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError("Gagal memuat data monitoring pembimbing.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const totalMahasiswa = students.length;
    const totalMenunggu = students.reduce(
        (sum, student) => sum + Number(student?.log_summary?.menunggu_verifikasi ?? 0),
        0,
    );
    const totalDisetujui = students.reduce(
        (sum, student) => sum + Number(student?.log_summary?.disetujui ?? 0),
        0,
    );
    const rataKelengkapan = totalMahasiswa
        ? Math.round(
            students.reduce(
                (sum, student) => sum + Number(student?.log_summary?.persentase_kelengkapan ?? 0),
                0,
            ) / totalMahasiswa,
        )
        : 0;

    return (
        <PembimbingLayout>
            <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
                <header className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500 p-6 text-white shadow-lg shadow-sky-200">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-100">
                                Monitoring pembimbing
                            </p>
                            <h1 className="mt-2 text-2xl font-bold md:text-4xl">
                                Dashboard Monitoring
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-sky-50 md:text-base">
                                Pantau perkembangan, status verifikasi, dan capaian aktivitas mahasiswa bimbingan Anda secara real-time.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-100">
                                Nama pembimbing
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white">
                                    <FaUserTie />
                                </div>
                                <p className="text-lg font-semibold text-white">
                                    {user?.nama ?? "Pembimbing"}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Total mahasiswa</p>
                            <span className="rounded-xl bg-sky-100 p-2 text-sky-700">
                                <FaUserCheck />
                            </span>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-slate-800">{totalMahasiswa}</p>
                        <p className="mt-2 text-xs text-slate-500">Mahasiswa dalam bimbingan</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Menunggu verifikasi</p>
                            <span className="rounded-xl bg-amber-100 p-2 text-amber-700">
                                <FaClock />
                            </span>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-slate-800">{totalMenunggu}</p>
                        <p className="mt-2 text-xs text-slate-500">Aktivitas perlu peninjauan</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Disetujui</p>
                            <span className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                                <FaCheckCircle />
                            </span>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-slate-800">{totalDisetujui}</p>
                        <p className="mt-2 text-xs text-slate-500">Aktivitas telah valid</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Rata-rata kelengkapan</p>
                            <span className="rounded-xl bg-violet-100 p-2 text-violet-700">
                                <FaSpinner />
                            </span>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-slate-800">{rataKelengkapan}%</p>
                        <p className="mt-2 text-xs text-slate-500">Berdasarkan progres log</p>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Mahasiswa bimbingan</h2>
                            <p className="text-sm text-slate-500">
                                {totalMahasiswa} mahasiswa terdaftar dalam pengawasan Anda
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-500">
                            Memuat data mahasiswa bimbingan...
                        </div>
                    ) : error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-red-600">
                            {error}
                        </div>
                    ) : students.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-slate-500">
                            Belum ada mahasiswa dalam bimbingan Anda.
                        </div>
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {students.map((student) => {
                                const summary = student?.log_summary ?? {};
                                const completion = Number(summary.persentase_kelengkapan ?? 0);
                                const initials = (student?.nama ?? "M")
                                    .split(" ")
                                    .map((part) => part[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase();

                                const statusLabel =
                                    completion >= 80
                                        ? "Baik"
                                        : completion >= 50
                                            ? "Cukup"
                                            : "Perlu perhatian";

                                return (
                                    <article
                                        key={student.id}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-white hover:shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-base font-bold text-sky-700">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-800">{student.nama}</h3>
                                                    <p className="text-sm text-slate-500">
                                                        {student.nim || "NIM belum tersedia"}
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    completion >= 80
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : completion >= 50
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-rose-100 text-rose-700"
                                                }`}
                                            >
                                                {statusLabel}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                                            <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                    Menunggu
                                                </p>
                                                <p className="mt-2 text-xl font-bold text-slate-800">
                                                    {summary.menunggu_verifikasi ?? 0}
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                    Disetujui
                                                </p>
                                                <p className="mt-2 text-xl font-bold text-slate-800">
                                                    {summary.disetujui ?? 0}
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                    Revisi
                                                </p>
                                                <p className="mt-2 text-xl font-bold text-slate-800">
                                                    {summary.revisi ?? 0}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                                                <span>Kelengkapan log aktivitas</span>
                                                <span className="font-semibold text-slate-700">
                                                    {completion}%
                                                </span>
                                            </div>
                                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500"
                                                    style={{ width: `${completion}%` }}
                                                />
                                            </div>
                                        </div>

                                        {student.email && (
                                            <p className="mt-4 text-sm text-slate-500">{student.email}</p>
                                        )}

                                        {student.periode && (
                                            <p className="mt-2 text-xs text-slate-500">
                                                {student.periode.instansi || "Instansi belum diatur"} • {formatDate(student.periode.tanggal_mulai)} - {formatDate(student.periode.tanggal_selesai)}
                                            </p>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </PembimbingLayout>
    );
}
