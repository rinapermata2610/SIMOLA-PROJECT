import { useEffect, useState } from "react";
import adminFinalAssessmentService from "../../services/adminFinalAssessmentService";

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
};

export default function HasilPenilaianAkhir() {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAssessments = async () => {
            try {
                const response = await adminFinalAssessmentService.getAll();
                setAssessments(Array.isArray(response?.data) ? response.data : []);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Hasil penilaian gagal dimuat.");
            } finally {
                setLoading(false);
            }
        };

        loadAssessments();
    }, []);

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">Administrasi</p>
                <h1 className="mt-2 text-3xl font-bold text-gray-800">Hasil Penilaian Akhir</h1>
            </header>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-5 py-4">Mahasiswa</th>
                                <th className="px-5 py-4">Universitas</th>
                                <th className="px-5 py-4">Instansi / Periode</th>
                                <th className="px-5 py-4">Pembimbing</th>
                                <th className="px-5 py-4 text-right">Nilai Akhir</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-5 py-10 text-center text-gray-500">Memuat hasil penilaian...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="5" className="px-5 py-10 text-center text-red-600">{error}</td></tr>
                            ) : assessments.length === 0 ? (
                                <tr><td colSpan="5" className="px-5 py-10 text-center text-gray-500">Belum ada penilaian akhir.</td></tr>
                            ) : assessments.map((assessment) => (
                                <tr key={assessment.id}>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-gray-800">{assessment.mahasiswa?.nama || "-"}</p>
                                        <p className="text-xs text-gray-500">{assessment.mahasiswa?.nim || "NIM belum tersedia"}</p>
                                    </td>
                                    <td className="px-5 py-4 text-gray-700">{assessment.mahasiswa?.universitas || "-"}</td>
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-gray-800">{assessment.periode?.instansi || "-"}</p>
                                        <p className="text-xs text-gray-500">{formatDate(assessment.periode?.tanggal_mulai)} - {formatDate(assessment.periode?.tanggal_selesai)}</p>
                                    </td>
                                    <td className="px-5 py-4 text-gray-700">{assessment.pembimbing?.nama || "-"}</td>
                                    <td className="px-5 py-4 text-right">
                                        <span className="font-bold text-gray-800">{Number(assessment.nilai_akhir).toFixed(2)}</span>
                                        <span className="ml-2 rounded-md bg-sky-50 px-2 py-1 font-bold text-sky-700">{assessment.nilai_huruf}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}