// =============================================
// File : src/services/formAktivitasService.js
// =============================================

import api from "../api/axios";

const BASE_URL = "/mahasiswa/form-aktivitas";

const formAktivitasService = {
    /**
     * Cek apakah sudah ada aktivitas pada tanggal tertentu
     */
    async check(tanggal) {
        const { data } = await api.get(`${BASE_URL}/check`, {
            params: { tanggal },
        });

        return data;
    },

    /**
     * Simpan aktivitas baru
     */
    async store(formData) {
        const { data } = await api.post(
            BASE_URL,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;
    },

    /**
     * Detail aktivitas
     */
    async show(id) {
        const { data } = await api.get(`${BASE_URL}/${id}`);

        return data;
    },

    /**
     * Update aktivitas
     */
    async update(id, formData) {
        formData.append("_method", "PUT");

        const { data } = await api.post(
            `${BASE_URL}/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;
    },

    /**
     * Simpan sebagai draft
     */
    async saveDraft(formData) {
        formData.append("status", "draft");

        const { data } = await api.post(
            BASE_URL,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;
    },

    /**
     * Submit aktivitas
     */
    async submit(id) {
        const { data } = await api.patch(
            `${BASE_URL}/${id}/submit`
        );

        return data;
    },

    /**
     * Hapus aktivitas
     */
    async destroy(id) {
        const { data } = await api.delete(
            `${BASE_URL}/${id}`
        );

        return data;
    },

    /**
     * Ambil seluruh aktivitas milik mahasiswa
     */
    async getAll(params = {}) {
        const { data } = await api.get(BASE_URL, {
            params,
        });

        return data;
    },

    /**
     * Ambil aktivitas berdasarkan tanggal
     */
    async getByDate(tanggal) {
        const { data } = await api.get(BASE_URL, {
            params: { tanggal },
        });

        return data;
    },
};

export default formAktivitasService;