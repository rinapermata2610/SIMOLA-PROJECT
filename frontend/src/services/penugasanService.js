// =============================================
// File : src/services/penugasanService.js
// =============================================

import api from "../api/axios";

const penugasanService = {
    getAll: async () => {
        const response = await api.get("/admin/penugasan");
        return response.data;
    },
    assign: async (payload) => {
        const response = await api.post("/admin/penugasan/assign", payload);
        return response.data;
    },
    reassign: async (payload) => {
        const response = await api.post("/admin/penugasan/reassign", payload);
        return response.data;
    },
};

export default penugasanService;
