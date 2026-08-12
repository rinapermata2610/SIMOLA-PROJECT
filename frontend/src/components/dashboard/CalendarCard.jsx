// =============================================
// File : src/components/dashboard/CalendarCard.jsx
// =============================================

import { useState } from "react";
import { FaPlus } from "react-icons/fa";

import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import CalendarLegend from "./CalendarLegend";

function CalendarCard({
    selectedDate,
    onDateClick,
    onAddToday,
}) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const previousMonth = () => {
        setCurrentDate(
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                1
            )
        );
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1
            )
        );
    };

    return (
        <div
            className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-gray-200
                p-6
            "
        >
            {/* Header */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Kalender Aktivitas Magang
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Pilih tanggal untuk mengisi atau memperbarui aktivitas magang.
                    </p>

                </div>

                <button
                    onClick={onAddToday}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-sky-600
                        hover:bg-sky-700
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        transition
                        shadow-md
                    "
                >
                    <FaPlus />

                    Isi Aktivitas Hari Ini
                </button>

            </div>

            {/* Header Kalender */}

            <CalendarHeader
                currentDate={currentDate}
                previousMonth={previousMonth}
                nextMonth={nextMonth}
            />

            {/* Kalender */}

            <div className="mt-6">

                <CalendarGrid
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    onDateClick={onDateClick}
                />

            </div>

            {/* Legend */}

            <div className="mt-8">

                <CalendarLegend />

            </div>

        </div>
    );
}

export default CalendarCard;