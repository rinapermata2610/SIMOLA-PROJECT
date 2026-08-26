function LoginButton({ loading }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="
                w-full
                bg-gradient-to-r
                from-sky-600
                to-cyan-500
                text-white
                py-3
                rounded-xl
                font-bold
                shadow-lg
                shadow-sky-500/25
                transition
                disabled:opacity-60
            "
        >
            {loading ? "Memproses..." : "Masuk"}
        </button>
    );
}

export default LoginButton;