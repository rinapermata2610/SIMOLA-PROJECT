// =============================================
// File : src/services/formAktivitasService.js
// =============================================

import api from "../api/axios";

const BASE_URL = "/mahasiswa/form-aktivitas";

const formAktivitasService = {
    /**
     * Mengecek apakah pada tanggal tertentu
     * sudah terdapat aktivitas.
     */
    async check(tanggal) {
        const response = await api.get(`${BASE_URL}/check`, {
            params: { tanggal },
        });

        return response.data;
    },

    /**
     * Menyimpan aktivitas baru.
     */
    async store(data) {
        const response = await api.post(
            BASE_URL,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    /**
     * Mengambil detail aktivitas.
     */
    async show(id) {
        const response = await api.get(
            `${BASE_URL}/${id}`
        );

        return response.data;
    },

    /**
     * Mengubah aktivitas.
     */
    async update(id, data) {
        data.append("_method", "PUT");

        const response = await api.post(
            `${BASE_URL}/${id}`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    /**
     * Menghapus aktivitas.
     */
    async destroy(id) {
        const response = await api.delete(
            `${BASE_URL}/${id}`
        );

        return response.data;
    },
};

export default formAktivitasService;