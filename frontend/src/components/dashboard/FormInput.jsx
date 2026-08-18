// =============================================
// File : src/components/dashboard/FormInput.jsx
// =============================================

function FormInput({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    required = false,
    disabled = false,
    error = "",
    rows = 4,
    min,
    max,
}) {
    const baseClass = `
        w-full
        rounded-xl
        border
        px-4
        py-3
        text-sm
        transition
        outline-none
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
    `;

    return (
        <div className="space-y-2">

            <label
                htmlFor={name}
                className="block text-sm font-semibold text-gray-700"
            >
                {label}

                {required && (
                    <span className="text-red-500 ml-1">
                        *
                    </span>
                )}

            </label>

            {type === "textarea" ? (

                <textarea
                    id={name}
                    name={name}
                    rows={rows}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={baseClass}
                />

            ) : (

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    min={min}
                    max={max}
                    className={baseClass}
                />

            )}

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

        </div>
    );
}

export default FormInput;