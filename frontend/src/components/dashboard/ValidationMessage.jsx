// =============================================
// File : src/components/dashboard/ValidationMessage.jsx
// =============================================

import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTimesCircle,
} from "react-icons/fa";

function ValidationMessage({
    type = "info",
    message = "",
}) {
    if (!message) return null;

    const config = {
        success: {
            icon: <FaCheckCircle />,
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-700",
            iconColor: "text-green-600",
        },
        error: {
            icon: <FaTimesCircle />,
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-700",
            iconColor: "text-red-600",
        },
        warning: {
            icon: <FaExclamationTriangle />,
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-700",
            iconColor: "text-yellow-600",
        },
        info: {
            icon: <FaInfoCircle />,
            bg: "bg-sky-50",
            border: "border-sky-200",
            text: "text-sky-700",
            iconColor: "text-sky-600",
        },
    };

    const style = config[type] || config.info;

    return (
        <div
            className={`
                flex
                items-start
                gap-3
                rounded-xl
                border
                px-4
                py-3
                ${style.bg}
                ${style.border}
            `}
        >
            <div
                className={`
                    mt-0.5
                    text-lg
                    ${style.iconColor}
                `}
            >
                {style.icon}
            </div>

            <div className="flex-1">
                <p
                    className={`
                        text-sm
                        leading-6
                        ${style.text}
                    `}
                >
                    {message}
                </p>
            </div>
        </div>
    );
}

export default ValidationMessage;