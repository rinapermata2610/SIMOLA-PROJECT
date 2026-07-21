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
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        border-gray-300
                        rounded-lg
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        outline-none
                        transition
                    "
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                    "
                >
                    {show ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div>
    );
}

export default PasswordField;