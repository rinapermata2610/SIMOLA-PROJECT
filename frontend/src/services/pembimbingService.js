import api from "../api/axios";

const pembimbingService = {
    getDashboard: async () => (await api.get("/pembimbing/dashboard")).data,
    getActivities: async (params = {}) => (await api.get("/pembimbing/log-aktivitas", { params })).data,
    getAttendance: async (mahasiswaId, bulan) => (await api.get(`/pembimbing/kehadiran/${mahasiswaId}`, { params: { bulan } })).data,
    getFinalAssessment: async (mahasiswaId) => (await api.get(`/pembimbing/penilaian-akhir/${mahasiswaId}`)).data,
    saveFinalAssessment: async (mahasiswaId, scores) => (await api.put(`/pembimbing/penilaian-akhir/${mahasiswaId}`, { scores })).data,
    verifyActivity: async (id, status, komentar = "") => (await api.put(`/pembimbing/log-aktivitas/${id}/verify`, { status, komentar })).data,
    viewAttachment: async (id) => api.get(`/pembimbing/log-aktivitas/lampiran/${id}/view`, { responseType: "blob" }),
};

export default pembimbingService;
