import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/mahasiswa/dashboard"
            element={
              <ProtectedRoute role="mahasiswa">
                <div style={{ padding: 24 }}>
                  <h1>Dashboard Mahasiswa</h1>
                  <p>Halaman ini akan diisi kalender aktivitas magang.</p>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/pembimbing/dashboard"
            element={
              <ProtectedRoute role="pembimbing">
                <div style={{ padding: 24 }}>
                  <h1>Dashboard Monitoring</h1>
                  <p>Halaman ini akan diisi daftar mahasiswa bimbingan.</p>
                </div>
              </ProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<p>Anda tidak memiliki akses ke halaman ini.</p>} />
          <Route path="*" element={<p>404 — Halaman tidak ditemukan.</p>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;