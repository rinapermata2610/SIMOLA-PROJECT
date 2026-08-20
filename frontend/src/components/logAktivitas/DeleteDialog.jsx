// =============================================
// File : src/components/logAktivitas/DeleteDialog.jsx
// =============================================

import {
    FaTrashAlt,
    FaTimes,
} from "react-icons/fa";

function DeleteDialog({
    open,
    loading = false,
    activity = null,
    onClose,
    onConfirm,
}) {
    if (!open) return null;

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                p-4
            "
        >
            <div
                className="
                    bg-white
                    w-full
                    max-w-md
                    rounded-2xl
                    shadow-2xl
                    overflow-hidden
                "
            >
                {/* Header */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-5
                        border-b
                    "
                >
                    <div className="flex items-center gap-3">

                        <div
                            className="
                                w-12
                                h-12
                                rounded-full
                                bg-red-100
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <FaTrashAlt
                                className="text-red-600"
                                size={20}
                            />
                        </div>

                        <div>

                            <h2 className="text-lg font-bold text-slate-800">
                                Hapus Aktivitas
                            </h2>

                            <p className="text-sm text-slate-500">
                                Konfirmasi penghapusan data
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            p-2
                            rounded-lg
                            hover:bg-slate-100
                            transition
                        "
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6">

                    <p className="text-slate-700">
                        Apakah Anda yakin ingin menghapus
                        aktivitas berikut?
                    </p>

                    {activity && (
                        <div
                            className="
                                mt-4
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
                            "
                        >
                            <p className="font-semibold text-slate-800">
                                {activity.judul}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                {activity.tanggal}
                            </p>
                        </div>
                    )}

                    <div
                        className="
                            mt-6
                            rounded-lg
                            bg-red-50
                            border
                            border-red-200
                            p-3
                        "
                    >
                        <p className="text-sm text-red-600">
                            Data yang dihapus tidak dapat
                            dikembalikan.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        px-6
                        py-5
                        border-t
                        bg-slate-50
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            px-5
                            py-2.5
                            rounded-xl
                            border
                            border-slate-300
                            text-slate-700
                            hover:bg-slate-100
                            transition
                        "
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="
                            px-5
                            py-2.5
                            rounded-xl
                            bg-red-600
                            text-white
                            hover:bg-red-700
                            transition
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        {loading
                            ? "Menghapus..."
                            : "Hapus"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default DeleteDialog;