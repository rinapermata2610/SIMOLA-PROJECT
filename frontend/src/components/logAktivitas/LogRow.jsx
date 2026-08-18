// =============================================
// File : src/components/logAktivitas/LogRow.jsx
// =============================================

import {
    FaEye,
    FaEdit,
    FaTrash,
    FaFileAlt,
} from "react-icons/fa";

import StatusBadge from "./StatusBadge";

function LogRow({
    activity,
    onView,
    onEdit,
    onDelete,
}) {
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50 transition">

            {/* Tanggal */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                {formatDate(activity.tanggal)}
            </td>

            {/* Judul */}
            <td className="px-6 py-4">

                <p className="font-semibold text-slate-800">
                    {activity.judul}
                </p>

                <p className="text-sm text-slate-500 line-clamp-2">
                    {activity.deskripsi}
                </p>

            </td>

            {/* Lampiran */}
            <td className="px-6 py-4">

                {activity.lampiran ? (
                    <div className="flex items-center gap-2 text-sky-600">

                        <FaFileAlt />

                        <span className="text-sm truncate max-w-[180px]">
                            {activity.lampiran}
                        </span>

                    </div>
                ) : (
                    <span className="text-sm text-slate-400">
                        -
                    </span>
                )}

            </td>

            {/* Status */}
            <td className="px-6 py-4 text-center">
                <StatusBadge
                    status={activity.status}
                />
            </td>

            {/* Aksi */}
            <td className="px-6 py-4">

                <div className="flex justify-center gap-2">

                    <button
                        onClick={() => onView(activity.id)}
                        className="
                            w-9
                            h-9
                            rounded-lg
                            bg-sky-50
                            text-sky-600
                            hover:bg-sky-100
                            transition
                        "
                        title="Lihat"
                    >
                        <FaEye className="mx-auto" />
                    </button>

                    <button
                        onClick={() => onEdit(activity.id)}
                        className="
                            w-9
                            h-9
                            rounded-lg
                            bg-amber-50
                            text-amber-600
                            hover:bg-amber-100
                            transition
                        "
                        title="Edit"
                    >
                        <FaEdit className="mx-auto" />
                    </button>

                    <button
                        onClick={() => onDelete(activity.id)}
                        className="
                            w-9
                            h-9
                            rounded-lg
                            bg-red-50
                            text-red-600
                            hover:bg-red-100
                            transition
                        "
                        title="Hapus"
                    >
                        <FaTrash className="mx-auto" />
                    </button>

                </div>

            </td>

        </tr>
    );
}

export default LogRow;