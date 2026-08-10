// =============================================
// File : src/services/adminDashboardService.js
// =============================================

import api from "../api/axios";

const adminDashboardService = {
    getOverview: async () => {
        const response = await api.get("/admin/dashboard");
        return response.data;
    },
};

export default adminDashboardService;
