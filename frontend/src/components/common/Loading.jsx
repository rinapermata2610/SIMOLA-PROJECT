// =============================================
// File : src/components/common/Loading.jsx
// =============================================

import { FaSpinner } from "react-icons/fa";

function Loading({
    text = "Memuat data...",
    fullScreen = false,
}) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <FaSpinner className="text-4xl text-blue-700 animate-spin" />

            <p className="text-sm text-gray-600 font-medium">
                {text}
            </p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-10">
            {content}
        </div>
    );
}

export default Loading;