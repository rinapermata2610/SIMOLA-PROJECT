// =============================================
// File : src/routes/AppRoutes.jsx
// =============================================

import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/mahasiswa/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import ManajemenAkun from "../pages/admin/ManajemenAkun";
import AdminLayout from "../layout/admin/AdminLayout";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>

            {/* Login */}
            <Route
                path="/login"
                element={<Login />}
            />

            {/* Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminLayout>
                            <AdminDashboard />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/akun"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminLayout>
                            <ManajemenAkun />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            {/* Redirect Root */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* 404 */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}

export default AppRoutes;