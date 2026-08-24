// =============================================
// File : src/components/logAktivitas/DeleteDialog.jsx
// =============================================

import {
    FaCalendarAlt,
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
                bg-slate-900/60
                backdrop-blur-sm
                p-4
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                    animate-in
                    fade-in
                    zoom-in-95
                    duration-200
                "
            >
                {/* Header */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        bg-gradient-to-r
                        from-red-600
                        to-rose-500
                        px-5
                        py-5
                        text-white
                        border-b
                    "
                >
                    <div className="flex items-center gap-3">

                        <div
                            className="
                                w-12
                                h-12
                                rounded-full
                                bg-white/20
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <FaTrashAlt
                                className="text-white"
                                size={20}
                            />
                        </div>

                        <div>

                            <h2 className="text-lg font-extrabold">
                                Hapus Aktivitas
                            </h2>

                            <p className="text-sm text-red-100">
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
                            text-white/80
                            hover:bg-white/20
                            hover:text-white
                            transition
                        "
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-6 sm:px-6">

                    <p className="text-sm font-medium leading-6 text-slate-600">
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
                                bg-slate-50/80
                                p-4
                            "
                        >
                            <div className="flex items-start gap-3">
                                <FaCalendarAlt className="mt-1 shrink-0 text-sky-600" />
                                <div className="min-w-0">
                            <p className="truncate text-sm font-extrabold text-slate-800">
                                {activity.judul}
                            </p>

                            <p className="mt-1 text-xs font-medium text-slate-500">
                                {activity.tanggal}
                            </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div
                        className="
                            mt-6
                            rounded-lg
                            bg-red-50/80
                            border
                            border-red-200
                            p-3
                        "
                    >
                        <p className="text-sm text-red-600">
                            Data yang dihapus tidak dapat dikembalikan,
                            termasuk aktivitas yang sudah dikirim.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        px-5
                        py-5
                        border-t
                        bg-slate-50/80
                        sm:px-6
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-5
                            py-2.5
                            rounded-xl
                            text-sm
                            font-bold
                            text-slate-600
                            shadow-sm
                            hover:bg-slate-100
                            transition
                        "
                    >
                        <FaTimes />
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-gradient-to-r
                            from-red-600
                            to-rose-500
                            px-5
                            py-2.5
                            text-sm
                            font-bold
                            text-white
                            shadow-md
                            shadow-red-500/20
                            hover:shadow-lg
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        <FaTrashAlt />
                        {loading ? "Menghapus..." : "Hapus Aktivitas"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default DeleteDialog;