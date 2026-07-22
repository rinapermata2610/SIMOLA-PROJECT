// =============================================
// File : src/components/dashboard/FormHeader.jsx
// =============================================

import { FaCalendarAlt, FaClock } from "react-icons/fa";

function FormHeader({ selectedDate }) {
    const tanggal = selectedDate
        ? selectedDate.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "-";

    const now = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div
            className="
                border-b
                border-gray-200
                px-6
                py-5
                bg-white
            "
        >
            <div className="flex flex-col gap-4">

                {/* Judul */}

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Form Aktivitas Magang
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Isi aktivitas yang telah dikerjakan pada tanggal yang dipilih.
                    </p>

                </div>

                {/* Informasi */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            bg-sky-50
                            border
                            border-sky-200
                            rounded-xl
                            px-4
                            py-3
                        "
                    >
                        <div
                            className="
                                w-11
                                h-11
                                rounded-full
                                bg-sky-100
                                flex
                                items-center
                                justify-center
                                text-sky-600
                            "
                        >
                            <FaCalendarAlt />
                        </div>

                        <div>

                            <p className="text-xs text-gray-500">
                                Tanggal Aktivitas
                            </p>

                            <p className="font-semibold text-gray-800 capitalize">
                                {tanggal}
                            </p>

                        </div>

                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            bg-gray-50
                            border
                            border-gray-200
                            rounded-xl
                            px-4
                            py-3
                        "
                    >
                        <div
                            className="
                                w-11
                                h-11
                                rounded-full
                                bg-gray-100
                                flex
                                items-center
                                justify-center
                                text-gray-700
                            "
                        >
                            <FaClock />
                        </div>

                        <div>

                            <p className="text-xs text-gray-500">
                                Waktu Saat Ini
                            </p>

                            <p className="font-semibold text-gray-800">
                                {now} WIB
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default FormHeader;