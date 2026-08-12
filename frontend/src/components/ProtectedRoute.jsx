// =============================================
// File : src/components/ProtectedRoute.jsx
// =============================================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./common/Loading";

function ProtectedRoute({ children, allowedRoles }) {
    const { loading, isAuthenticated, user } = useAuth();

    // Menunggu proses pengecekan login
    if (loading) {
        return (
            <Loading
                fullScreen={true}
                text="Memverifikasi sesi..."
            />
        );
    }

    // Belum login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    // Sudah login
    return children;
}

export default ProtectedRoute;