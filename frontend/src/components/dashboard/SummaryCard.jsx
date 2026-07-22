// =============================================
// File : src/components/dashboard/SummaryCard.jsx
// =============================================

function SummaryCard({
    title,
    value,
    icon,
    color = "sky",
}) {

    const colorClasses = {
        sky: {
            bg: "bg-sky-100",
            text: "text-sky-600",
        },
        emerald: {
            bg: "bg-emerald-100",
            text: "text-emerald-600",
        },
        amber: {
            bg: "bg-amber-100",
            text: "text-amber-600",
        },
    };

    const selected = colorClasses[color] || colorClasses.sky;

    return (
        <div
            className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                shadow-sm
                hover:shadow-lg
                transition-all
                duration-300
                p-6
            "
        >
            <div className="flex items-start justify-between">

                <div className="flex-1">

                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h3
                        className="
                            mt-3
                            text-lg
                            font-semibold
                            text-gray-800
                            leading-relaxed
                        "
                    >
                        {value}
                    </h3>

                </div>

                <div
                    className={`
                        w-14
                        h-14
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        text-2xl
                        ${selected.bg}
                        ${selected.text}
                    `}
                >
                    {icon}
                </div>

            </div>
        </div>
    );
}

export default SummaryCard;