// =============================================
// File : src/components/layout/Navbar.jsx
// =============================================

import { useAuth } from "../context/AuthContext";

function Navbar({ children }) {
    const { user } = useAuth();

    const currentDate = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <header
            className="
                bg-white
                shadow-sm
                border-b
                px-6
                py-4
                flex
                justify-between
                items-center
            "
        >
            {/* Left */}

            <div className="flex items-center gap-4">

                {children}

                <div>

                    <h2 className="text-xl font-bold text-gray-800">
                        Sistem Monitoring Logbook
                    </h2>

                    <p className="text-sm text-gray-500">
                        {currentDate}
                    </p>

                </div>

            </div>

            {/* Right */}

            <div className="text-right">

                <p className="font-semibold text-gray-800">
                    {user?.nama}
                </p>

                <p className="text-sm text-gray-500">
                    {user?.role}
                </p>

            </div>

        </header>
    );
}

export default Navbar;