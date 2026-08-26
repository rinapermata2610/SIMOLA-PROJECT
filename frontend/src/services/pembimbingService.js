import api from "../api/axios";

const pembimbingService = {
    getDashboard: async () => (await api.get("/pembimbing/dashboard")).data,
    getActivities: async () => (await api.get("/pembimbing/log-aktivitas")).data,
};

export default pembimbingService;
