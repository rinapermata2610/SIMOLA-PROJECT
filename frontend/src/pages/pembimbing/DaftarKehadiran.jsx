import { useEffect, useState } from "react";
import { FaArrowRight, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PembimbingLayout from "../../layout/pembimbing/PembimbingLayout";
import pembimbingService from "../../services/pembimbingService";

export default function DaftarKehadiran() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        pembimbingService.getDashboard()
            .then((response) => setStudents(Array.isArray(response?.data) ? response.data : []))
            .catch((error) => {
                console.error(error);
                setStudents([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <PembimbingLayout>
            <div className="mx-auto max-w-6xl space-y-6 p-4 lg:p-6">
                <header className="rounded-3xl bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500 p-6 text-white shadow-lg shadow-sky-200">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-100">Pembimbing</p>
                    <h1 className="mt-2 text-2xl font-bold md:text-4xl">Rekapan Kehadiran</h1>
                    <p className="mt-2 text-sm text-sky-50">Pilih mahasiswa bimbingan untuk melihat rekap kehadiran.</p>
                </header>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-5">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><FaUsers /></span>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Mahasiswa Bimbingan</h2>
                            <p className="text-sm text-slate-500">{students.length} mahasiswa terdaftar</p>
                        </div>
                    </div>

                    {loading ? (
                        <p className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">Memuat mahasiswa...</p>
                    ) : students.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">Belum ada mahasiswa bimbingan.</p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {students.map((student) => (
                                <button
                                    key={student.id}
                                    type="button"
                                    onClick={() => navigate(`/pembimbing/kehadiran/${student.id}`)}
                                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-sky-300 hover:bg-sky-50 hover:shadow-sm"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-lg font-bold text-slate-800">{student.nama}</p>
                                        <p className="mt-1 text-sm text-slate-500">NIM: {student.nim || "Belum tersedia"}</p>
                                    </div>
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white"><FaArrowRight /></span>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </PembimbingLayout>
    );
}
