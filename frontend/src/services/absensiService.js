import api from "../api/axios";

const absensiService = {
    getToday: async () => {
        const response = await api.get("/mahasiswa/absensi");
        return response.data;
    },

    clock: async (type, coordinates) => {
        const response = await api.post(`/mahasiswa/absensi/${type}`, coordinates);
        return response.data;
    },
};

export default absensiService;
