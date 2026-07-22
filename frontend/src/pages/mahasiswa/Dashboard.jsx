// =============================================
// File : src/pages/mahasiswa/Dashboard.jsx
// =============================================

import MainLayout from "../../layout/MainLayout";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import SummaryCards from "../../components/dashboard/SummaryCards";
import CalendarCard from "../../components/dashboard/CalendarCard";

function Dashboard() {
    return (
        <MainLayout>
            <div className="space-y-6">

                {/* Header */}
                <DashboardHeader />

                {/* Summary Card */}
                <SummaryCards />

                {/* Kalender */}
                <CalendarCard />

            </div>
        </MainLayout>
    );
}

export default Dashboard;