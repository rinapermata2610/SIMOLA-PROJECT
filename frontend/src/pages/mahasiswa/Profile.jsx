import { useEffect, useState } from "react";
import { FaCalendarAlt, FaEnvelope, FaGraduationCap, FaIdCard, FaUserTie } from "react-icons/fa";
import MainLayout from "../../layout/MainLayout";
import profileService from "../../services/profileService";

const InfoItem = ({ icon, label, value }) => (
	<div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4">
		<div className="mt-1 text-sky-600">{icon}</div>
		<div className="min-w-0">
			<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
			<p className="mt-1 break-words font-semibold text-slate-800">{value || "-"}</p>
		</div>
	</div>
);

function Profile() {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const loadProfile = async () => {
			try {
				const response = await profileService.get();
				if (!response?.success || !response.data) {
					throw new Error(response?.message || "Profil gagal dimuat.");
				}
				setProfile(response.data);
			} catch (error) {
				setErrorMessage(error.response?.data?.message || error.message || "Profil gagal dimuat.");
			} finally {
				setLoading(false);
			}
		};

		loadProfile();
	}, []);

	if (loading) {
		return <MainLayout><div className="rounded-2xl bg-white p-10 text-center text-slate-500">Memuat profil...</div></MainLayout>;
	}

	if (!profile) {
		return <MainLayout><div className="rounded-2xl bg-white p-10 text-center text-red-600">{errorMessage || "Profil tidak ditemukan."}</div></MainLayout>;
	}

	const periode = profile.periode_magang;
	const pembimbing = profile.pembimbing;

	return (
		<MainLayout>
			<div className="mx-auto max-w-5xl space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-slate-800">Profil Mahasiswa</h1>
					<p className="mt-1 text-slate-500">Informasi pribadi dan periode magang Anda.</p>
				</div>

				<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
					<div className="flex flex-col gap-4 bg-gradient-to-r from-sky-600 to-cyan-500 p-6 text-white sm:flex-row sm:items-center">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold">
							{(profile.nama || "M").charAt(0).toUpperCase()}
						</div>
						<div>
							<h2 className="text-2xl font-bold">{profile.nama}</h2>
							<p className="mt-1 text-sm text-sky-100">{profile.email}</p>
						</div>
						<span className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold uppercase sm:ml-auto">{profile.role}</span>
					</div>

					<div className="grid gap-4 p-6 md:grid-cols-2">
						<InfoItem icon={<FaIdCard />} label="NIM" value={profile.nim} />
						<InfoItem icon={<FaEnvelope />} label="Email" value={profile.email} />
						<InfoItem icon={<FaGraduationCap />} label="Asal Universitas" value={periode?.instansi} />
						<InfoItem icon={<FaCalendarAlt />} label="Periode Magang" value={periode ? `${periode.tanggal_mulai} sampai ${periode.tanggal_selesai}` : null} />
						<InfoItem icon={<FaUserTie />} label="Nama Pembimbing" value={pembimbing?.nama} />
						<InfoItem icon={<FaUserTie />} label="Role" value={profile.role} />
					</div>
				</section>
			</div>
		</MainLayout>
	);
}

export default Profile;
