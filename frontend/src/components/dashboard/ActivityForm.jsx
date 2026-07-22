// =============================================
// File : src/components/dashboard/ActivityForm.jsx
// =============================================

import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";

function ActivityForm({
    mode = "create",
    initialData = null,
    loading = false,
    onSubmit,
}) {

    const [form, setForm] = useState({
        tanggal: "",
        jam_masuk: "",
        jam_pulang: "",
        aktivitas: "",
        hasil: "",
        kendala: "",
        lampiran: null,
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                tanggal: initialData.tanggal || "",
                jam_masuk: initialData.jam_masuk || "",
                jam_pulang: initialData.jam_pulang || "",
                aktivitas: initialData.aktivitas || "",
                hasil: initialData.hasil || "",
                kendala: initialData.kendala || "",
                lampiran: null,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "lampiran") {
            setForm({
                ...form,
                lampiran: files[0],
            });
        } else {
            setForm({
                ...form,
                [name]: value,
            });
        }
    };

    const submit = (e) => {
        e.preventDefault();

        if (onSubmit) {
            onSubmit(form);
        }
    };

    return (
        <form
            onSubmit={submit}
            className="space-y-5"
        >

            {/* Tanggal */}
            <div>

                <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Tanggal
                </label>

                <input
                    type="date"
                    name="tanggal"
                    value={form.tanggal}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 bg-gray-50"
                />

            </div>

            {/* Jam */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Jam Masuk
                    </label>

                    <input
                        type="time"
                        name="jam_masuk"
                        value={form.jam_masuk}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3"
                    />

                </div>

                <div>

                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Jam Pulang
                    </label>

                    <input
                        type="time"
                        name="jam_pulang"
                        value={form.jam_pulang}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3"
                    />

                </div>

            </div>

            {/* Aktivitas */}
            <div>

                <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Aktivitas
                </label>

                <textarea
                    rows={4}
                    name="aktivitas"
                    value={form.aktivitas}
                    onChange={handleChange}
                    placeholder="Jelaskan aktivitas yang dikerjakan..."
                    className="w-full border rounded-xl px-4 py-3 resize-none"
                />

            </div>

            {/* Hasil */}
            <div>

                <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Hasil
                </label>

                <textarea
                    rows={3}
                    name="hasil"
                    value={form.hasil}
                    onChange={handleChange}
                    placeholder="Tuliskan hasil pekerjaan..."
                    className="w-full border rounded-xl px-4 py-3 resize-none"
                />

            </div>

            {/* Kendala */}
            <div>

                <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Kendala
                </label>

                <textarea
                    rows={3}
                    name="kendala"
                    value={form.kendala}
                    onChange={handleChange}
                    placeholder="Tuliskan kendala (jika ada)..."
                    className="w-full border rounded-xl px-4 py-3 resize-none"
                />

            </div>

            {/* Lampiran */}
            <div>

                <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Lampiran Bukti
                </label>

                <input
                    type="file"
                    name="lampiran"
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3"
                />

            </div>

            {/* Button */}
            <div className="flex justify-end gap-3 pt-4">

                <button
                    type="button"
                    className="
                        px-6
                        py-3
                        rounded-xl
                        border
                        border-gray-300
                        hover:bg-gray-100
                    "
                >
                    Batal
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        flex
                        items-center
                        gap-2
                        px-6
                        py-3
                        rounded-xl
                        bg-sky-600
                        hover:bg-sky-700
                        text-white
                        transition
                    "
                >
                    <FaSave />

                    {loading
                        ? "Menyimpan..."
                        : mode === "edit"
                        ? "Perbarui Aktivitas"
                        : "Simpan Aktivitas"}
                </button>

            </div>

        </form>
    );
}

export default ActivityForm;