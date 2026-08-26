// =============================================
// File : src/services/logAktivitasService.js
// =============================================

import api from "../api/axios";

const BASE_URL = "/mahasiswa/log-aktivitas";

const logAktivitasService = {
    /**
     * Mengambil seluruh data log aktivitas
     * dengan filter.
     */
    async getAll(params = {}) {
        const response = await api.get(BASE_URL, {
            params,
        });

        return response.data;
    },

    /**
     * Mengambil detail aktivitas.
     */
    async getById(id) {
        const response = await api.get(
            `${BASE_URL}/${id}`
        );

        return response.data;
    },

    /**
     * Menyimpan aktivitas sebagai Draft.
     */
    async saveDraft(formData) {
        formData.append("status", "draft");

        const response = await api.post(
            BASE_URL,
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    /**
     * Mengirim aktivitas.
     */
    async submit(formData) {
        formData.append("status", "submitted");

        const response = await api.post(
            BASE_URL,
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    /**
     * Mengubah aktivitas.
     */
    async update(id, formData) {
        formData.append("_method", "PUT");

        const response = await api.post(
            `${BASE_URL}/${id}`,
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
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

export default logAktivitasService;