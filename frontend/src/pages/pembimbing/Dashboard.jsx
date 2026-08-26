import { useEffect, useState } from "react";
import PembimbingLayout from "../../layout/pembimbing/PembimbingLayout";
import pembimbingService from "../../services/pembimbingService";

export default function Dashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        pembimbingService.getDashboard().then((response) => setStudents(response.data?.data || response.data || [])).finally(() => setLoading(false));
    }, []);

    return <PembimbingLayout><div className="mx-auto max-w-7xl space-y-6"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">Pembimbing</p><h1 className="mt-2 text-3xl font-bold text-slate-800">Dashboard monitoring</h1><p className="mt-2 text-sm text-slate-500">Pantau mahasiswa yang berada dalam bimbingan Anda.</p></div><section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-slate-800">Mahasiswa Bimbingan</h2>{loading ? <p className="mt-5 text-slate-500">Memuat data...</p> : students.length === 0 ? <p className="mt-5 text-slate-500">Belum ada mahasiswa bimbingan.</p> : <div className="mt-5 grid gap-3 md:grid-cols-2">{students.map((student) => <div key={student.id} className="rounded-lg border border-slate-200 p-4"><p className="font-bold text-slate-800">{student.nama}</p><p className="mt-1 text-sm text-slate-500">{student.nim || student.email}</p></div>)}</div>}</section></div></PembimbingLayout>;
}
