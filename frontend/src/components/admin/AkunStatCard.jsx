// =============================================
// File : src/components/admin/AkunStatCard.jsx
// =============================================

import {
    FaChalkboardTeacher,
    FaUserGraduate,
    FaUsers,
    FaUserSlash,
} from "react-icons/fa";

import StatCard from "./StatCard";

function AkunStatCard({ stats = {} }) {
    const cards = [
        {
            title: "Total Pengguna",
            value: Number(stats.total ?? 0),
            icon: <FaUsers />,
            color: "amber",
            helperText: "Jumlah semua akun",
        },
        {
            title: "Mahasiswa Aktif",
            value: Number(stats.mahasiswaAktif ?? 0),
            icon: <FaUserGraduate />,
            color: "sky",
            helperText: "Mahasiswa aktif",
        },
        {
            title: "Pembimbing Lapangan",
            value: Number(stats.pembimbingAktif ?? 0),
            icon: <FaChalkboardTeacher />,
            color: "emerald",
            helperText: "Pembimbing aktif",
        },
        {
            title: "Akun Nonaktif",
            value: Number(stats.nonaktif ?? 0),
            icon: <FaUserSlash />,
            color: "red",
            helperText: "Belum aktif",
        },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards.map((item) => (
                <StatCard
                    key={item.title}
                    title={item.title}
                    value={item.value.toLocaleString("id-ID")}
                    icon={item.icon}
                    color={item.color}
                    helperText={item.helperText}
                    helperColor="text-gray-500"
                />
            ))}
        </section>
    );
}

export default AkunStatCard;
