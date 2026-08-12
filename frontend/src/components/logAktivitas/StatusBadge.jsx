// =============================================
// File : src/components/logAktivitas/StatusBadge.jsx
// =============================================

function StatusBadge({ status }) {
    const getStatus = () => {
        switch ((status || "").toLowerCase()) {
            case "draft":
                return {
                    label: "Draft",
                    className:
                        "bg-yellow-100 text-yellow-700 border border-yellow-200",
                };

            case "terkirim":
            case "submitted":
            case "submit":
                return {
                    label: "Terkirim",
                    className:
                        "bg-green-100 text-green-700 border border-green-200",
                };

            default:
                return {
                    label: status || "-",
                    className:
                        "bg-slate-100 text-slate-600 border border-slate-200",
                };
        }
    };

    const badge = getStatus();

    return (
        <span
            className={`
                inline-flex
                items-center
                justify-center
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                whitespace-nowrap
                ${badge.className}
            `}
        >
            {badge.label}
        </span>
    );
}

export default StatusBadge;