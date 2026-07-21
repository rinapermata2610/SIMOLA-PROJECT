// =============================================
// File : src/components/dashboard/CalendarDay.jsx
// =============================================

function CalendarDay({
    day,
    date,
    status = "empty",
    currentMonth = true,
    isToday = false,
    isSelected = false,
    onClick,
}) {

    const getStyle = () => {

        // =============================
        // Di luar bulan aktif
        // =============================
        if (!currentMonth) {
            return {
                bg: "bg-gray-100",
                border: "border-gray-200",
                text: "text-gray-400",
                dot: "",
            };
        }

        // =============================
        // Sudah diisi
        // =============================
        if (status === "completed") {
            return {
                bg: "bg-green-100",
                border: "border-green-300",
                text: "text-green-700",
                dot: "bg-green-500",
            };
        }

        // =============================
        // Belum diisi
        // =============================
        return {
            bg: "bg-white",
            border: "border-gray-300",
            text: "text-gray-800",
            dot: "bg-red-500",
        };
    };

    const style = getStyle();

    return (
        <button
            onClick={onClick}
            disabled={!currentMonth}
            className={`
                relative
                aspect-square
                rounded-xl
                border-2
                transition-all
                duration-200
                flex
                items-center
                justify-center
                font-semibold
                text-lg
                hover:shadow-md
                hover:scale-[1.03]

                ${style.bg}
                ${style.border}
                ${style.text}

                ${
                    isSelected
                        ? "ring-2 ring-sky-500 border-sky-500"
                        : ""
                }

                ${
                    isToday
                        ? "bg-sky-100 border-sky-500 text-sky-700"
                        : ""
                }

                ${
                    !currentMonth
                        ? "cursor-default"
                        : "cursor-pointer"
                }
            `}
        >

            {/* Nomor Tanggal */}
            <span className="relative z-10">
                {day}
            </span>

            {/* Hari Ini */}
            {isToday && (
                <span
                    className="
                        absolute
                        top-2
                        left-2
                        w-2
                        h-2
                        rounded-full
                        bg-sky-500
                    "
                />
            )}

            {/* Status Aktivitas */}
            {currentMonth &&
                !isToday &&
                style.dot && (
                    <span
                        className={`
                            absolute
                            bottom-2
                            right-2
                            w-2.5
                            h-2.5
                            rounded-full
                            ${style.dot}
                        `}
                    />
                )}

        </button>
    );
}

export default CalendarDay;