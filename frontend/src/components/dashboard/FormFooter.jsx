// =============================================
// File : src/components/dashboard/FormFooter.jsx
// =============================================

import { FaPaperPlane, FaTimes } from "react-icons/fa";

function FormFooter({
    loading = false,
    onClose,
}) {
    return (
        <div
            className="
                border-t
                border-gray-200
                bg-white
                px-6
                py-5
            "
        >
            <div className="flex flex-col-reverse md:flex-row justify-end gap-3">

                {/* Tombol Batal */}

                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        px-6
                        py-3
                        rounded-xl
                        border
                        border-gray-300
                        text-gray-700
                        hover:bg-gray-100
                        transition
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                    "
                >
                    <FaTimes />

                    <span>
                        Batal
                    </span>

                </button>

                {/* Tombol Simpan */}

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        px-6
                        py-3
                        rounded-xl
                        bg-sky-600
                        hover:bg-sky-700
                        text-white
                        shadow-md
                        transition
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                    "
                >
                    <FaPaperPlane />

                    <span>
                        {loading
                            ? "Menyimpan..."
                            : "Simpan Aktivitas"}
                    </span>

                </button>

            </div>
        </div>
    );
}

export default FormFooter;