import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import PembimbingLayout from "../../layout/pembimbing/PembimbingLayout";
import pembimbingService from "../../services/pembimbingService";

const monthLabel = (value) => new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(`${value}-01`));

export default function RekapKehadiran() {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [student, setStudent] = useState(null);
    const [records, setRecords] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [studentsResponse, attendanceResponse] = await Promise.all([
                    pembimbingService.getDashboard(),
                    pembimbingService.getAttendance(studentId, month),
                ]);
                const students = studentsResponse?.data ?? [];
                setStudent(students.find((item) => String(item.id) === String(studentId)) || null);
                setRecords(attendanceResponse?.data ?? []);
                setSummary(attendanceResponse?.summary ?? {});
            } catch (error) {
                console.error(error);
                setRecords([]);
                setSummary({});
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [studentId, month]);

    return (
        <PembimbingLayout>
            <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
                <header className="rounded-3xl bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500 p-6 text-white shadow-lg shadow-sky-200">
                    <button type="button" onClick={() => navigate("/pembimbing/kehadiran")} className="mb-3 text-sm font-semibold text-sky-100 hover:text-white">← Kembali ke daftar mahasiswa</button>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-100">Rekap kehadiran mahasiswa</p>
                    <h1 className="mt-2 text-2xl font-bold md:text-4xl">{student?.nama || "Memuat mahasiswa..."}</h1>
                    <p className="mt-1 text-sm text-sky-50">NIM: {student?.nim || "-"}</p>
                </header>

                <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <label htmlFor="attendance-month" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Pilih bulan</label>
                        <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-sky-600" />
                            <input id="attendance-month" type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-sky-500" />
                            <span className="text-sm font-semibold capitalize text-slate-600">{monthLabel(month)}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl bg-sky-50 px-4 py-3"><p className="text-xs text-sky-600">Hari absen</p><p className="text-xl font-bold text-sky-800">{summary.hari_absen ?? 0}</p></div>
                        <div className="rounded-xl bg-emerald-50 px-4 py-3"><p className="text-xs text-emerald-600">Masuk</p><p className="text-xl font-bold text-emerald-800">{summary.hadir_masuk ?? 0}</p></div>
                        <div className="rounded-xl bg-indigo-50 px-4 py-3"><p className="text-xs text-indigo-600">Keluar</p><p className="text-xl font-bold text-indigo-800">{summary.hadir_keluar ?? 0}</p></div>
                        <div className="rounded-xl bg-amber-50 px-4 py-3"><p className="text-xs text-amber-600">Terlambat</p><p className="text-xl font-bold text-amber-800">{summary.terlambat_masuk ?? 0}</p></div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Tanggal</th><th className="px-5 py-4">Jam Masuk</th><th className="px-5 py-4">Status Masuk</th><th className="px-5 py-4">Jam Keluar</th><th className="px-5 py-4">Status Keluar</th></tr></thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? <tr><td colSpan="5" className="p-10 text-center">Memuat rekap kehadiran...</td></tr> : records.length === 0 ? <tr><td colSpan="5" className="p-10 text-center text-slate-400">Belum ada data kehadiran pada bulan ini.</td></tr> : records.map((record) => <tr key={record.id} className="hover:bg-sky-50/40"><td className="px-5 py-4 font-semibold text-slate-700">{record.tanggal}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-2"><FaClock className="text-emerald-500" />{record.jam_masuk || "-"}</span></td><td className="px-5 py-4"><span className={record.status_masuk === "terlambat" ? "text-amber-600" : "text-emerald-600"}>{record.status_masuk || "-"}</span></td><td className="px-5 py-4"><span className="inline-flex items-center gap-2"><FaSignOutAlt className="text-indigo-500" />{record.jam_keluar || "-"}</span></td><td className="px-5 py-4"><span className="text-slate-600">{record.status_keluar || "-"}</span></td></tr>)}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </PembimbingLayout>
    );
}
