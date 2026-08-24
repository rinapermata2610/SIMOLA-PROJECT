// =============================================
// File : src/components/dashboard/CalendarLegend.jsx
// =============================================

function CalendarLegend() {
    const legends = [
        {
            color: "bg-gray-300",
            title: "Di Luar Periode",
            description: "Tanggal belum dimulai atau sudah melewati periode magang.",
        },
        {
            color: "bg-red-500",
            title: "Belum Diisi",
            description: "Tanggal telah berlalu tetapi aktivitas belum diinput.",
        },
        {
            color: "bg-green-500",
            title: "Sudah Diisi",
            description: "Aktivitas magang pada tanggal tersebut telah tersimpan.",
        },
        {
            color: "bg-sky-500",
            title: "Hari Ini",
            description: "Tanggal saat ini yang dapat segera diisi.",
        },
    ];

    return (
        <div className="border-t border-slate-200 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">

            <h3 className="mb-4 text-base font-extrabold text-slate-800">
                Keterangan Status Kalender
            </h3>

            <div className="grid grid-cols-1 gap-3">

                {legends.map((item) => (
                    <div
                        key={item.title}
                        className="
                            flex
                            items-start
                            gap-3
                            bg-slate-50
                            rounded-xl
                            border
                            border-gray-200
                            p-3
                        "
                    >
                        <span
                            className={`
                                mt-1
                                w-4
                                h-4
                                rounded-full
                                ${item.color}
                            `}
                        />

                        <div>

                            <p className="font-semibold text-gray-800">
                                {item.title}
                            </p>

                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                {item.description}
                            </p>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default CalendarLegend;