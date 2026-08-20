// =============================================
// File : src/services/akunService.js
// =============================================

import api from "../api/axios";

const akunService = {
    getAll: async (params) => {
        const response = await api.get("/admin/akun", { params });
        return response.data;
    },
    create: async (payload) => {
        const response = await api.post("/admin/akun", payload);
        return response.data;
    },
    update: async (id, payload) => {
        const response = await api.put(`/admin/akun/${id}`, payload);
        return response.data;
    },
    activate: async (id) => {
        const response = await api.put(`/admin/akun/${id}/activate`);
        return response.data;
    },
    deactivate: async (id) => {
        const response = await api.put(`/admin/akun/${id}/deactivate`);
        return response.data;
    },
    resetPassword: async (id) => {
        const response = await api.post(`/admin/akun/${id}/reset-password`);
        return response.data;
    },
    destroy: async (id) => {
        const response = await api.delete(`/admin/akun/${id}`);
        return response.data;
    },
};

export default akunService;
