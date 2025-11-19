export default function VerifySuccess() {
    return (
        <main className="max-w-md mx-auto p-6 text-center">
            <h1 className="text-2xl mb-4">Email Verified Successfully!</h1>
            <p className="mb-6">Your email has been verified. You can now log in to your account.</p>
            <a
                href="/login"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
                Log In
            </a>
        </main>
    );
}