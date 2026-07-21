// =============================================
// File : src/components/dashboard/ActivityModal.jsx
// =============================================

import { FaTimes } from "react-icons/fa";
import ActivityForm from "./ActivityForm";

function ActivityModal({
    open,
    onClose,
    mode = "create",
    selectedDate,
    initialData = null,
    onSubmit,
    loading = false,
}) {

    if (!open) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="
                    fixed
                    inset-0
                    flex
                    items-center
                    justify-center
                    z-50
                    p-4
                "
            >
                <div
                    className="
                        w-full
                        max-w-3xl
                        bg-white
                        rounded-2xl
                        shadow-2xl
                        overflow-hidden
                        animate-[fadeIn_.2s_ease]
                    "
                >
                    {/* Header */}
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-gray-200
                            px-6
                            py-5
                        "
                    >
                        <div>

                            <h2 className="text-2xl font-bold text-gray-800">
                                {mode === "edit"
                                    ? "Edit Aktivitas Magang"
                                    : "Tambah Aktivitas Magang"}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Tanggal :
                                <span className="font-semibold text-sky-600">
                                    {" "}
                                    {selectedDate}
                                </span>
                            </p>

                        </div>

                        <button
                            onClick={onClose}
                            className="
                                w-10
                                h-10
                                rounded-lg
                                hover:bg-red-50
                                text-gray-500
                                hover:text-red-500
                                transition
                            "
                        >
                            <FaTimes />
                        </button>

                    </div>

                    {/* Body */}
                    <div className="p-6">

                        <ActivityForm
                            mode={mode}
                            initialData={initialData}
                            loading={loading}
                            onSubmit={onSubmit}
                        />

                    </div>

                </div>
            </div>
        </>
    );
}

export default ActivityModal;