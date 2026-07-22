// =============================================
// File : src/components/dashboard/FormTimeInput.jsx
// =============================================

import { FaClock } from "react-icons/fa";

function FormTimeInput({
    label,
    name,
    value,
    onChange,
    required = false,
    disabled = false,
    min,
    max,
    error = "",
}) {
    return (
        <div className="space-y-2">

            {/* Label */}
            <label
                htmlFor={name}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
                <FaClock className="text-sky-600" />

                <span>
                    {label}

                    {required && (
                        <span className="text-red-500 ml-1">
                            *
                        </span>
                    )}
                </span>
            </label>

            {/* Input */}
            <input
                id={name}
                name={name}
                type="time"
                value={value}
                onChange={onChange}
                disabled={disabled}
                min={min}
                max={max}
                className={`
                    w-full
                    rounded-xl
                    border
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    bg-white
                    ${
                        error
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-sky-500"
                    }
                    ${
                        disabled
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                    }
                `}
            />

            {/* Error */}
            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

        </div>
    );
}

export default FormTimeInput;