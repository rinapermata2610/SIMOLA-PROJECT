// =============================================
// File : src/components/admin/ConfirmDeleteModal.jsx
// =============================================

function ConfirmDeleteModal({ title = "Konfirmasi Hapus", message = "Yakin ingin menghapus data ini?", onConfirm, onCancel, loading = false }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                </div>

                <div className="px-6 py-5">
                    <p className="text-gray-600">{message}</p>
                </div>

                <div className="px-6 py-5 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        aria-label="Batal hapus"
                        onClick={onCancel}
                        className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50"
                    >
                        Batal
                    </button>

                    <button
                        aria-label="Konfirmasi hapus"
                        disabled={loading}
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl"
                    >
                        {loading ? "Memproses..." : "Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDeleteModal;
