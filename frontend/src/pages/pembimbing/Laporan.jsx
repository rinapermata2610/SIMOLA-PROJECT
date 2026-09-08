import { useEffect, useMemo, useState } from "react";
import { FaPrint, FaFilePdf, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PembimbingLayout from "../../layout/pembimbing/PembimbingLayout";
import pembimbingService from "../../services/pembimbingService";

const getLocalMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthRange = (month) => {
    const [year, monthNumber] = month.split("-").map(Number);
    const lastDay = new Date(year, monthNumber, 0).getDate();
    return {
        tanggal_mulai: `${year}-${String(monthNumber).padStart(2, "0")}-01`,
        tanggal_selesai: `${year}-${String(monthNumber).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
    };
};

const formatMonth = (month) => {
    if (!month) return "-";
    const [year, monthNumber] = month.split("-").map(Number);
    return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" })
        .format(new Date(year, monthNumber - 1, 1));
};

const formatDate = (value) => {
    if (!value) return "-";
    const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(year, month - 1, day));
};

export default function Laporan() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [month, setMonth] = useState(getLocalMonth());
    const [activities, setActivities] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [loadingReport, setLoadingReport] = useState(false);

    const selectedStudent = useMemo(
        () => students.find((student) => String(student.id) === String(studentId)),
        [students, studentId],
    );

    useEffect(() => {
        const loadStudents = async () => {
            try {
                const response = await pembimbingService.getDashboard();
                const list = Array.isArray(response?.data) ? response.data : [];
                setStudents(list);
                setStudentId(list[0]?.id ? String(list[0].id) : "");
            } catch (error) {
                console.error(error);
                setStudents([]);
            } finally {
                setLoadingStudents(false);
            }
        };

        loadStudents();
    }, []);

    useEffect(() => {
        if (!studentId || !month) {
            setActivities([]);
            return;
        }

        const loadReport = async () => {
            try {
                setLoadingReport(true);
                const response = await pembimbingService.getActivities({
                    mahasiswa_id: studentId,
                    ...getMonthRange(month),
                    per_page: 100,
                });
                setActivities(Array.isArray(response?.data) ? response.data : []);
            } catch (error) {
                console.error(error);
                setActivities([]);
            } finally {
                setLoadingReport(false);
            }
        };

        loadReport();
    }, [studentId, month]);

    const handlePrint = () => window.print();

    return (
        <PembimbingLayout>
            <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
                <div className="print:hidden">
                    <div className="mb-4 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/pembimbing/dashboard")}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            aria-label="Kembali ke dashboard"
                        >
                            <FaArrowLeft />
                        </button>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">Pembimbing</p>
                            <h1 className="mt-1 text-3xl font-bold text-slate-800">Laporan Aktivitas</h1>
                        </div>
                    </div>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
                            <div>
                                <label htmlFor="report-student" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Pilih mahasiswa</label>
                                <select
                                    id="report-student"
                                    value={studentId}
                                    onChange={(event) => setStudentId(event.target.value)}
                                    disabled={loadingStudents}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-500 focus:bg-white"
                                >
                                    <option value="">Pilih mahasiswa bimbingan</option>
                                    {students.map((student) => (
                                        <option key={student.id} value={student.id}>{student.nama} {student.nim ? `- ${student.nim}` : ""}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="report-month" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Periode bulanan</label>
                                <input id="report-month" type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-500 focus:bg-white" />
                            </div>
                            <button type="button" onClick={handlePrint} disabled={!selectedStudent || loadingReport} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50">
                                <FaPrint /> Cetak / Simpan PDF
                            </button>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">Pilih opsi “Save as PDF” pada dialog cetak browser untuk menyimpan laporan sebagai PDF.</p>
                    </section>
                </div>

                <article className="report-paper bg-white px-8 py-10 text-black shadow-sm print:p-0 print:shadow-none">
                    <header className="text-center font-serif">
                        <h2 className="text-xl font-bold uppercase leading-tight">Lembar Evaluasi Hasil Pekerjaan Kegiatan Magang</h2>
                        <h3 className="text-xl font-bold uppercase leading-tight">Balai Bahasa Provinsi Jawa Barat</h3>
                    </header>

                    <div className="mt-10 grid max-w-xl grid-cols-[150px_20px_1fr] gap-y-3 font-serif text-base">
                        <span className="font-bold">Nama</span><span>:</span><span>{selectedStudent?.nama || "-"}</span>
                        <span className="font-bold">Asal Universitas</span><span>:</span><span>Politeknik Negeri Bandung</span>
                        <span className="font-bold">Periode</span><span>:</span><span className="capitalize">{formatMonth(month)}</span>
                    </div>

                    <div className="mt-8 overflow-hidden border border-black">
                        <table className="w-full border-collapse font-serif text-sm">
                            <thead>
                                <tr>
                                    <th rowSpan="2" className="w-16 border border-black px-2 py-3">NO</th>
                                    <th rowSpan="2" className="w-28 border border-black px-2 py-3">TANGGAL</th>
                                    <th rowSpan="2" className="border border-black px-3 py-3">TUGAS YANG<br />DIKERJAKAN</th>
                                    <th rowSpan="2" className="border border-black px-3 py-3">HASIL<br />PEKERJAAN</th>
                                    <th colSpan="2" className="border border-black px-2 py-2">TTD</th>
                                </tr>
                                <tr>
                                    <th className="w-28 border border-black px-2 py-3">PESERTA</th>
                                    <th className="w-28 border border-black px-2 py-3">PEMBIMBING</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingReport ? (
                                    <tr><td colSpan="6" className="border border-black py-10 text-center">Memuat data...</td></tr>
                                ) : activities.length > 0 ? activities.map((activity, index) => (
                                    <tr key={activity.id}>
                                        <td className="border border-black px-2 py-4 text-center align-top">{index + 1}</td>
                                        <td className="border border-black px-2 py-4 text-center align-top">{formatDate(activity.tanggal)}</td>
                                        <td className="border border-black px-3 py-4 align-top">{activity.deskripsi || activity.judul || "-"}</td>
                                        <td className="border border-black px-3 py-4 align-top">{activity.hasil || "-"}</td>
                                        <td className="h-20 border border-black px-2 py-4" />
                                        <td className="border border-black px-2 py-4 text-center align-top" />
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="border border-black py-16 text-center">Belum ada aktivitas pada periode ini.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <footer className="mt-12 grid grid-cols-2 gap-16 text-center font-serif text-sm">
                        <div><p>Peserta Magang</p><div className="h-20" /><p className="font-bold underline">{selectedStudent?.nama || "-"}</p></div>
                        <div><p>Pembimbing</p><div className="h-20" /><p className="font-bold underline">{"Pembimbing"}</p></div>
                    </footer>
                </article>
            </div>
        </PembimbingLayout>
    );
}
