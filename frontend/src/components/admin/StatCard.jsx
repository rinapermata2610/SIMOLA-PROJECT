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
    };

    const selected = colorClasses[color] || colorClasses.sky;

    return (
        <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 ${highlight ? "border-l-4 border-l-amber-500" : ""}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold text-gray-800 leading-relaxed">
                        {value}
                    </h3>
                    {helperText && (
                        <p className={`mt-2 text-sm ${helperColor ?? "text-gray-500"}`}>{helperText}</p>
                    )}
                </div>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${selected.bg} ${selected.text}`}> 
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default StatCard;
