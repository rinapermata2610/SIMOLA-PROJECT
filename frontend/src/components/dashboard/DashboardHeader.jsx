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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* Kiri */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Selamat datang kembali,
                        <span className="font-semibold text-sky-600">
                            {" "}
                            {user.nama}
                        </span>
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        Semoga aktivitas magang hari ini berjalan lancar.
                    </p>
                </div>

                {/* Kanan */}
                <div className="flex items-center gap-3 bg-sky-50 px-5 py-3 rounded-xl border border-sky-100">

                    <div className="bg-sky-500 text-white p-3 rounded-lg">
                        <FaRegCalendarAlt size={20} />
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 uppercase">
                            Hari Ini
                        </p>

                        <p className="font-semibold text-gray-800">
                            {tanggal}
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default DashboardHeader;