// =============================================
// File : src/context/AuthContext.jsx
// =============================================

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(() => {
        const data = localStorage.getItem("user");

        return data ? JSON.parse(data) : null;
    });

    const [loading, setLoading] = useState(true);

    /**
     * Ambil data user yang sedang login
     */
    const loadUser = async () => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await authService.me();

            // Sesuaikan dengan response backend
            const currentUser =
                response.user ??
                response.data ??
                response;

            setUser(currentUser);

            localStorage.setItem(
                "user",
                JSON.stringify(currentUser)
            );
        } catch (error) {
            console.error(error);

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Dipanggil setelah login berhasil
     */
    const saveLogin = (response) => {
        localStorage.setItem("token", response.token);

        localStorage.setItem(
            "user",
            JSON.stringify(response.user)
        );

        setToken(response.token);
        setUser(response.user);
    };

    /**
     * Logout
     */
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error(error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        loadUser();
    }, [token]);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                loading,

                isAuthenticated: !!token,

                saveLogin,
                logout,
                loadUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;