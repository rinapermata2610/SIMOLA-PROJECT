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
            bg: "bg-gradient-to-br from-sky-500 to-cyan-500",
            text: "text-white",
            shadow: "shadow-md shadow-sky-500/20",
        },
        emerald: {
            bg: "bg-gradient-to-br from-emerald-500 to-teal-500",
            text: "text-white",
            shadow: "shadow-md shadow-emerald-500/20",
        },
        amber: {
            bg: "bg-gradient-to-br from-amber-400 to-orange-500",
            text: "text-white",
            shadow: "shadow-md shadow-amber-500/20",
        },
    };

    const selected = colorClasses[color] || colorClasses.sky;

    return (
        <div
            className="
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-sm
                hover:shadow-lg
                transition-all
                duration-300
                p-5
            "
        >
            <div className="flex items-start justify-between">

                <div className="flex-1">

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        {title}
                    </p>

                    <h3
                        className="
                            mt-3
                            text-base
                            font-bold
                            text-slate-800
                            leading-relaxed
                        "
                    >
                        {value}
                    </h3>

                </div>

                <div
                    className={`
                        h-11
                        w-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        text-xl
                        ring-1
                        ring-inset
                        ring-white/20
                        ${selected.bg}
                        ${selected.text}
                        ${selected.shadow}
                    `}
                >
                    {icon}
                </div>

            </div>
        </div>
    );
}

export default SummaryCard;