import React from "react";

const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDateID = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
};

export default function ActivityModal({
    open,
    selectedDate,
    form,
    loading,
    errorMessage,
    onChange,
    onFileChange,
    onRemoveFile,
    onSubmit,
    onClose,
}) {
    if (!open) return null;

    const formattedDate = selectedDate
        ? formatDateID(selectedDate)
        : formatDateID(form.tanggal);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                Tambah Aktivitas Magang
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                                📅 {formattedDate}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit("submitted");
                    }}
                    className="flex-1 overflow-y-auto p-6 space-y-5"
                >
                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-600 text-xs font-semibold">
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Judul Aktivitas */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            Judul Aktivitas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="judul"
                            value={form.judul}
                            onChange={onChange}
                            required
                            placeholder="Contoh: Merancang Wireframe Dashboard Utama"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                        />
                    </div>

                    {/* Deskripsi Kegiatan */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            Deskripsi Kegiatan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="deskripsi"
                            rows="3"
                            value={form.deskripsi}
                            onChange={onChange}
                            required
                            placeholder="Jelaskan secara singkat tugas dan pekerjaan yang kamu lakukan hari ini..."
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none"
                        ></textarea>
                    </div>

                    {/* Hasil / Output */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            Hasil Aktivitas / Output <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="hasil"
                            rows="2"
                            value={form.hasil}
                            onChange={onChange}
                            required
                            placeholder="Contoh: Dokumen spesifikasi UI/UX dan 5 komponen siap pakai..."
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none"
                        ></textarea>
                    </div>

                    {/* Upload File / Lampiran */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            Lampiran Bukti (Opsional)
                        </label>
                        
                        <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-5 text-center transition-all bg-slate-50/50 hover:bg-blue-50/30 group cursor-pointer">
                            <input
                                type="file"
                                multiple
                                onChange={onFileChange}
                                accept="image/*,.pdf,.doc,.docx"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <div className="p-3 bg-white shadow-sm rounded-full text-blue-500 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <div className="text-xs">
                                    <span className="font-semibold text-blue-600 hover:underline">
                                        Klik untuk unggah
                                    </span>
                                    <span className="text-slate-500"> atau tarik file ke sini</span>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    PNG, JPG, PDF, DOCX hingga 5MB
                                </p>
                            </div>
                        </div>

                        {/* List File Terpilih */}
                        {form.lampiran && form.lampiran.length > 0 && (
                            <div className="mt-3 space-y-2">
                                <p className="text-xs font-semibold text-slate-500">
                                    File Siap Diunggah ({form.lampiran.length})
                                </p>
                                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                    {form.lampiran.map((file, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3 overflow-hidden">
                                                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md shrink-0">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-xs font-semibold text-slate-700 truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-medium">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => onRemoveFile(idx)}
                                                className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                                                title="Hapus file"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Buttons */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => onSubmit("draft")}
                            disabled={loading}
                            className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                        >
                            {loading ? "Menyimpan..." : "Simpan Draft"}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center space-x-2"
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>{loading ? "Mengirim..." : "Kirim Aktivitas"}</span>
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}