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
            <div className="min-h-screen bg-[#f3f7fb] flex items-center justify-center px-6">
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
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 p-6 md:p-8 text-white shadow-lg shadow-sky-100">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-100">
                        SIMOLA / RUANG ADMIN
                    </p>
                    <h1 className="mt-2 text-2xl md:text-4xl font-extrabold">
                        Dashboard Overview
                    </h1>
                    <p className="mt-2 text-sky-50">
                        Selamat datang kembali, <span className="font-bold">{user?.nama}</span>. Berikut ringkasan operasional SIMOLA hari ini.
                    </p>
                </div>

                
            </section>

            <StatCardGrid data={data} />

            <PeriodeTable data={data?.periode_terbaru ?? []} />
        </div>
    );
}

export default Dashboard;
