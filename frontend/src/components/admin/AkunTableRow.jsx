// =============================================
// File : src/components/admin/AkunTableRow.jsx
// =============================================

import {
    FaKey,
    FaPencilAlt,
    FaTrashAlt,
} from "react-icons/fa";

function AkunTableRow({ user, onEdit, onResetPassword, onDelete }) {
    const roleClasses = {
        mahasiswa: "bg-sky-100 text-sky-700",
        pembimbing: "bg-amber-100 text-amber-700",
        admin: "bg-gray-100 text-gray-700",
    };

    const getInitials = (name = "") => {
        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((item) => item[0])
            .join("")
            .toUpperCase();
    };

    const roleBg = roleClasses[user.role] ?? "bg-gray-100 text-gray-700";

    return (
        <tr>
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${roleBg}`}>
                        {getInitials(user.nama)}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{user.nama}</p>
                        <p className="text-xs text-gray-500">{user.nim ?? "-"}</p>
                    </div>
                </div>
            </td>

            <td className="px-6 py-5 text-sm text-gray-600">{user.email}</td>

            <td className="px-6 py-5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${roleBg}`}>{user.role}</span>
            </td>

            <td className="px-6 py-5">
                {user.role === "mahasiswa" ? (
                    <span className="text-sm text-gray-600">
                        {user.periode_aktif?.pembimbing?.nama ?? "Belum ditentukan"}
                    </span>
                ) : (
                    <span className="text-gray-400">—</span>
                )}
            </td>

            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <button
                        aria-label={`Edit akun ${user.nama}`}
                        onClick={() => onEdit(user)}
                        className="text-gray-500 hover:text-sky-600 transition"
                    >
                        <FaPencilAlt />
                    </button>

                    <button
                        aria-label={`Reset password ${user.nama}`}
                        onClick={() => onResetPassword(user)}
                        className="text-gray-500 hover:text-amber-600 transition"
                    >
                        <FaKey />
                    </button>

                    <button
                        aria-label={`Hapus akun ${user.nama}`}
                        onClick={() => onDelete(user)}
                        className="text-gray-500 hover:text-red-600 transition"
                    >
                        <FaTrashAlt />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default AkunTableRow;
