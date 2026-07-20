import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(username, password);

      if (rememberMe) {
        localStorage.setItem("simola_remember", "1");
      }

      if (user.role === "pembimbing") {
        navigate("/pembimbing/dashboard");
      } else {
        navigate("/mahasiswa/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Username atau password salah.");
      } else if (err.response && err.response.status === 422) {
        setError("Mohon lengkapi username dan password.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
            <circle cx="32" cy="32" r="32" fill="#0089D0" />
            <path
              d="M32 14c-6 4-10 5-14 5 0 12 4 20 14 27 10-7 14-15 14-27-4 0-8-1-14-5z"
              fill="#fff"
              opacity="0.95"
            />
            <circle cx="32" cy="30" r="6" fill="#F5A623" />
          </svg>
        </div>

        <h1 className="login-title">SIMOLA</h1>
        <p className="login-subtitle">Sistem Monitoring dan Laporan Magang</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4 10 7-.4 1.2-1.2 2.6-2.3 3.9M6.6 6.6C4.4 8 2.9 10 2 12c1 3 5 7 10 7 1.5 0 2.9-.3 4.2-.9"
                      stroke="#6B7280"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
                      stroke="#6B7280"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="1.6" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-row">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Ingat saya</span>
            </label>
            <a href="#" className="forgot-link">
              Lupa password?
            </a>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>

      <footer className="login-footer">
        © 2026 Kementerian Pendidikan Dasar dan Menengah. Hak Cipta Dilindungi Undang-Undang.
      </footer>
    </div>
  );
}
