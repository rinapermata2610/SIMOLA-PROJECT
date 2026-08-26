import api from "../api/axios";

const profileService = {
	async get() {
		const response = await api.get("/mahasiswa/profile");
		return response.data;
	},
};

export default profileService;
