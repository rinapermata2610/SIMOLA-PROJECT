// =============================================
// File : src/components/layout/Navbar.jsx
// =============================================

import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";

function Navbar({ onMenuClick }) {

    const today = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <header
            className="
                sticky
                top-0
                z-30
                bg-white
                border-b
                border-gray-200
                shadow-sm
            "
        >
            <div
                className="
                    h-20
                    px-6
                    flex
                    items-center
                    justify-between
                "
            >
                {/* Left */}
                <div className="flex items-center gap-4">

                    {/* Mobile Button */}
                    <button
                        onClick={onMenuClick}
                        className="
                            lg:hidden
                            p-2
                            rounded-lg
                            hover:bg-gray-100
                        "
                    >
                        <FaBars size={20} />
                    </button>

                    <div>

                        <h1 className="text-2xl font-bold text-gray-800">
                            Dashboard
                        </h1>

                        <p className="text-sm text-gray-500">
                            {today}
                        </p>

                    </div>

                </div>

                {/* Right */}
                <div className="flex items-center gap-5">

                    {/* Notification */}
                    <button
                        className="
                            relative
                            w-11
                            h-11
                            rounded-full
                            bg-gray-100
                            hover:bg-gray-200
                            flex
                            items-center
                            justify-center
                            transition
                        "
                    >
                        <FaBell className="text-gray-600" />

                        <span
                            className="
                                absolute
                                top-2
                                right-2
                                w-2.5
                                h-2.5
                                rounded-full
                                bg-red-500
                            "
                        />
                    </button>

                    {/* User */}
                    <div className="flex items-center gap-3">

                        <FaUserCircle
                            size={42}
                            className="text-sky-600"
                        />

                        <div className="hidden md:block">

                            <p className="font-semibold text-gray-800">
                                Ahmad Fauzi
                            </p>

                            <p className="text-sm text-gray-500">
                                Mahasiswa
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </header>
    );
}

export default Navbar;