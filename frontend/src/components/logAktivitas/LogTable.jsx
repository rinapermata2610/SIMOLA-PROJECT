// =============================================
// File : src/components/logAktivitas/LogTable.jsx
// =============================================

import LogRow from "./LogRow";

function LogTable({
    loading = false,
    activities = [],
    onView,
    onEdit,
    onDelete,
}) {
    return (
        <div
            className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-slate-200
                overflow-hidden
            "
        >
            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                Tanggal
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                Judul Aktivitas
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                Lampiran
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                                Status
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                                Aksi
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="
                                        py-12
                                        text-center
                                        text-slate-500
                                    "
                                >
                                    Memuat data...
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            activities.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="
                                            py-12
                                            text-center
                                            text-slate-500
                                        "
                                    >
                                        Belum ada log aktivitas.
                                    </td>
                                </tr>
                            )}

                        {!loading &&
                            activities.map((activity) => (
                                <LogRow
                                    key={activity.id}
                                    activity={activity}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}

                    </tbody>

                </table>

            </div>
        </div>
    );
}

export default LogTable;