// =============================================
// File : src/components/dashboard/FormUpload.jsx
// =============================================

import {
    FaCloudUploadAlt,
    FaPaperclip,
    FaTrashAlt,
} from "react-icons/fa";

function FormUpload({
    files = [],
    onChange,
    error = "",
    disabled = false,
}) {
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length === 0) return;

        onChange([...files, ...selectedFiles]);

        e.target.value = "";
    };

    const removeFile = (index) => {
        const updatedFiles = files.filter(
            (_, i) => i !== index
        );

        onChange(updatedFiles);
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(1)} KB`;

        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="space-y-3">

            {/* Label */}

            <label className="block text-sm font-semibold text-gray-700">
                Lampiran Bukti
            </label>

            {/* Upload Area */}

            <label
                className={`
                    flex
                    flex-col
                    items-center
                    justify-center
                    border-2
                    border-dashed
                    rounded-2xl
                    p-8
                    cursor-pointer
                    transition
                    ${
                        disabled
                            ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                            : "hover:border-sky-500 hover:bg-sky-50 border-gray-300"
                    }
                `}
            >

                <FaCloudUploadAlt
                    className="text-sky-600 mb-3"
                    size={45}
                />

                <p className="font-medium text-gray-700">
                    Klik untuk memilih file
                </p>

                <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG, PDF, DOCX, XLSX (Maks. 10 MB)
                </p>

                <input
                    type="file"
                    multiple
                    hidden
                    disabled={disabled}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                />

            </label>

            {/* Error */}

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

            {/* List File */}

            {files.length > 0 && (

                <div className="space-y-2">

                    {files.map((file, index) => (

                        <div
                            key={index}
                            className="
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                border
                                border-gray-200
                                px-4
                                py-3
                                bg-gray-50
                            "
                        >

                            <div className="flex items-center gap-3">

                                <FaPaperclip className="text-sky-600" />

                                <div>

                                    <p className="font-medium text-gray-700">
                                        {file.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {formatSize(file.size)}
                                    </p>

                                </div>

                            </div>

                            {!disabled && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeFile(index)
                                    }
                                    className="
                                        text-red-500
                                        hover:text-red-700
                                        transition
                                    "
                                >
                                    <FaTrashAlt />
                                </button>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default FormUpload;