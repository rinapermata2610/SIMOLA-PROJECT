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
                p-4 sm:p-6
            "
        >
            {/* Header */}

            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                        Kalender Aktivitas Magang
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
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
                        rounded-lg
                        bg-gradient-to-r
                        from-sky-600
                        to-cyan-500
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-white
                        shadow-md
                        transition
                        hover:shadow-lg
                        active:shadow-sm
                        focus-visible:outline-none
                        group
                    "
                >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 transition-transform duration-200 group-hover:rotate-90">
                        <FaPlus className="text-xs" />
                    </span>

                    Isi Aktivitas Hari Ini
                </button>

            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                {/* Kalender */}
                <div>
                    <CalendarHeader
                        currentDate={currentDate}
                        onPrevious={previousMonth}
                        onNext={nextMonth}
                        onToday={() => setCurrentDate(new Date())}
                    />

                    <div className="mx-auto mt-4 max-w-3xl">
                        <CalendarGrid
                            currentDate={currentDate}
                            selectedDate={selectedDate}
                            onDateClick={onDateClick}
                        />
                    </div>
                </div>

                {/* Keterangan */}
                <CalendarLegend />
            </div>

        </div>
    );
}

export default CalendarCard;