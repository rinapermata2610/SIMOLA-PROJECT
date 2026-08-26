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
                rounded-3xl
                border
                border-white/70
                bg-white/95
                shadow-2xl
                px-6
                py-8
                backdrop-blur-sm
                sm:px-9
                sm:py-10
            "
        >
            {/* Header */}
            <div className="mb-8 text-center">
                <img
                    src={Logo}
                    alt="Logo Kemendikdasmen"
                    className="mx-auto mb-4 h-20 w-20 object-contain drop-shadow-sm"
                />

                <h1 className="text-4xl font-extrabold tracking-tight text-sky-600">
                    SIMOLA
                </h1>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                    Sistem Monitoring &amp; Layanan Magang
                </p>
                <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" />
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