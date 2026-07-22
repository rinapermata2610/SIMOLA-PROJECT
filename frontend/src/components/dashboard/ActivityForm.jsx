// =============================================
// File : src/components/dashboard/ActivityForm.jsx
// =============================================

import { useRef } from "react";
import {
    FaUpload,
    FaPaperclip,
    FaTrash,
} from "react-icons/fa";

function ActivityForm({
    form = {}, // ✅ Diberi default object agar tidak undefined
    errors = {},
    loading = false,
    onChange,
    onSubmit,
    onSaveDraft,
    onFileChange,
}) {
    const fileInputRef = useRef(null);

    // ✅ Ambil nilai aman dengan default fallback
    const judul = form?.judul || "";
    const deskripsi = form?.deskripsi || "";
    const hasil = form?.hasil || "";
    const jamMulai = form?.jam_mulai || "";
    const jamSelesai = form?.jam_selesai || "";
    const files = form?.files || []; // Pastikan ini selalu array

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col h-full"
        >
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                {/* Judul */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Tugas
                        <span className="text-red-500"> *</span>
                    </label>

                    <input
                        type="text"
                        name="judul"
                        value={judul}
                        onChange={onChange}
                        placeholder="Misal: Pengembangan Modul Autentikasi"
                        className={`
                            w-full
                            rounded-lg
                            border
                            px-4
                            py-3
                            outline-none
                            transition
                            ${
                                errors?.judul
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-sky-500"
                            }
                        `}
                    />

                    {errors?.judul && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.judul}
                        </p>
                    )}
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi Tugas
                        <span className="text-red-500"> *</span>
                    </label>

                    <textarea
                        rows={4}
                        name="deskripsi"
                        value={deskripsi}
                        onChange={onChange}
                        placeholder="Jelaskan detail tugas yang dikerjakan hari ini..."
                        className={`
                            w-full
                            rounded-lg
                            border
                            px-4
                            py-3
                            resize-none
                            outline-none
                            transition
                            ${
                                errors?.deskripsi
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-sky-500"
                            }
                        `}
                    />

                    {errors?.deskripsi && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.deskripsi}
                        </p>
                    )}
                </div>

                {/* Hasil */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pencapaian / Hasil
                        <span className="text-red-500"> *</span>
                    </label>

                    <textarea
                        rows={3}
                        name="hasil"
                        value={hasil}
                        onChange={onChange}
                        placeholder="Apa hasil nyata dari pekerjaan hari ini?"
                        className={`
                            w-full
                            rounded-lg
                            border
                            px-4
                            py-3
                            resize-none
                            outline-none
                            transition
                            ${
                                errors?.hasil
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-sky-500"
                            }
                        `}
                    />

                    {errors?.hasil && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.hasil}
                        </p>
                    )}
                </div>

                {/* Jam */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jam Mulai
                            <span className="text-gray-400"> (opsional)</span>
                        </label>

                        <input
                            type="time"
                            name="jam_mulai"
                            value={jamMulai}
                            onChange={onChange}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-3
                                outline-none
                                focus:border-sky-500
                            "
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jam Selesai
                            <span className="text-gray-400"> (opsional)</span>
                        </label>

                        <input
                            type="time"
                            name="jam_selesai"
                            value={jamSelesai}
                            onChange={onChange}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-3
                                outline-none
                                focus:border-sky-500
                            "
                        />
                    </div>
                </div>

                {/* Upload Lampiran */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lampiran Bukti
                    </label>

                    <div
                        onClick={openFilePicker}
                        className="
                            border-2
                            border-dashed
                            border-gray-300
                            rounded-xl
                            p-8
                            text-center
                            cursor-pointer
                            hover:border-sky-500
                            transition
                        "
                    >
                        <div
                            className="
                                w-14
                                h-14
                                mx-auto
                                rounded-full
                                bg-sky-100
                                flex
                                items-center
                                justify-center
                                text-sky-600
                                mb-3
                            "
                        >
                            <FaUpload size={20} />
                        </div>

                        <p className="text-gray-700">
                            Seret file ke sini atau{" "}
                            <span className="text-sky-600">
                                klik untuk upload
                            </span>
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                            JPG, PNG, PDF, DOCX, XLSX (Maks. 10MB)
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        hidden
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                        onChange={onFileChange}
                    />

                    {/* ✅ Menggunakan variable files yang aman dari undefined */}
                    {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        border
                                        rounded-lg
                                        px-4
                                        py-3
                                    "
                                >
                                    <div className="flex items-center gap-3">
                                        <FaPaperclip className="text-sky-600" />
                                        <span className="text-sm">
                                            {file?.name || "File Bukti"}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedFiles = [...files];
                                            updatedFiles.splice(index, 1);
                                            onChange?.({
                                                target: {
                                                    name: "files",
                                                    value: updatedFiles,
                                                },
                                            });
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div
                className="
                    border-t
                    px-6
                    py-4
                    bg-white
                    flex
                    items-center
                    justify-between
                "
            >
                <p className="text-sm text-gray-500">
                    Data akan otomatis tersimpan sebagai draft
                </p>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onSaveDraft}
                        disabled={loading}
                        className="
                            px-5
                            py-2.5
                            rounded-lg
                            border
                            border-sky-600
                            text-sky-600
                            hover:bg-sky-50
                            transition
                        "
                    >
                        Simpan Draft
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            px-6
                            py-2.5
                            rounded-lg
                            bg-sky-600
                            hover:bg-sky-700
                            text-white
                            transition
                        "
                    >
                        {loading ? "Menyimpan..." : "Kirim"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default ActivityForm;