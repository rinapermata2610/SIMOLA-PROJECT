// =============================================
// File : src/components/dashboard/FormTextarea.jsx
// =============================================

function FormTextarea({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    rows = 5,
    required = false,
    disabled = false,
    maxLength,
    error = "",
}) {
    const currentLength = value?.length || 0;

    return (
        <div className="space-y-2">

            {/* Label */}
            <div className="flex items-center justify-between">

                <label
                    htmlFor={name}
                    className="text-sm font-semibold text-gray-700"
                >
                    {label}

                    {required && (
                        <span className="text-red-500 ml-1">
                            *
                        </span>
                    )}

                </label>

                {maxLength && (
                    <span className="text-xs text-gray-400">
                        {currentLength}/{maxLength}
                    </span>
                )}

            </div>

            {/* Textarea */}
            <textarea
                id={name}
                name={name}
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                className={`
                    w-full
                    rounded-xl
                    border
                    px-4
                    py-3
                    text-sm
                    resize-none
                    outline-none
                    transition
                    ${
                        error
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-sky-500"
                    }
                    ${
                        disabled
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white"
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

export default FormTextarea;