// =============================================
// File : src/components/dashboard/ActivityModal.jsx
// =============================================

import {
    FaTimes,
    FaCalendarAlt,
} from "react-icons/fa";

import ActivityForm from "./ActivityForm";

function ActivityModal({
    open,
    selectedDate,
    form,
    loading = false,
    onChange,
    onFileChange,
    onRemoveFile,
    onClose,
    onSubmit,
}) {
    if (!open) return null;

    const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "-";

    return (
        <>
            {/* Overlay */}

            <div
                className="
                    fixed
                    inset-0
                    bg-black/50
                    z-50
                    flex
                    items-center
                    justify-center
                    p-4
                "
            >
                {/* Modal */}

                <div
                    className="
                        bg-white
                        w-full
                        max-w-5xl
                        max-h-[95vh]
                        rounded-2xl
                        shadow-2xl
                        overflow-hidden
                        flex
                        flex-col
                    "
                >
                    {/* Header */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            px-8
                            py-6
                            border-b
                            border-gray-200
                        "
                    >
                        <div>

                            <h2 className="text-2xl font-bold text-gray-800">
                                Form Aktivitas Magang
                            </h2>

                            <div className="flex items-center gap-2 mt-2 text-gray-500">

                                <FaCalendarAlt />

                                <span>
                                    {formattedDate}
                                </span>

                            </div>

                        </div>

                        <button
                            onClick={onClose}
                            className="
                                w-10
                                h-10
                                rounded-full
                                hover:bg-gray-100
                                flex
                                items-center
                                justify-center
                                transition
                            "
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Body */}

                    <div
                        className="
                            flex-1
                            overflow-y-auto
                            p-8
                        "
                    >
                        <ActivityForm
                            form={form}
                            loading={loading}
                            onChange={onChange}
                            onFileChange={onFileChange}
                            onRemoveFile={onRemoveFile}
                            onSubmit={onSubmit}
                            onClose={onClose}
                            selectedDate={selectedDate}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ActivityModal;