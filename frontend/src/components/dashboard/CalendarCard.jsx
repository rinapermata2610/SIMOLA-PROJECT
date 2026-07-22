// =============================================
// File : src/components/dashboard/CalendarCard.jsx
// =============================================

import { useState } from "react";
import { FaPlus } from "react-icons/fa";

import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import CalendarLegend from "./CalendarLegend";

function CalendarCard() {

    // =============================================
    // Kalender Dinamis
    // Default: Juli 2026
    // Nantinya bisa diganti menjadi new Date()
    // =============================================
    const [currentDate, setCurrentDate] = useState(
        new Date(2026, 6, 1)
    );

    const [selectedDate, setSelectedDate] = useState(null);

    // =============================================
    // Bulan Sebelumnya
    // =============================================
    const handlePreviousMonth = () => {
        setCurrentDate((prev) =>
            new Date(
                prev.getFullYear(),
                prev.getMonth() - 1,
                1
            )
        );
    };

    // =============================================
    // Bulan Selanjutnya
    // =============================================
    const handleNextMonth = () => {
        setCurrentDate((prev) =>
            new Date(
                prev.getFullYear(),
                prev.getMonth() + 1,
                1
            )
        );
    };

    // =============================================
    // Kembali ke Hari Ini
    // =============================================
    const handleToday = () => {
        setCurrentDate(new Date());
    };

    // =============================================
    // Klik Tanggal
    // =============================================
    const handleDateClick = (date) => {

        setSelectedDate(date);

        // Nanti akan membuka ActivityModal
        console.log("Tanggal dipilih :", date);

    };

    // =============================================
    // Tombol Isi Aktivitas Hari Ini
    // =============================================
    const handleAddActivity = () => {

        const today = new Date();

        setSelectedDate(today);

        console.log("Tambah aktivitas :", today);

    };

    return (
        <div
            className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-gray-200
                p-6
            "
        >

            {/* ================= HEADER ================= */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Kalender Aktivitas Magang
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Klik salah satu tanggal untuk mengisi
                        atau memperbarui aktivitas magang.
                    </p>

                </div>

                <button
                    onClick={handleAddActivity}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-sky-600
                        hover:bg-sky-700
                        text-white
                        font-medium
                        px-5
                        py-3
                        rounded-xl
                        transition
                    "
                >
                    <FaPlus />

                    Isi Aktivitas Hari Ini

                </button>

            </div>

            {/* ================= HEADER BULAN ================= */}

            <div className="mt-8">

                <CalendarHeader
                    currentDate={currentDate}
                    onPrevious={handlePreviousMonth}
                    onNext={handleNextMonth}
                    onToday={handleToday}
                />

            </div>

            {/* ================= GRID ================= */}

            <div className="mt-6">

                <CalendarGrid
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    onDateClick={handleDateClick}
                />

            </div>

            {/* ================= LEGEND ================= */}

            <div className="mt-8">

                <CalendarLegend />

            </div>

        </div>
    );
}

export default CalendarCard;