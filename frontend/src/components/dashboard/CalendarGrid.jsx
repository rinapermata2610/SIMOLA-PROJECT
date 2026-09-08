// =============================================
// File : src/components/dashboard/CalendarGrid.jsx
// =============================================

import CalendarDay from "./CalendarDay";

const normalizeDate = (value) => {
    if (!value) return null;
    return String(value).slice(0, 10);
};

function CalendarGrid({
    currentDate,
    selectedDate,
    onDateClick,
    periode,
    activities = [],
}) {
    const weekDays = [
        "Sen",
        "Sel",
        "Rab",
        "Kam",
        "Jum",
        "Sab",
        "Min",
    ];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const totalDays = lastDay.getDate();

    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    const previousMonthLastDay = new Date(
        year,
        month,
        0
    ).getDate();

    const today = new Date();
    const todayKey = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");
    const activityDates = new Set(
        activities
            .filter((activity) => activity?.tanggal)
            .map((activity) => normalizeDate(activity.tanggal))
    );

    const calendar = [];

    // ==========================
    // Bulan Sebelumnya
    // ==========================

    for (let i = startDay; i > 0; i--) {
        calendar.push({
            day: previousMonthLastDay - i + 1,
            currentMonth: false,
        });
    }

    // ==========================
    // Bulan Sekarang
    // ==========================

    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day);
        const dateKey = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");

        const isToday =
            date.toDateString() ===
            today.toDateString();

        const isSelected =
            selectedDate &&
            date.toDateString() ===
                selectedDate.toDateString();

        const periodStart = normalizeDate(periode?.tanggal_mulai);
        const periodEnd = normalizeDate(periode?.tanggal_selesai);
        const isOutsidePeriod = periodStart && periodEnd
            ? dateKey < periodStart || dateKey > periodEnd
            : false;
        const isFilled = activityDates.has(dateKey);
        const status = isOutsidePeriod
            ? "outside"
            : isFilled
                ? "filled"
                : dateKey === todayKey
                    ? "today"
                    : dateKey < todayKey
                        ? "empty"
                        : "upcoming";

        calendar.push({
            day,
            date,
            currentMonth: true,
            isToday,
            isSelected,
            status,
        });
    }

    // ==========================
    // Bulan Berikutnya
    // ==========================

    while (calendar.length < 42) {
        calendar.push({
            day:
                calendar.length -
                (startDay + totalDays) +
                1,
            currentMonth: false,
        });
    }

    return (
        <div>

            {/* Nama Hari */}

            <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">

                {weekDays.map((day) => (

                    <div
                        key={day}
                        className="
                            py-1.5
                            text-center
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        {day}
                    </div>

                ))}

            </div>

            {/* Kalender */}

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">

                {calendar.map((item, index) => (

                    <CalendarDay
                        key={index}
                        day={item.day}
                        date={item.date}
                        currentMonth={
                            item.currentMonth
                        }
                        isToday={item.isToday}
                        isSelected={
                            item.isSelected
                        }
                        status={item.status}
                        onClick={() =>
                            item.currentMonth &&
                            onDateClick(item.date)
                        }
                    />

                ))}

            </div>

        </div>
    );
}

export default CalendarGrid;