// =============================================
// File : src/components/dashboard/CalendarGrid.jsx
// =============================================

import CalendarDay from "./CalendarDay";

function CalendarGrid({
    currentDate,
    selectedDate,
    onDateClick,
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

    // Hari pertama bulan
    const firstDay = new Date(year, month, 1);

    // Jumlah hari dalam bulan
    const lastDay = new Date(year, month + 1, 0);

    const totalDays = lastDay.getDate();

    // Mengubah Sunday menjadi indeks terakhir
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    // Hari terakhir bulan sebelumnya
    const previousMonthLastDay = new Date(
        year,
        month,
        0
    ).getDate();

    const today = new Date();

    const calendar = [];

    // ==========================
    // Tanggal bulan sebelumnya
    // ==========================
    for (let i = startDay; i > 0; i--) {
        calendar.push({
            day: previousMonthLastDay - i + 1,
            currentMonth: false,
        });
    }

    // ==========================
    // Bulan sekarang
    // ==========================
    for (let day = 1; day <= totalDays; day++) {

        const date = new Date(year, month, day);

        let status = "empty";

        // contoh dummy
        if ([1, 3, 8, 10, 14].includes(day))
            status = "completed";

        const isToday =
            date.toDateString() === today.toDateString();

        const isSelected =
            selectedDate &&
            date.toDateString() ===
                selectedDate.toDateString();

        calendar.push({
            day,
            date,
            status,
            currentMonth: true,
            isToday,
            isSelected,
        });
    }

    // ==========================
    // Bulan berikutnya
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

            <div className="grid grid-cols-7 gap-2 mb-4">

                {weekDays.map((day) => (

                    <div
                        key={day}
                        className="
                            text-center
                            font-semibold
                            text-gray-500
                            py-2
                        "
                    >
                        {day}
                    </div>

                ))}

            </div>

            {/* Kalender */}

            <div className="grid grid-cols-7 gap-2">

                {calendar.map((item, index) => (

                    <CalendarDay
                        key={index}
                        day={item.day}
                        date={item.date}
                        status={item.status}
                        isToday={item.isToday}
                        isSelected={item.isSelected}
                        currentMonth={item.currentMonth}
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