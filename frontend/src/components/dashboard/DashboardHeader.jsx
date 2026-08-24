// =============================================
// File : src/components/dashboard/DashboardHeader.jsx
// =============================================

import { FaRegCalendarAlt } from "react-icons/fa";

function DashboardHeader() {
    // Sementara masih statis.
    // Nanti akan diganti dengan data dari API.
    const user = {
        nama: "Ahmad Fauzi",
    };

    const today = new Date();

    const tanggal = today.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 bg-gradient-to-r from-sky-600 to-cyan-500 p-5 text-white sm:p-7 md:flex-row md:items-center md:justify-between">

                {/* Kiri */}
                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-100">
                        SIMOLA / Ruang Mahasiswa
                    </p>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-white/90 sm:text-base">
                        Selamat datang kembali,
                        <span className="font-bold text-white">
                            {" "}
                            {user.nama}
                        </span>
                    </p>

                    <p className="mt-1 text-sm text-sky-100">
                        Semoga aktivitas magang hari ini berjalan lancar.
                    </p>
                </div>

                {/* Kanan */}
                <div className="flex items-center gap-3 rounded-xl border border-white/80 bg-white px-4 py-3 shadow-lg shadow-sky-900/10 sm:px-5">

                    <div className="rounded-lg bg-sky-50 p-3 text-sky-600 shadow-sm">
                        <FaRegCalendarAlt size={20} />
                    </div>

                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Hari Ini
                        </p>

                        <p className="text-sm font-bold capitalize text-slate-800">
                            {tanggal}
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}

export default DashboardHeader;