// =============================================
// File : src/services/authService.js
// =============================================

import api from "../api/axios";

const authService = {

    /**
     * Login
     */
    async login(credentials) {
        const response = await api.post("/auth/login", credentials);

        return response.data;
    },

    /**
     * Logout
     */
    async logout() {
        const response = await api.post("/auth/logout");

        return response.data;
    },

    /**
     * Get User Login
     */
    async me() {
        const response = await api.get("/auth/me");

        return response.data;
    },

};

export default authService;