// =============================================
// File : src/components/dashboard/FilePreview.jsx
// =============================================

import {
    FaFilePdf,
    FaFileImage,
    FaFileWord,
    FaFileExcel,
    FaFileAlt,
    FaDownload,
    FaTrashAlt,
} from "react-icons/fa";

function FilePreview({
    files = [],
    onRemove,
    disabled = false,
}) {
    const getIcon = (fileName) => {
        const ext = fileName
            .split(".")
            .pop()
            .toLowerCase();

        switch (ext) {
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
            case "webp":
                return (
                    <FaFileImage className="text-green-500 text-2xl" />
                );

            case "pdf":
                return (
                    <FaFilePdf className="text-red-500 text-2xl" />
                );

            case "doc":
            case "docx":
                return (
                    <FaFileWord className="text-blue-500 text-2xl" />
                );

            case "xls":
            case "xlsx":
                return (
                    <FaFileExcel className="text-emerald-500 text-2xl" />
                );

            default:
                return (
                    <FaFileAlt className="text-gray-500 text-2xl" />
                );
        }
    };

    const formatSize = (size) => {
        if (!size) return "-";

        if (size < 1024)
            return `${size} B`;

        if (size < 1024 * 1024)
            return `${(size / 1024).toFixed(1)} KB`;

        return `${(
            size /
            (1024 * 1024)
        ).toFixed(2)} MB`;
    };

    if (files.length === 0) {
        return (
            <div
                className="
                    rounded-xl
                    border
                    border-dashed
                    border-gray-300
                    py-8
                    text-center
                    text-gray-500
                "
            >
                Belum ada lampiran.
            </div>
        );
    }

    return (
        <div className="space-y-3">

            {files.map((file, index) => {
                const url =
                    file instanceof File
                        ? URL.createObjectURL(file)
                        : file.url;

                return (
                    <div
                        key={index}
                        className="
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            px-4
                            py-3
                        "
                    >
                        {/* File */}

                        <div className="flex items-center gap-4">

                            {getIcon(file.name)}

                            <div>

                                <p className="font-medium text-gray-800 break-all">
                                    {file.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {formatSize(file.size)}
                                </p>

                            </div>

                        </div>

                        {/* Action */}

                        <div className="flex items-center gap-2">

                            <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    w-10
                                    h-10
                                    rounded-lg
                                    bg-sky-100
                                    text-sky-600
                                    hover:bg-sky-200
                                    flex
                                    items-center
                                    justify-center
                                    transition
                                "
                            >
                                <FaDownload />
                            </a>

                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onRemove(index)
                                    }
                                    className="
                                        w-10
                                        h-10
                                        rounded-lg
                                        bg-red-100
                                        text-red-600
                                        hover:bg-red-200
                                        flex
                                        items-center
                                        justify-center
                                        transition
                                    "
                                >
                                    <FaTrashAlt />
                                </button>
                            )}

                        </div>

                    </div>
                );
            })}

        </div>
    );
}

export default FilePreview;