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
import Profile from "../pages/mahasiswa/Profile";
import Attendance from "../pages/mahasiswa/Attendance";
import AdminDashboard from "../pages/admin/Dashboard";
import ManajemenAkun from "../pages/admin/ManajemenAkun";
import AdminLayout from "../layout/admin/AdminLayout";
import PembimbingDashboard from "../pages/pembimbing/Dashboard";
import PembimbingModulePage from "../pages/pembimbing/ModulePage";

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
                path="/admin/akun"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminLayout>
                            <ManajemenAkun />
                        </AdminLayout>
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

            <Route
                path="/profil"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/absensi"
                element={
                    <ProtectedRoute>
                        <Attendance />
                    </ProtectedRoute>
                }
            />

            {/* ============================
                ADMIN
            ============================ */}

            <Route path="/pembimbing/dashboard" element={<ProtectedRoute allowedRoles={["pembimbing"]}><PembimbingDashboard /></ProtectedRoute>} />
            <Route path="/pembimbing/kehadiran" element={<ProtectedRoute allowedRoles={["pembimbing"]}><PembimbingModulePage title="Rekapan Kehadiran" description="Lihat rekapan kehadiran mahasiswa bimbingan." /></ProtectedRoute>} />
            <Route path="/pembimbing/penilaian" element={<ProtectedRoute allowedRoles={["pembimbing"]}><PembimbingModulePage title="Penilaian" description="Kelola penilaian mahasiswa bimbingan." /></ProtectedRoute>} />
            <Route path="/pembimbing/laporan" element={<ProtectedRoute allowedRoles={["pembimbing"]}><PembimbingModulePage title="Laporan" description="Akses laporan kegiatan mahasiswa bimbingan." /></ProtectedRoute>} />

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

            {/* ============================
                REDIRECT
            ============================ */}

            {/* Redirect Root */}
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