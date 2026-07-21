// =============================================
// File : src/components/dashboard/ActivityDetail.jsx
// =============================================

import {
    FaCalendarAlt,
    FaClock,
    FaTasks,
    FaCheckCircle,
    FaExclamationTriangle,
    FaPaperclip,
} from "react-icons/fa";

function ActivityDetail({ data }) {
    if (!data) {
        return (
            <div className="text-center py-10 text-gray-500">
                Data aktivitas belum tersedia.
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Informasi Umum */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-slate-50 rounded-xl p-4 border">
                    <div className="flex items-center gap-2 mb-2">
                        <FaCalendarAlt className="text-sky-600" />
                        <span className="font-semibold text-gray-700">
                            Tanggal
                        </span>
                    </div>

                    <p className="text-gray-800">
                        {data.tanggal}
                    </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border">
                    <div className="flex items-center gap-2 mb-2">
                        <FaClock className="text-green-600" />
                        <span className="font-semibold text-gray-700">
                            Jam Masuk
                        </span>
                    </div>

                    <p>{data.jam_masuk}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border">
                    <div className="flex items-center gap-2 mb-2">
                        <FaClock className="text-red-500" />
                        <span className="font-semibold text-gray-700">
                            Jam Pulang
                        </span>
                    </div>

                    <p>{data.jam_pulang}</p>
                </div>

            </div>

            {/* Aktivitas */}
            <div className="bg-white border rounded-xl p-5">

                <div className="flex items-center gap-2 mb-3">
                    <FaTasks className="text-sky-600" />

                    <h3 className="font-semibold text-lg">
                        Aktivitas
                    </h3>
                </div>

                <p className="text-gray-700 whitespace-pre-line">
                    {data.aktivitas}
                </p>

            </div>

            {/* Hasil */}
            <div className="bg-white border rounded-xl p-5">

                <div className="flex items-center gap-2 mb-3">
                    <FaCheckCircle className="text-green-600" />

                    <h3 className="font-semibold text-lg">
                        Hasil
                    </h3>
                </div>

                <p className="text-gray-700 whitespace-pre-line">
                    {data.hasil}
                </p>

            </div>

            {/* Kendala */}
            <div className="bg-white border rounded-xl p-5">

                <div className="flex items-center gap-2 mb-3">
                    <FaExclamationTriangle className="text-yellow-500" />

                    <h3 className="font-semibold text-lg">
                        Kendala
                    </h3>
                </div>

                <p className="text-gray-700 whitespace-pre-line">
                    {data.kendala || "-"}
                </p>

            </div>

            {/* Lampiran */}
            <div className="bg-white border rounded-xl p-5">

                <div className="flex items-center gap-2 mb-3">
                    <FaPaperclip className="text-sky-600" />

                    <h3 className="font-semibold text-lg">
                        Lampiran
                    </h3>
                </div>

                {data.lampiran ? (
                    <a
                        href={data.lampiran}
                        target="_blank"
                        rel="noreferrer"
                        className="
                            text-sky-600
                            hover:underline
                            font-medium
                        "
                    >
                        Lihat Lampiran
                    </a>
                ) : (
                    <p className="text-gray-500">
                        Tidak ada lampiran.
                    </p>
                )}

            </div>

        </div>
    );
}

export default ActivityDetail;