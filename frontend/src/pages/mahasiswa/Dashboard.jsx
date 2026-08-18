import { useState } from "react";

import MainLayout from "../../layout/MainLayout";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import SummaryCards from "../../components/dashboard/SummaryCards";
import CalendarCard from "../../components/dashboard/CalendarCard";
import ActivityModal from "../../components/dashboard/ActivityModal";

import useFormAktivitas from "../../hooks/useFormAktivitas";

function Dashboard() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);

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

    const handleSubmit = (statusType = "submitted") => {
        const dateStr = selectedDate 
            ? selectedDate.toISOString().split("T")[0] 
            : null;
        
        submitForm(statusType, dateStr);
    };

    return (
        <MainLayout>
            <div className="space-y-6">

                {/* Header */}
                <DashboardHeader />

                {/* Summary */}
                <SummaryCards />

                {/* Kalender */}
                <CalendarCard
                    selectedDate={selectedDate}
                    onDateClick={handleDateClick}
                    onAddToday={handleAddToday}
                />

                {/* Modal Form Aktivitas */}
                <ActivityModal
                    open={showModal}
                    selectedDate={selectedDate}
                    form={form}
                    loading={loading}
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