// =============================================
// File : src/components/common/PasswordField.jsx
// =============================================

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PasswordField({
    label,
    name,
    placeholder = "Masukkan password",
    value,
    onChange,
    icon = null,
    required = false,
    disabled = false,
    error = "",
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-semibold text-gray-700"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-red-500">*</span>
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
                            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-200"
                            : "border-gray-300 focus-within:border-blue-600 focus-within:ring-blue-100"
                    }

                    focus-within:ring-2
                `}
            >
                {icon && (
                    <span className="mr-3 text-lg text-gray-400">
                        {icon}
                    </span>
                )}

                <input
                    id={name}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    autoComplete="current-password"
                    className="
                        w-full
                        bg-transparent
                        outline-none
                        text-gray-700
                        placeholder:text-gray-400
                        disabled:cursor-not-allowed
                        disabled:text-gray-400
                    "
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                        ml-3
                        text-gray-500
                        hover:text-blue-600
                        transition-colors
                    "
                >
                    {showPassword ? (
                        <FaEyeSlash size={18} />
                    ) : (
                        <FaEye size={18} />
                    )}
                </button>
            </div>

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}

export default PasswordField;