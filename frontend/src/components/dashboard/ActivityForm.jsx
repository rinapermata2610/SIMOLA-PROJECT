import { useRef } from "react";
import { FaUpload, FaPaperclip, FaTrash } from "react-icons/fa";

function ActivityForm({ form = {}, errors = {}, loading = false, onChange, onSubmit, onSaveDraft, onFileChange }) {
    const fileInputRef = useRef(null);
    const judul = form?.judul || "";
    const deskripsi = form?.deskripsi || "";
    const hasil = form?.hasil || "";
    const files = form?.files || [];

    const removeFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        onChange?.({ target: { name: "files", value: updatedFiles } });
    };

    const fieldClass = (error) => `w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:ring-4 ${error ? "border-red-500 focus:ring-red-500/10" : "border-slate-200 focus:border-sky-500 focus:ring-sky-500/10"}`;
    const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600";

    return (
        <form onSubmit={onSubmit} className="flex h-full flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-5 py-5 sm:px-6">
                <div>
                    <label className={labelClass}>Judul Tugas <span className="text-red-500">*</span></label>
                    <input type="text" name="judul" value={judul} onChange={onChange} placeholder="Misal: Pengembangan Modul Autentikasi" className={fieldClass(errors?.judul)} />
                    {errors?.judul && <p className="mt-1 text-sm text-red-500">{errors.judul}</p>}
                </div>
                <div>
                    <label className={labelClass}>Deskripsi Tugas <span className="text-red-500">*</span></label>
                    <textarea rows={4} name="deskripsi" value={deskripsi} onChange={onChange} placeholder="Jelaskan detail tugas yang dikerjakan hari ini..." className={`${fieldClass(errors?.deskripsi)} resize-none`} />
                    {errors?.deskripsi && <p className="mt-1 text-sm text-red-500">{errors.deskripsi}</p>}
                </div>
                <div>
                    <label className={labelClass}>Pencapaian / Hasil <span className="text-red-500">*</span></label>
                    <textarea rows={3} name="hasil" value={hasil} onChange={onChange} placeholder="Apa hasil nyata dari pekerjaan hari ini?" className={`${fieldClass(errors?.hasil)} resize-none`} />
                    {errors?.hasil && <p className="mt-1 text-sm text-red-500">{errors.hasil}</p>}
                </div>
                <div>
                    <label className={labelClass}>Lampiran Bukti</label>
                    <div onClick={() => fileInputRef.current?.click()} className="group cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-white p-6 text-center shadow-sm transition hover:border-sky-400 hover:bg-sky-50/40">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition-transform group-hover:scale-105"><FaUpload size={20} /></div>
                        <p className="text-sm text-slate-600">Seret file ke sini atau <span className="font-bold text-sky-600">klik untuk upload</span></p>
                        <p className="mt-2 text-xs text-slate-400">JPG, PNG, PDF, DOCX, XLSX (Maks. 10 MB)</p>
                    </div>
                    <input ref={fileInputRef} type="file" hidden multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" onChange={onFileChange} />
                    {files.length > 0 && <div className="mt-4 space-y-2">{files.map((file, index) => <div key={index} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><div className="flex min-w-0 items-center gap-3"><FaPaperclip className="shrink-0 text-sky-600" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-700">{file.name}</p><p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div></div><button type="button" onClick={() => removeFile(index)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700" title="Hapus file"><FaTrash /></button></div>)}</div>}
                </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs font-medium text-slate-500">Data akan otomatis tersimpan sebagai draft</p>
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onSaveDraft} disabled={loading} className="rounded-xl border border-sky-200 bg-white px-5 py-2.5 text-sm font-bold text-sky-700 shadow-sm hover:border-sky-300 hover:bg-sky-50 disabled:opacity-50">Simpan Draft</button>
                    <button type="submit" disabled={loading} className="rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg disabled:opacity-50">{loading ? "Menyimpan..." : "Kirim"}</button>
                </div>
            </div>
        </form>
    );
}

export default ActivityForm;
