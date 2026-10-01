const toDateKey = (value) => {
    if (!value) return null;

    const date = String(value).slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
};

export function getPeriodeStatus(tanggalMulai, tanggalSelesai, fallbackStatus) {
    const start = toDateKey(tanggalMulai);
    const end = toDateKey(tanggalSelesai);
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    if (start && todayKey < start) {
        return {
            label: "Belum Dimulai",
            className: "bg-yellow-100 text-yellow-700",
        };
    }

    if (end && todayKey > end) {
        return {
            label: "Selesai",
            className: "bg-red-100 text-red-700",
        };
    }

    if (start || end || fallbackStatus === "aktif") {
        return {
            label: "Berjalan",
            className: "bg-green-100 text-green-700",
        };
    }

    return {
        label: "Selesai",
        className: "bg-red-100 text-red-700",
    };
}