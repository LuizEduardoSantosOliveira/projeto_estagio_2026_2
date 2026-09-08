import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-clinical-50">
            <div className="border-b border-clinical-800 bg-clinical-800 py-6">
                <div className="mx-auto max-w-md px-4 sm:px-0">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-lg font-bold text-clinical-800">
                            +
                        </div>
                        <span className="text-lg font-semibold text-white">
                            Agendador de Consultas
                        </span>
                    </Link>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center px-6 py-10">
                <div className="w-full max-w-md border border-gray-200 bg-white px-6 py-8 shadow-sm sm:rounded-md">
                    {children}
                </div>
            </div>
        </div>
    );
}