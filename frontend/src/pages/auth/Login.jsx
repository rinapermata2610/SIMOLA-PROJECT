// =============================================
// File : src/pages/auth/Login.jsx
// =============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

import LoginCard from "../../components/auth/LoginCard";

import Wave from "../../assets/images/wave.svg";

function Login() {
    const navigate = useNavigate();

    const { saveLogin } = useAuth();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username.trim() || !form.password.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Data belum lengkap",
                text: "Silakan isi username dan password.",
            });
            return;
        }

        try {
            setLoading(true);

            const response = await authService.login(form);

            console.log("Login Response :", response);

            // Simpan ke AuthContext + LocalStorage
            saveLogin(response);

            await Swal.fire({
                icon: "success",
                title: "Login Berhasil",
                text: `Selamat datang, ${response.user.nama}`,
                timer: 1200,
                showConfirmButton: false,
            });

            navigate("/dashboard", { replace: true });

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Login Gagal",
                text:
                    error.response?.data?.message ??
                    "Username atau password salah.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-100">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100" />

            {/* Wave */}
            <img
                src={Wave}
                alt="Background Wave"
                className="absolute bottom-0 left-0 w-full"
            />

            {/* Login Card */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-5">

                <LoginCard
                    form={form}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    loading={loading}
                />

            </div>

        </div>
    );
}

export default Login;