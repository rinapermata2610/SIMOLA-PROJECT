// =============================================
// File : src/routes/AppRoutes.jsx
// =============================================

import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "../pages/auth/Login";

import Dashboard from "../pages/mahasiswa/Dashboard";
import LogAktivitas from "../pages/mahasiswa/LogAktivitas";
import DetailLog from "../pages/mahasiswa/DetailLog";
import EditLog from "../pages/mahasiswa/EditLog";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>

            {/* ============================
                AUTH
            ============================ */}

            <Route
                path="/login"
                element={<Login />}
            />

            {/* ============================
                MAHASISWA
            ============================ */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/log-aktivitas"
                element={
                    <ProtectedRoute>
                        <LogAktivitas />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/log-aktivitas/:id"
                element={
                    <ProtectedRoute>
                        <DetailLog />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/log-aktivitas/:id/edit"
                element={
                    <ProtectedRoute>
                        <EditLog />
                    </ProtectedRoute>
                }
            />

            {/* ============================
                REDIRECT
            ============================ */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            {/* ============================
                404
            ============================ */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default AppRoutes;