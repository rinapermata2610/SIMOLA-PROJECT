// =============================================
// File : src/components/admin/AkunTable.jsx
// =============================================

import AkunTableRow from "./AkunTableRow";

function AkunTable({ data = [], loading, onEdit, onToggleStatus, onResetPassword, onDelete, onAssignPembimbing, pembimbingList = [] }) {
    if (loading) {
        return <div className="text-center py-10 text-gray-600">Memuat data akun...</div>;
    }

    return (
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nama Lengkap</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status Akun</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Pembimbing Terkait</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    Belum ada data akun.
                                </td>
                            </tr>
                        ) : (
                            data.map((user) => (
                                <AkunTableRow
                                    key={user.id}
                                    user={user}
                                    onEdit={onEdit}
                                    onToggleStatus={onToggleStatus}
                                    onResetPassword={onResetPassword}
                                    onDelete={onDelete}
                                    onAssignPembimbing={onAssignPembimbing}
                                    pembimbingList={pembimbingList}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default AkunTable;
