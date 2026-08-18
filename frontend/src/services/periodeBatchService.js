// =============================================
// File : src/services/periodeBatchService.js
// =============================================

import api from "../api/axios";

const periodeBatchService = {
    getAll: async (params) => {
        const response = await api.get("/admin/periode-batch", { params });
        return response.data;
    },
    getDetail: async (id) => {
        const response = await api.get(`/admin/periode-batch/${id}`);
        return response.data;
    },
    create: async (payload) => {
        const response = await api.post("/admin/periode-batch", payload);
        return response.data;
    },
    update: async (id, payload) => {
        const response = await api.put(`/admin/periode-batch/${id}`, payload);
        return response.data;
    },
    addMahasiswa: async (id, payload) => {
        const response = await api.post(`/admin/periode-batch/${id}/mahasiswa`, payload);
        return response.data;
    },
    removeMahasiswa: async (id, periodeId) => {
        const response = await api.delete(`/admin/periode-batch/${id}/mahasiswa/${periodeId}`);
        return response.data;
    },
};

export default periodeBatchService;
