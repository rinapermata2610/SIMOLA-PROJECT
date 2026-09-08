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
            try {
                const response = await api.get("/mahasiswa/dashboard");
                const data = response.data?.data;

                setCalendarData({
                    periode: data?.periode_magang ?? null,
                    activities: data?.aktivitas_kalender ?? [],
                });
            } catch (error) {
                console.error("Gagal memuat status kalender:", error);
            }
        };

        loadCalendarData();
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