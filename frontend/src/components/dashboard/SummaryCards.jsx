// =============================================
// File : src/components/dashboard/SummaryCards.jsx
// =============================================

import {
    FaCalendarAlt,
    FaBuilding,
} from "react-icons/fa";

import SummaryCard from "./SummaryCard";

const formatDate = (value) => {
    if (!value) return null;

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
};

function SummaryCards({ periode }) {
    const startDate = formatDate(periode?.tanggal_mulai);
    const endDate = formatDate(periode?.tanggal_selesai);
    const periodLabel = startDate && endDate
        ? `${startDate} - ${endDate}`
        : "Belum tersedia";
    const institution = periode?.instansi?.trim() || "Belum tersedia";

    return (
        <div
            className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-2
                gap-4
            "
        >
            <SummaryCard
                title="Periode Magang"
                value={periodLabel}
                icon={<FaCalendarAlt />}
                color="sky"
            />

            <SummaryCard
                title="Instansi"
                value={institution}
                icon={<FaBuilding />}
                color="emerald"
            />
        </div>
    );
}

export default SummaryCards;