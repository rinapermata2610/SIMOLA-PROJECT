import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaFilePdf, FaSave, FaUserTie } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import PembimbingLayout from "../../layout/pembimbing/PembimbingLayout";
import pembimbingService from "../../services/pembimbingService";
import logoKemendikdasmen from "../../assets/images/logo-kemendikdasmen.png";

const assessmentAspects = [
    { label: "Etika dan Kedisiplinan", weight: 20 },
    { label: "Kemampuan Berkomunikasi dan Kerja Sama", weight: 15 },
    { label: "Kemandirian", weight: 15 },
    { label: "Kreativitas", weight: 15 },
    { label: "Kemampuan Menyelesaikan Pekerjaan di Bidangnya", weight: 15 },
    { label: "Kemampuan Mengidentifikasi dan Memecahkan Masalah", weight: 20 },
];

const getGrade = (value) => {
    if (value >= 80) return "A";
    if (value >= 70) return "B";
    if (value >= 60) return "C";
    if (value >= 40) return "D";
    return "E";
};

export default function PenilaianAkhir() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [scores, setScores] = useState(() => {
        const storedScores = window.localStorage.getItem(`penilaian-akhir-scores-${studentId}`);
        return storedScores ? JSON.parse(storedScores) : assessmentAspects.map(() => "");
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(() => window.localStorage.getItem(`penilaian-akhir-${studentId}`) === "tersimpan");

    useEffect(() => {
        const loadStudent = async () => {
            try {
                const response = await pembimbingService.getDashboard();
                const students = Array.isArray(response?.data) ? response.data : [];
                setStudent(students.find((item) => String(item.id) === String(studentId)) ?? null);
            } catch (error) {
                console.error("Gagal memuat mahasiswa:", error);
            }
        };

        loadStudent();
    }, [studentId]);

    const weightedTotal = useMemo(() => assessmentAspects.reduce((total, aspect, index) => {
        const score = Number(scores[index]);
        return total + (Number.isFinite(score) ? (aspect.weight / 100) * score : 0);
    }, 0), [scores]);

    const finalScore = weightedTotal;
    const standardFourScore = finalScore / 25;
    const grade = getGrade(finalScore);
    const isComplete = scores.every((score) => score !== "");

    const handleScoreChange = (index, value) => {
        if (saved) return;
        setSaved(false);
        if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
            setScores((previous) => previous.map((score, scoreIndex) => scoreIndex === index ? value : score));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!isComplete || saved) return;
        setSaving(true);
        window.setTimeout(() => {
            setSaving(false);
            setSaved(true);
            window.localStorage.setItem(`penilaian-akhir-scores-${studentId}`, JSON.stringify(scores));
            window.localStorage.setItem(`penilaian-akhir-${studentId}`, "tersimpan");
        }, 400);
    };

    const handleExportPdf = () => {
        if (isComplete) window.print();
    };

    return (
        <PembimbingLayout>
            <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
                <div className="print:hidden">
                <header className="rounded-3xl bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500 p-6 text-white shadow-lg shadow-sky-200">
                    <button type="button" onClick={() => navigate("/pembimbing/penilaian-akhir")} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-100 hover:text-white">
                        <FaArrowLeft /> Kembali ke daftar mahasiswa
                    </button>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-100">Pembimbing</p>
                            <h1 className="mt-2 text-2xl font-bold md:text-4xl">Penilaian Akhir Magang</h1>
                            <p className="mt-2 text-sm text-indigo-50 md:text-base">Berikan nilai akhir berdasarkan aspek penilaian berikut.</p>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <FaUserTie className="text-xl" />
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-100">Mahasiswa</p>
                                <p className="text-lg font-semibold">{student?.nama ?? "Memuat..."}</p>
                                <p className="text-xs text-indigo-100">NIM: {student?.nim || "Belum tersedia"}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="print:hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-200 text-slate-800">
                                    <th className="border border-slate-400 px-3 py-3 text-center">No</th>
                                    <th className="border border-slate-400 px-4 py-3 text-left">Aspek Penilaian</th>
                                    <th className="border border-slate-400 px-3 py-3 text-center">Bobot</th>
                                    <th className="border border-slate-400 px-3 py-3 text-center">Skor (0-100)</th>
                                    <th className="border border-slate-400 px-3 py-3 text-center">Bobot x Skor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assessmentAspects.map((aspect, index) => {
                                    const score = Number(scores[index]);
                                    return (
                                        <tr key={aspect.label}>
                                            <td className="border border-slate-300 px-3 py-4 text-center">{index + 1}.</td>
                                            <td className="border border-slate-300 px-4 py-4 font-medium text-slate-700">{aspect.label}</td>
                                            <td className="border border-slate-300 px-3 py-4 text-center">{aspect.weight}</td>
                                            <td className="border border-slate-300 px-3 py-3 text-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="1"
                                                    value={scores[index]}
                                                    onChange={(event) => handleScoreChange(index, event.target.value)}
                                                    disabled={saved || saving}
                                                    aria-label={`Skor ${aspect.label}`}
                                                    className="w-20 rounded-lg border border-slate-300 px-2 py-2 text-center outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                                    required
                                                />
                                            </td>
                                            <td className="border border-slate-300 px-3 py-4 text-center font-semibold text-slate-700">
                                                {Number.isFinite(score) && scores[index] !== "" ? `${((aspect.weight / 100) * score).toFixed(2)}` : "-"}
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr className="font-bold text-slate-800">
                                    <td colSpan="2" className="border border-slate-400 px-4 py-4 text-center">JUMLAH</td>
                                    <td className="border border-slate-400 px-3 py-4 text-center">100</td>
                                    <td className="border border-slate-400 px-3 py-4 text-center">-</td>
                                    <td className="border border-slate-400 px-3 py-4 text-center">{weightedTotal}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div>
                            <h2 className="mb-3 text-lg font-bold text-slate-800">Keterangan</h2>
                            <table className="w-full max-w-md border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-200 text-slate-800">
                                        <th className="border border-slate-400 px-3 py-2">Nilai Standar</th>
                                        <th className="border border-slate-400 px-3 py-2">Nilai Standar 4</th>
                                        <th className="border border-slate-400 px-3 py-2">Nilai Huruf</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {["0 - 39", "40 - 59", "60 - 69", "70 - 79", "80 - 100"].map((range, index) => (
                                        <tr key={range} className="text-center">
                                            <td className="border border-slate-300 px-3 py-2">{range}</td>
                                            <td className="border border-slate-300 px-3 py-2">{index}</td>
                                            <td className="border border-slate-300 px-3 py-2">{["E", "D", "C", "B", "A"][index]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="rounded-xl bg-sky-50 p-5 lg:min-w-[230px]">
                            <p className="text-sm font-semibold text-slate-600">Nilai Standar</p>
                            <p className="mt-1 text-3xl font-extrabold text-sky-700">{finalScore.toFixed(2)}</p>
                            <p className="mt-1 text-sm font-bold text-slate-700">Nilai Standar 4: {standardFourScore.toFixed(2)}</p>
                            <p className="mt-1 text-sm font-bold text-slate-700">Nilai Huruf: {grade}</p>
                            <div className="mt-4 grid gap-2">
                                <button type="submit" disabled={!isComplete || saving || saved} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50">
                                    <FaSave /> {saving ? "Menyimpan..." : saved ? "Penilaian Terkunci" : "Simpan Penilaian"}
                                </button>
                                <button type="button" onClick={handleExportPdf} disabled={!isComplete} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                                    <FaFilePdf className="text-red-600" /> Export PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                </div>

                <article className="final-assessment-paper hidden bg-white font-serif text-black print:block">
                    <header className="border-b-[3px] border-black pb-2">
                        <div className="flex items-center gap-5">
                            <div className="h-[82px] w-[82px] shrink-0 overflow-hidden grayscale">
                                <img src={logoKemendikdasmen} alt="Logo Kementerian Pendidikan Dasar dan Menengah" className="h-[118px] w-[118px] max-w-none -translate-x-[18px] object-contain" />
                            </div>
                            <div className="flex-1 text-center leading-tight">
                                <p className="text-[17px]">KEMENTERIAN PENDIDIKAN DASAR</p>
                                <p className="text-[17px]">DAN MENENGAH</p>
                                <p className="mt-1 text-[18px] font-bold">BALAI BAHASA PROVINSI JAWA BARAT</p>
                                <p className="mt-1 text-[11px]">Jalan Sumbawa Nomor 11, Kota Bandung, 40113</p>
                                <p className="text-[11px]">Telepon (022) 4205468; Pos-el balaibahasa.jabar@kemendikdasmen.go.id</p>
                                <p className="text-[11px]">Laman www.balaibahasajabar.kemendikdasmen.go.id</p>
                            </div>
                        </div>
                    </header>

                    <section className="mt-5 text-[11px] leading-[1.45]">
                        <div className="text-center">
                            <h1 className="text-[13px] font-bold underline">SURAT KETERANGAN</h1>
                            <p>Nomor: 0099/005.199/PP.07.02/2026</p>
                        </div>
                        <p className="mt-4">Saya yang bertanda tangan di bawah ini:</p>
                        <div className="mt-1 grid grid-cols-[105px_12px_1fr]">
                            <span>nama</span><span>:</span><span>Pembimbing Magang</span>
                            <span>NIP</span><span>:</span><span>-</span>
                            <span>jabatan</span><span>:</span><span>Pembimbing</span>
                            <span>unit kerja</span><span>:</span><span>Balai Bahasa Provinsi Jawa Barat</span>
                        </div>
                        <p className="mt-3">dengan ini menerangkan bahwa siswa:</p>
                        <div className="mt-1 grid grid-cols-[105px_12px_1fr]">
                            <span>nama</span><span>:</span><span>{student?.nama || "-"}</span>
                            <span>NIM</span><span>:</span><span>{student?.nim || "-"}</span>
                            <span>universitas</span><span>:</span><span>Politeknik Negeri Bandung</span>
                            <span>jurusan</span><span>:</span><span>-</span>
                        </div>
                        <p className="mt-3">telah melaksanakan program magang di Balai Bahasa Provinsi Jawa Barat dengan hasil penilaian sebagai berikut:</p>
                    </section>

                    <table className="mt-3 w-full border-collapse text-[10px]">
                        <thead>
                            <tr className="bg-[#d9d9d9]">
                                <th className="w-8 border border-black px-1 py-1.5">No.</th>
                                <th className="border border-black px-2 py-1.5 text-left">Aspek Penilaian</th>
                                <th className="w-14 border border-black px-1 py-1.5">Bobot</th>
                                <th className="w-14 border border-black px-1 py-1.5">Skor</th>
                                <th className="w-16 border border-black px-1 py-1.5">Bobot x<br />Skor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assessmentAspects.map((aspect, index) => {
                                const score = Number(scores[index]);
                                return (
                                    <tr key={aspect.label}>
                                        <td className="border border-black px-1 py-2 text-center">{index + 1}.</td>
                                        <td className="border border-black px-2 py-2">{aspect.label}</td>
                                        <td className="border border-black px-1 py-2 text-center">{aspect.weight}</td>
                                        <td className="border border-black px-1 py-2 text-center">{scores[index]}</td>
                                        <td className="border border-black px-1 py-2 text-center">{((aspect.weight / 100) * score).toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                            <tr className="font-bold">
                                <td colSpan="2" className="border border-black px-2 py-2 text-center">JUMLAH</td>
                                <td className="border border-black px-1 py-2 text-center">100</td>
                                <td className="border border-black px-1 py-2 text-center">-</td>
                                <td className="border border-black px-1 py-2 text-center">{weightedTotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mt-5 grid grid-cols-[1fr_210px] gap-8 text-[9px]">
                        <div>
                            <p className="mb-1 font-bold">Keterangan</p>
                            <table className="border-collapse text-center">
                                <thead><tr className="bg-[#d9d9d9]"><th className="border border-black px-2 py-1">Nilai<br />Standar</th><th className="border border-black px-2 py-1">Nilai<br />Standar 4</th><th className="border border-black px-2 py-1">Nilai<br />Huruf</th></tr></thead>
                                <tbody>{["0 - 39", "40 - 59", "60 - 69", "70 - 79", "80 - 100"].map((range, index) => <tr key={range}><td className="border border-black px-2 py-1">{range}</td><td className="border border-black px-2 py-1">{index}</td><td className="border border-black px-2 py-1">{["E", "D", "C", "B", "A"][index]}</td></tr>)}</tbody>
                            </table>
                        </div>
                        <div className="self-end">
                            <p>Nilai Standar: <strong>{finalScore.toFixed(2)}</strong></p>
                            <p>Nilai Standar 4: <strong>{standardFourScore.toFixed(2)}</strong></p>
                            <p>Nilai Huruf: <strong>{grade}</strong></p>
                        </div>
                    </div>

                    <footer className="mt-5 flex justify-end text-center text-[10px]">
                        <div className="w-[210px]">
                            <p>Bandung, {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
                            <p>Kepala,</p>
                            <div className="h-12" />
                            <p className="font-bold underline">Dr. Hermawan, S.S., M.A.</p>
                            <p>NIP 197102211997031005</p>
                        </div>
                    </footer>
                </article>
            </div>
        </PembimbingLayout>
    );
}
