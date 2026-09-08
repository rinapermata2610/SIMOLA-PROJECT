import { useEffect, useState } from "react";

import MainLayout from "../../layout/MainLayout";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import SummaryCards from "../../components/dashboard/SummaryCards";
import AttendanceCard from "../../components/dashboard/AttendanceCard";
import CalendarCard from "../../components/dashboard/CalendarCard";
import ActivityModal from "../../components/dashboard/ActivityModal";

import useFormAktivitas from "../../hooks/useFormAktivitas";
import api from "../../services/api";

const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

function Dashboard() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [calendarData, setCalendarData] = useState({
        periode: null,
        activities: [],
    });

    useEffect(() => {
        const loadCalendarData = async () => {
            const [dashboardResult, activityResult] = await Promise.allSettled([
                api.get("/mahasiswa/dashboard"),
                api.get("/mahasiswa/log-aktivitas", {
                    params: { per_page: 1000 },
                }),
            ]);

            const dashboardData = dashboardResult.status === "fulfilled"
                ? dashboardResult.value.data?.data
                : null;
            const activityData = activityResult.status === "fulfilled"
                ? activityResult.value.data?.data
                : null;

            if (!dashboardData && !activityData) {
                console.error("Gagal memuat data kalender mahasiswa.");
                return;
            }

            setCalendarData({
                periode: dashboardData?.periode_magang ?? null,
                activities: Array.isArray(activityData)
                    ? activityData
                    : dashboardData?.aktivitas_kalender ?? [],
            });
        };

        loadCalendarData().catch((error) => {
                console.error("Gagal memuat status kalender:", error);
        });

    }, []);

    const {
        form,
        loading,
        errorMessage,
        handleChange,
        handleFileChange,
        removeFile,
        submitForm,
        resetForm,
    } = useFormAktivitas();

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowModal(true);
    };

    const handleAddToday = () => {
        const today = getLocalDateString(new Date());
        const alreadyFilled = calendarData.activities.some(
            (activity) => String(activity?.tanggal).slice(0, 10) === today
        );

        if (alreadyFilled) {
            return;
        }

        setSelectedDate(new Date());
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDate(null);
        resetForm();
    };

    const handleSubmit = async (statusType = "submitted") => {
        const dateStr = selectedDate ? getLocalDateString(selectedDate) : null;
        
        const saved = await submitForm(statusType, dateStr);
        if (saved) {
            setCalendarData((previous) => {
                const alreadyExists = previous.activities.some(
                    (activity) => activity?.tanggal === dateStr
                );

                return alreadyExists
                    ? previous
                    : {
                        ...previous,
                        activities: [
                            ...previous.activities,
                            { tanggal: dateStr, status: statusType },
                        ],
                    };
            });
            setShowModal(false);
            setSelectedDate(null);
        }
    };

    return (
        <MainLayout>
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header */}
                <DashboardHeader />

                {/* Summary */}
                <SummaryCards />

                <AttendanceCard />

                {/* Kalender */}
                <CalendarCard
                    selectedDate={selectedDate}
                    onDateClick={handleDateClick}
                    onAddToday={handleAddToday}
                    periode={calendarData.periode}
                    activities={calendarData.activities}
                />

                {/* Modal Form Aktivitas */}
                <ActivityModal
                    open={showModal}
                    selectedDate={selectedDate}
                    form={form}
                    loading={loading}
                    errorMessage={errorMessage}
                    onChange={handleChange}
                    onFileChange={handleFileChange}
                    onRemoveFile={removeFile}
                    onSubmit={handleSubmit}
                    onClose={handleCloseModal}
                />

            </div>
        </MainLayout>
    );
}

export default Dashboard;