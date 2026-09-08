function CalendarDay({
    day,
    date,
    currentMonth = true,
    isToday = false,
    isSelected = false,
    status = "upcoming",
    onClick,
}) {
    const disabled =
        !currentMonth ||
        status === "outside" ||
        status === "upcoming";

    const statusStyle = {
        outside: "bg-gray-200 border-gray-300 text-gray-500",
        empty: "bg-red-100 border-red-300 text-red-700",
        filled: "bg-green-100 border-green-400 text-green-700",
        today: "bg-sky-100 border-sky-400 text-sky-700",
        upcoming: "bg-white border-slate-200 text-slate-700",
    }[status];

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={date ? date.toLocaleDateString("id-ID") : undefined}
            className={`
                relative flex aspect-square items-center justify-center rounded-lg border
                text-sm font-semibold transition-all
                ${!currentMonth ? "bg-slate-50 border-slate-200 text-slate-400" : statusStyle}
                ${currentMonth && !disabled ? "cursor-pointer hover:border-sky-500 hover:bg-sky-50 hover:shadow-sm" : ""}
                ${isSelected ? "ring-2 ring-sky-500 ring-offset-1 border-sky-500" : ""}
                ${disabled && currentMonth ? "opacity-70 cursor-not-allowed" : ""}
            `}
        >
            <span>{day}</span>

            {isToday && (
                <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-sky-600" />
            )}
        </button>
    );
}

export default CalendarDay;
