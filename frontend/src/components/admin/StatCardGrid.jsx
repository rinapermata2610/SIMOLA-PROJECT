// =============================================
// File : src/components/admin/StatCardGrid.jsx
// =============================================

import {
    FaCalendarCheck,
    FaChalkboardTeacher,
    FaExclamationTriangle,
    FaUserGraduate,
} from "react-icons/fa";

import StatCard from "./StatCard";

function StatCardGrid({ data = {} }) {
    const mahasiswaActive = Number(data?.mahasiswa_active ?? 0);
    const pembimbingActive = Number(data?.pembimbing_active ?? 0);
    const relasiBelum = Number(data?.relasi_belum ?? 0);
    const periodeBerjalan = Number(data?.periode_berjalan ?? 0);

    const ratio = pembimbingActive > 0
        ? Math.round(mahasiswaActive / pembimbingActive)
        : 0;

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
                title="Total Mahasiswa Aktif"
                value={mahasiswaActive.toLocaleString("id-ID")}
                icon={<FaUserGraduate />}
                color="sky"
                helperText="Jumlah akun mahasiswa aktif"
                helperColor="text-gray-500"
            />

            <StatCard
                title="Total Pembimbing Aktif"
                value={pembimbingActive.toLocaleString("id-ID")}
                icon={<FaChalkboardTeacher />}
                color="emerald"
                helperText={`Rasio 1:${ratio} Mahasiswa`}
                helperColor="text-emerald-600"
            />

            <StatCard
                title="Belum Punya Pembimbing"
                value={relasiBelum.toLocaleString("id-ID")}
                icon={<FaExclamationTriangle />}
                color="amber"
                highlight={true}
                helperText="Tugaskan Sekarang →"
                helperColor="text-amber-600"
            />

            <StatCard
                title="Periode Aktif"
                value={periodeBerjalan.toLocaleString("id-ID")}
                icon={<FaCalendarCheck />}
                color="sky"
                helperText="Periode magang berjalan"
                helperColor="text-gray-500"
            />
        </section>
    );
}

export default StatCardGrid;
