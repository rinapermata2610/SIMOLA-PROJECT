import { useCallback, useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import MainLayout from "../../layout/MainLayout";
import AttendanceCard from "../../components/dashboard/AttendanceCard";
import absensiService from "../../services/absensiService";

export default function Attendance() {
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    const loadHistory = useCallback(async () => {
        try {
            const response = await absensiService.getToday();
            setHistory(response.history || []);
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const formatDate = (date) => new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));

    return (
        <MainLayout>
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">Kehadiran</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-800">Absensi Mahasiswa</h1>
                    <p className="mt-2 text-sm text-slate-500">Catat jam masuk dan keluar selama berada di lokasi magang.</p>
                </div>
                <AttendanceCard onAttendanceChange={loadHistory} />
                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                            <FaHistory />
                        </span>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Riwayat Absensi 7 Hari</h2>
                            <p className="text-sm text-slate-500">Riwayat absensi Anda selama satu minggu terakhir.</p>
                        </div>
                    </div>
                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[520px] text-left text-sm">
                            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-3 py-3 font-semibold">Hari / Tanggal</th>
                                    <th className="px-3 py-3 font-semibold">Absen Masuk</th>
                                    <th className="px-3 py-3 font-semibold">Absen Keluar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {historyLoading ? (
                                    <tr><td colSpan="3" className="px-3 py-6 text-center text-slate-500">Memuat riwayat...</td></tr>
                                ) : history.length === 0 ? (
                                    <tr><td colSpan="3" className="px-3 py-6 text-center text-slate-500">Belum ada absensi selama tujuh hari terakhir.</td></tr>
                                ) : history.map((item) => (
                                    <tr key={item.id} className="text-slate-700">
                                        <td className="px-3 py-4 font-medium">{formatDate(item.tanggal)}</td>
                                        <td className="px-3 py-4 text-emerald-700">{item.jam_masuk || "-"}</td>
                                        <td className="px-3 py-4 text-orange-700">{item.jam_keluar || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                <a
                    href="https://www.google.com/maps/search/?api=1&query=-6.9138252,107.6171926"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    Buka lokasi Balai Bahasa di Maps
                </a>
            </div>
        </MainLayout>
    );
}
