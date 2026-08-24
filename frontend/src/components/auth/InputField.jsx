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
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
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
                    border-slate-200
                    rounded-xl
                    bg-slate-50
                    text-sm
                    font-medium
                    text-slate-800
                    placeholder-slate-400
                    focus:ring-4
                    focus:ring-sky-500/10
                    focus:border-sky-500
                    outline-none
                    transition
                "
            />
        </div>
    );
}

export default InputField;