// =============================================
// File : src/components/dashboard/SummaryCards.jsx
// =============================================

import {
    FaCalendarAlt,
    FaBuilding,
    FaCheckCircle,
} from "react-icons/fa";

import SummaryCard from "./SummaryCard";

function SummaryCards() {
    // Data sementara (dummy)
    // Nanti akan diganti dari API Dashboard Laravel
    const dashboard = {
        periode: "15 Juli 2026 - 13 Agustus 2026",
        instansi: "Balai Bahasa Provinsi Jawa Barat",
        status: "Aktif",
    };

    return (
        <div
            className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6
            "
        >
            <SummaryCard
                title="Periode Magang"
                value={dashboard.periode}
                icon={<FaCalendarAlt />}
                color="sky"
            />

            <SummaryCard
                title="Instansi"
                value={dashboard.instansi}
                icon={<FaBuilding />}
                color="emerald"
            />

            <SummaryCard
                title="Status"
                value={dashboard.status}
                icon={<FaCheckCircle />}
                color="amber"
            />
        </div>
    );
}

export default SummaryCards;