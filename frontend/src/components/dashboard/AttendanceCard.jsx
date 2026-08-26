import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import absensiService from "../../services/absensiService";

function AttendanceCard({ onAttendanceChange }) {
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState("");

    const loadAttendance = async () => {
        try {
            const response = await absensiService.getToday();
            setAttendance(response.data);
        } catch (error) {
            Swal.fire("Gagal", error.response?.data?.message || "Data absensi gagal dimuat.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, []);

    const handleClock = (type) => {
        if (!navigator.geolocation) {
            Swal.fire("Lokasi tidak tersedia", "Browser ini tidak mendukung akses lokasi.", "error");
            return;
        }

        setSubmitting(type);
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const response = await absensiService.clock(type, {
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                    });
                    setAttendance(response.data);
                    onAttendanceChange?.();
                    Swal.fire("Berhasil", response.message, "success");
                } catch (error) {
                    Swal.fire("Absensi gagal", error.response?.data?.message || "Tidak dapat mencatat absensi.", "error");
                } finally {
                    setSubmitting("");
                }
            },
            (error) => {
                setSubmitting("");
                const message = error.code === 1
                    ? "Izin lokasi diperlukan untuk melakukan absensi."
                    : "Lokasi Anda tidak dapat dibaca. Coba lagi.";
                Swal.fire("Lokasi diperlukan", message, "warning");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const hasClockedIn = Boolean(attendance?.jam_masuk);
    const hasClockedOut = Boolean(attendance?.jam_keluar);

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Absensi Hari Ini</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-800">Balai Bahasa Provinsi Jawa Barat</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <FaMapMarkerAlt className="text-rose-500" />
                        Wajib berada di area kantor untuk absen
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Masuk 06.00–07.30 WIB · Keluar 16.00–18.00 WIB</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-lg bg-emerald-50 px-5 py-3">
                        <p className="text-xs font-semibold text-emerald-700">Masuk</p>
                        <p className="mt-1 text-lg font-bold text-emerald-800">{loading ? "..." : attendance?.jam_masuk || "--:--"}</p>
                    </div>
                    <div className="rounded-lg bg-orange-50 px-5 py-3">
                        <p className="text-xs font-semibold text-orange-700">Keluar</p>
                        <p className="mt-1 text-lg font-bold text-orange-800">{loading ? "..." : attendance?.jam_keluar || "--:--"}</p>
                    </div>
                </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => handleClock("masuk")}
                    disabled={loading || submitting !== "" || hasClockedIn}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    <FaSignInAlt />
                    {submitting === "masuk" ? "Membaca lokasi..." : hasClockedIn ? "Sudah Absen Masuk" : "Absen Masuk"}
                </button>
                <button
                    type="button"
                    onClick={() => handleClock("keluar")}
                    disabled={loading || submitting !== "" || !hasClockedIn || hasClockedOut}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    <FaSignOutAlt />
                    {submitting === "keluar" ? "Membaca lokasi..." : hasClockedOut ? "Sudah Absen Keluar" : "Absen Keluar"}
                </button>
            </div>
        </section>
    );
}

export default AttendanceCard;
