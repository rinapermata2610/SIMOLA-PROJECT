// =============================================
// File : src/pages/mahasiswa/LogAktivitas.jsx
// =============================================

import MainLayout from "../../layout/MainLayout";

import useLogAktivitas from "../../hooks/useLogAktivitas";

import LogFilter from "../../components/logAktivitas/LogFilter";
import LogTable from "../../components/logAktivitas/LogTable";

function LogAktivitas() {
    const {
        loading,
        logs,
        filters,
        handleSearch,
        handleFilterChange,
        handleDelete,
    } = useLogAktivitas();

    return (
        <MainLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl font-bold text-slate-800">
                            Log Aktivitas
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Riwayat aktivitas magang yang telah
                            dibuat.
                        </p>

                    </div>

                </div>

                {/* Filter */}
                <LogFilter
                    filters={filters}
                    onChange={handleFilterChange}
                    onSearch={handleSearch}
                />

                {/* Table */}
                <LogTable
                    loading={loading}
                    activities={logs}
                    onView={(id) =>
                        console.log("Detail :", id)
                    }
                    onEdit={(id) =>
                        console.log("Edit :", id)
                    }
                    onDelete={handleDelete}
                />

            </div>
        </MainLayout>
    );
}

export default LogAktivitas;