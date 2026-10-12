import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import Swal from "sweetalert2";
import adminAttendanceSettingsService from "../../services/adminAttendanceSettingsService";

const weekdays = [
    { value: 1, label: "Senin" },
    { value: 2, label: "Selasa" },
    { value: 3, label: "Rabu" },
    { value: 4, label: "Kamis" },
    { value: 5, label: "Jumat" },
];

export default function PengaturanWFH() {
    const [wfhDays, setWfhDays] = useState([5]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await adminAttendanceSettingsService.get();
                setWfhDays(response?.data?.wfh_days ?? [5]);
            } catch (error) {
                Swal.fire("Gagal", error.response?.data?.message || "Pengaturan WFH gagal dimuat.", "error");
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    const toggleDay = (day) => {
        setWfhDays((currentDays) => currentDays.includes(day)
            ? currentDays.filter((currentDay) => currentDay !== day)
            : [...currentDays, day].sort((first, second) => first - second));
    };

    const saveSettings = async () => {
        if (wfhDays.length === 0) {
            Swal.fire("Pilih hari WFH", "Minimal satu hari kerja harus dipilih sebagai WFH.", "warning");
            return;
        }

        try {
            setSaving(true);
            await adminAttendanceSettingsService.update(wfhDays);
            Swal.fire({
                icon: "success",
                title: "Pengaturan disimpan",
                text: "Jadwal WFH telah diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire("Gagal", error.response?.data?.message || "Pengaturan WFH gagal disimpan.", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">Pengaturan</p>
                <h1 className="mt-2 text-3xl font-bold text-gray-800">Jadwal WFH</h1>
            </header>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800">Pilih hari kerja untuk WFH</h2>
                <p className="mt-1 text-sm text-gray-500">Pada hari yang dipilih, mahasiswa tidak diwajibkan berada di area kantor saat absensi.</p>

                <fieldset className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" disabled={loading || saving}>
                    <legend className="sr-only">Hari WFH</legend>
                    {weekdays.map((day) => (
                        <label key={day.value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 hover:bg-sky-50">
                            <input
                                type="checkbox"
                                checked={wfhDays.includes(day.value)}
                                onChange={() => toggleDay(day.value)}
                                className="h-4 w-4 accent-sky-600"
                            />
                            <span className="text-sm font-semibold text-gray-700">{day.label}</span>
                        </label>
                    ))}
                </fieldset>

                <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                    <button
                        type="button"
                        onClick={saveSettings}
                        disabled={loading || saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FaSave />
                        {saving ? "Menyimpan..." : "Simpan jadwal"}
                    </button>
                </div>
            </section>
        </div>
    );
}