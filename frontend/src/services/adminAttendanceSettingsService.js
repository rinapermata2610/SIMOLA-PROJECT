import api from "../api/axios";

const adminAttendanceSettingsService = {
    get: async () => (await api.get("/admin/pengaturan-absensi")).data,
    update: async (wfhDays) => (await api.put("/admin/pengaturan-absensi", { wfh_days: wfhDays })).data,
};

export default adminAttendanceSettingsService;