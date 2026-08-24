import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PasswordField({
    value,
    onChange,
    name,
}) {
    const [show, setShow] = useState(false);

    return (
        <div className="mb-4">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Password
            </label>

            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder="Masukkan password"
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

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        rounded-lg
                        p-2
                        text-slate-400
                        hover:bg-sky-50
                        hover:text-sky-600
                        transition
                    "
                >
                    {show ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div>
    );
}

export default PasswordField;