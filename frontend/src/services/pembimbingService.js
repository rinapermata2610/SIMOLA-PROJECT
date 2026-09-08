import api from "../api/axios";

const pembimbingService = {
    getDashboard: async () => (await api.get("/pembimbing/dashboard")).data,
    getActivities: async (params = {}) => (await api.get("/pembimbing/log-aktivitas", { params })).data,
    verifyActivity: async (id, status, komentar = "") => (await api.put(`/pembimbing/log-aktivitas/${id}/verify`, { status, komentar })).data,
};

export default pembimbingService;
