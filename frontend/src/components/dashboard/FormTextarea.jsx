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
            <div className="flex items-center justify-between">
                <label htmlFor={name} className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
                {maxLength && <span className="text-xs font-medium text-slate-400">{currentLength}/{maxLength}</span>}
            </div>
            <textarea
                id={name}
                name={name}
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 shadow-sm outline-none transition ${
                    error ? "border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                } ${disabled ? "cursor-not-allowed bg-slate-100" : ""}`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

export default FormTextarea;
