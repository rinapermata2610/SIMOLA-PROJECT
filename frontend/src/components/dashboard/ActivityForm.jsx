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
    form = {},
    errors = {},
    loading = false,
    onChange,
    onSubmit,
    onSaveDraft,
    onFileChange,
}) {
    const fileInputRef = useRef(null);

    const judul = form?.judul || "";
    const deskripsi = form?.deskripsi || "";
    const hasil = form?.hasil || "";
    const files = form?.files || [];

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const removeFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);

        onChange?.({
            target: {
                name: "files",
                value: updatedFiles,
            },
        });
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
                            JPG, PNG, PDF, DOCX, XLSX (Maks. 10 MB)
                        </p>

                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                        onChange={onFileChange}
                    />

                    {files.length > 0 && (

                        <div className="mt-4 space-y-3">

                            {files.map((file, index) => (

                                <div
                                    key={index}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        px-4
                                        py-3
                                    "
                                >

                                    <div className="flex items-center gap-3">

                                        <FaPaperclip className="text-sky-600 text-lg" />

                                        <div>

                                            <p className="font-medium text-gray-700">
                                                {file.name}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="
                                            text-red-500
                                            hover:text-red-700
                                            transition
                                        "
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