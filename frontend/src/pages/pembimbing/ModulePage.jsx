import PembimbingLayout from "../../layout/pembimbing/PembimbingLayout";

export default function ModulePage({ title, description }) {
    return <PembimbingLayout><div className="mx-auto max-w-7xl space-y-6"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">Pembimbing</p><h1 className="mt-2 text-3xl font-bold text-slate-800">{title}</h1><p className="mt-2 text-sm text-slate-500">{description}</p></div><section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-slate-600">Modul {title.toLowerCase()} siap digunakan setelah data mahasiswa tersedia.</p></section></div></PembimbingLayout>;
}
