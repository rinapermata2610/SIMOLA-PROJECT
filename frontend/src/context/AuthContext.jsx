// =============================================
// File : src/context/AuthContext.jsx
// =============================================

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    /**
     * Mengecek user yang sedang login
     */
    const loadUser = async () => {
        try {
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await authService.me();

            setUser(response.data);
        } catch (error) {
            console.error(error);

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setUser(null);
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Login
     */
    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);

            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            setToken(response.token);
            setUser(response.user);

            Swal.fire({
                icon: "success",
                title: "Login Berhasil",
                text: `Selamat datang, ${response.user.nama}`,
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/dashboard");

            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Logout
     */
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setUser(null);
            setToken(null);

            Swal.fire({
                icon: "success",
                title: "Logout Berhasil",
                timer: 1200,
                showConfirmButton: false,
            });

            navigate("/");
        }
    };

    /**
     * Cek login pertama kali
     */
    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom Hook
 */
export const useAuth = () => useContext(AuthContext);

export default AuthContext;