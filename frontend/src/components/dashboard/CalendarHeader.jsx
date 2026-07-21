// =============================================
// File : src/components/dashboard/CalendarHeader.jsx
// =============================================

import {
    FaChevronLeft,
    FaChevronRight,
    FaCalendarDay,
} from "react-icons/fa";

function CalendarHeader({
    currentDate,
    onPrevious,
    onNext,
    onToday,
}) {

    const monthYear = currentDate.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
    });

    return (
        <div
            className="
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-4
                bg-slate-50
                border
                border-gray-200
                rounded-2xl
                px-6
                py-5
            "
        >

            {/* Kiri */}
            <div>

                <h3 className="text-2xl font-bold text-gray-800 capitalize">
                    {monthYear}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                    Kalender Aktivitas Mahasiswa Magang
                </p>

            </div>

            {/* Kanan */}
            <div className="flex items-center gap-3">

                {/* Bulan Sebelumnya */}
                <button
                    onClick={onPrevious}
                    className="
                        w-11
                        h-11
                        rounded-xl
                        border
                        border-gray-300
                        flex
                        items-center
                        justify-center
                        hover:bg-sky-50
                        hover:border-sky-500
                        hover:text-sky-600
                        transition
                    "
                >
                    <FaChevronLeft />
                </button>

                {/* Hari Ini */}
                <button
                    onClick={onToday}
                    className="
                        flex
                        items-center
                        gap-2
                        bg-sky-600
                        hover:bg-sky-700
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        font-medium
                        transition
                    "
                >
                    <FaCalendarDay />

                    Hari Ini
                </button>

                {/* Bulan Berikutnya */}
                <button
                    onClick={onNext}
                    className="
                        w-11
                        h-11
                        rounded-xl
                        border
                        border-gray-300
                        flex
                        items-center
                        justify-center
                        hover:bg-sky-50
                        hover:border-sky-500
                        hover:text-sky-600
                        transition
                    "
                >
                    <FaChevronRight />
                </button>

            </div>

        </div>
    );
}

export default CalendarHeader;