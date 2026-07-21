// =============================================
// File : src/components/common/Button.jsx
// =============================================

import React from "react";
import { FaSpinner } from "react-icons/fa";

function Button({
    children,
    type = "button",
    onClick,
    loading = false,
    disabled = false,
    variant = "primary",
    className = "",
}) {
    const variants = {
        primary:
            "bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-300",

        secondary:
            "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300",

        success:
            "bg-green-600 hover:bg-green-700 text-white focus:ring-green-300",

        danger:
            "bg-red-600 hover:bg-red-700 text-white focus:ring-red-300",

        outline:
            "border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white focus:ring-blue-300",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className={`
                w-full
                flex
                items-center
                justify-center
                gap-2
                py-3
                px-4
                rounded-xl
                font-semibold
                transition-all
                duration-300
                focus:outline-none
                focus:ring-4
                disabled:opacity-60
                disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
        >
            {loading && (
                <FaSpinner className="animate-spin text-lg" />
            )}

            {loading ? "Memproses..." : children}
        </button>
    );
}

export default Button;