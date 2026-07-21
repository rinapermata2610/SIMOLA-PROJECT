// =============================================
// File : src/components/common/InputField.jsx
// =============================================

import React from "react";

function InputField({
    label,
    name,
    type = "text",
    placeholder = "",
    value,
    onChange,
    icon = null,
    required = false,
    disabled = false,
    error = "",
}) {
    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-semibold text-gray-700"
                >
                    {label}
                    {required && (
                        <span className="text-red-500 ml-1">*</span>
                    )}
                </label>
            )}

            <div
                className={`
                    flex items-center
                    rounded-xl
                    border
                    px-4
                    py-3
                    bg-white
                    transition-all
                    duration-200

                    ${
                        error
                            ? "border-red-500 focus-within:border-red-500"
                            : "border-gray-300 focus-within:border-blue-600"
                    }

                    focus-within:ring-2
                    ${
                        error
                            ? "focus-within:ring-red-200"
                            : "focus-within:ring-blue-100"
                    }
                `}
            >
                {icon && (
                    <span className="mr-3 text-gray-400 text-lg">
                        {icon}
                    </span>
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    autoComplete="off"
                    className="
                        w-full
                        outline-none
                        bg-transparent
                        text-gray-700
                        placeholder:text-gray-400
                        disabled:cursor-not-allowed
                        disabled:text-gray-400
                    "
                />
            </div>

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}

export default InputField;