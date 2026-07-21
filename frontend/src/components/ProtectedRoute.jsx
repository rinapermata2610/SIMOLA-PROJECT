// =============================================
// File : src/components/ProtectedRoute.jsx
// =============================================

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./common/Loading";

function ProtectedRoute() {
    const { loading, isAuthenticated } = useAuth();

    // Menunggu pengecekan autentikasi
    if (loading) {
        return (
            <Loading
                fullScreen={true}
                text="Memverifikasi sesi..."
            />
        );
    }

    // Jika belum login, arahkan ke halaman login
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Jika sudah login, tampilkan halaman yang diminta
    return <Outlet />;
}

export default ProtectedRoute;