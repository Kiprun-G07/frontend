

export default function AccountSuccess() {
    return (
        <main className="max-w-md mx-auto p-6 text-center">
            <h1 className="text-2xl mb-4">Account Created Successfully!</h1>
            <p className="mb-6">Your account has been created. Please click on the link in the verification email sent to you.</p>
            <a
                href="/login"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
                Log In
            </a>
        </main>
    );
}