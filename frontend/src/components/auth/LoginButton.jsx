function LoginButton({ loading }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="
                w-full
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-3
                rounded-lg
                font-semibold
                transition
                disabled:opacity-60
            "
        >
            {loading ? "Memproses..." : "Masuk"}
        </button>
    );
}

export default LoginButton;