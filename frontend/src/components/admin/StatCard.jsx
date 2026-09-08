// =============================================
// File : src/components/admin/StatCard.jsx
// =============================================

function StatCard({ title, value, icon, color = "sky", helperText, helperColor, highlight = false }) {
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
        red: {
            bg: "bg-red-100",
            text: "text-red-600",
        },
        gray: {
            bg: "bg-gray-100",
            text: "text-gray-600",
        },
    };

    const selected = colorClasses[color] || colorClasses.sky;

    return (
        <div className={`bg-white border border-slate-200 rounded-2xl shadow-[0_4px_18px_rgba(15,23,42,0.06)] hover:shadow-lg transition-all duration-300 p-5 md:p-6 ${highlight ? "border-l-4 border-l-amber-500" : ""}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-bold text-slate-500">
                        {title}
                    </p>
                    <h3 className="mt-3 text-3xl font-extrabold text-slate-800 leading-relaxed">
                        {value}
                    </h3>
                    {helperText && (
                        <p className={`mt-2 text-sm ${helperColor ?? "text-gray-500"}`}>{helperText}</p>
                    )}
                </div>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${selected.bg} ${selected.text}`}> 
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default StatCard;
