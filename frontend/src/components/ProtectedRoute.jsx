// =============================================
// File : src/components/ProtectedRoute.jsx
// =============================================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./common/Loading";

function ProtectedRoute({ children }) {
    const { loading, isAuthenticated } = useAuth();

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

    // Sudah login
    return children;
}

export default ProtectedRoute;