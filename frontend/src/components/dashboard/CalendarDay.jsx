// =============================================
// File : src/components/dashboard/CalendarDay.jsx
// =============================================

function CalendarDay({
    day,
    date,
    currentMonth = true,
    isToday = false,
    isSelected = false,
    onClick,
}) {
    const today = new Date();

    const isFuture =
        date &&
        date.setHours(0, 0, 0, 0) >
            new Date().setHours(0, 0, 0, 0);

    const dayOfWeek =
        date?.getDay() === 0
            ? 7
            : date?.getDay();

    const isWeekend =
        dayOfWeek === 6 ||
        dayOfWeek === 7;

    const disabled =
        !currentMonth ||
        isFuture ||
        isWeekend;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                relative
                aspect-square
                rounded-lg
                border
                flex
                items-center
                justify-center
                text-sm
                font-semibold
                transition-all

                ${
                    !currentMonth
                        ? "bg-slate-50 border-slate-200 text-slate-400"
                        : "bg-white border-slate-200 text-slate-700"
                }

                ${
                    currentMonth &&
                    !disabled
                        ? "hover:border-sky-500 hover:bg-sky-50 hover:shadow-sm"
                        : ""
                }

                ${
                    isToday
                        ? "bg-sky-100 border-sky-500 text-sky-700"
                        : ""
                }

                ${
                    isSelected
                        ? "ring-2 ring-sky-500 ring-offset-1 border-sky-500"
                        : ""
                }

                ${
                    disabled &&
                    currentMonth
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                }
            `}
        >

            {/* Nomor Tanggal */}

            <span>{day}</span>

            {/* Hari Ini */}

            {isToday && (

                <span
                    className="
                        absolute
                        bottom-1.5
                        right-1.5
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-sky-600
                    "
                />

            )}

        </button>
    );
}

export default CalendarDay;