import api from "../api/axios";

const adminFinalAssessmentService = {
    getAll: async () => (await api.get("/admin/penilaian-akhir")).data,
};

export default adminFinalAssessmentService;