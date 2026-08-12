// =============================================
// File : src/pages/admin/Dashboard.jsx
// =============================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import adminDashboardService from "../../services/adminDashboardService";
import Loading from "../../components/common/Loading";
import StatCardGrid from "../../components/admin/StatCardGrid";
import PeriodeTable from "../../components/admin/PeriodeTable";

function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const fetchOverview = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminDashboardService.getOverview();
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverview();
    }, []);

    if (loading) {
        return <Loading fullScreen={true} text="Memuat dashboard admin..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard tidak dapat dimuat</h1>
                    <p className="text-gray-600 mt-2">Terjadi kesalahan saat mengambil data overview admin.</p>
                    <button
                        aria-label="Coba lagi fetch dashboard"
                        onClick={fetchOverview}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Dashboard Overview
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Selamat datang kembali, <span className="font-semibold text-sky-600">{user?.nama}</span>. Berikut ringkasan operasional SIMOLA hari ini.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        aria-label="Tambah akun baru"
                        onClick={() => navigate("/admin/akun")}
                        className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition"
                    >
                        + Tambah Akun
                    </button>

                    <button
                        aria-label="Buat periode baru"
                        onClick={() => navigate("/admin/periode")}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl transition"
                    >
                        + Buat Periode Baru
                    </button>
                </div>
            </section>

            <StatCardGrid data={data} />

            <PeriodeTable data={data?.periode_terbaru ?? []} />
        </div>
    );
}

export default Dashboard;
