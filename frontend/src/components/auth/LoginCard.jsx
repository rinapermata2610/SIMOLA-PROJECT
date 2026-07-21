import InputField from "./InputField";
import PasswordField from "./PasswordField";
import LoginButton from "./LoginButton";
import Footer from "./Footer";

import Logo from "../../assets/images/logo-kemendikdasmen.png";

function LoginCard({
    form,
    handleChange,
    handleSubmit,
    loading,
}) {
    return (
        <div
            className="
                w-full
                max-w-md
                bg-white
                rounded-2xl
                shadow-2xl
                px-8
                py-10
            "
        >
            {/* Header */}
            <div className="text-center mb-8">
                <img
                    src={Logo}
                    alt="Logo Kemendikdasmen"
                    className="w-20 h-20 object-contain mx-auto mb-4"
                />

                <h1 className="text-4xl font-bold text-sky-600">
                    SIMOLA
                </h1>

                <p className="text-gray-600 mt-2 text-sm">
                    Sistem Monitoring dan Laporan Magang
                </p>

                <div
                    className="
                        inline-block
                        mt-5
                        bg-sky-100
                        text-sky-700
                        px-5
                        py-2
                        rounded-full
                        text-xs
                        font-semibold
                        tracking-wide
                    "
                >
                    LOGIN MAHASISWA
                </div>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <InputField
                    label="Username"
                    name="username"
                    placeholder="Masukkan username"
                    value={form.username}
                    onChange={handleChange}
                />

                <PasswordField
                    label="Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />

                <div className="pt-2">
                    <LoginButton loading={loading} />
                </div>
            </form>

            {/* Footer */}
            <div className="mt-8">
                <Footer />
            </div>
        </div>
    );
}

export default LoginCard;