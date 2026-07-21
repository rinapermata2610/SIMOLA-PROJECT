// =============================================
// File : src/pages/auth/Login.jsx
// =============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import LoginCard from "../../components/auth/LoginCard";
import authService from "../../services/authService";

import Wave from "../../assets/images/wave.svg";

function Login() {
    const navigate = useNavigate();

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

        if (!form.username || !form.password) {
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

            localStorage.setItem("token", response.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );

            Swal.fire({
                icon: "success",
                title: "Login Berhasil",
                text: `Selamat datang ${response.user.nama}`,
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/dashboard");
        } catch (error) {
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
        <div className="relative min-h-screen bg-slate-100 overflow-hidden">

            {/* Background */}

            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100" />

            {/* Wave */}

            <img
                src={Wave}
                alt="Wave"
                className="absolute bottom-0 left-0 w-full"
            />

            {/* Login Card */}

            <div className="relative z-10 flex items-center justify-center min-h-screen px-5">

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