import React from "react";

function InputField({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    name,
}) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="
                    w-full
                    px-4
                    py-3
                    border
                    border-gray-300
                    rounded-lg
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-blue-500
                    outline-none
                    transition
                "
            />
        </div>
    );
}

export default InputField;