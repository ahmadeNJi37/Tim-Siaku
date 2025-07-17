import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import Banner from '@/Components/Banner';
import HeaderStudentLayout from './Partials/HeaderStudentLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Toaster } from 'sonner';

export default function StudentLayout({ children, title }) {
    const { auth, checkFee = true, flash = {} } = usePage().props;
    const { url } = usePage();

    // Data aman dengan fallback
    const student = auth?.student ?? {};
    const classroom = student?.classroom ?? null;
    const studentNumber = student?.student_number ?? 'Nomor tidak tersedia';

    // Flash message aman
    useEffect(() => {
        if (flash?.message && flash?.type) {
            const validTypes = ['success', 'error', 'info', 'warning'];
            const type = validTypes.includes(flash.type) ? flash.type : 'info';
            toast[type](flash.message);
        }
    }, [flash]);

    return (
        <>
            <Head title={title} />
            <Toaster position="top-center" richColors />
            <div className="min-h-full bg-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 pb-32">
                    <HeaderStudentLayout auth={auth} url={url} />
                </div>

                {/* Konten Utama */}
                <main className="-mt-32 px-6 pb-12 lg:px-28">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="text-sm text-gray-500">
                                NIM: <strong>{studentNumber}</strong> | Kelas:{' '}
                                <strong>{classroom?.name ?? 'Belum ditentukan'}</strong>
                            </div>
                            {children}
                        </CardContent>
                    </Card>

                    {/* Banner pembayaran */}
                    {!checkFee && (
                        <Banner message="⚠️ Harap melakukan pembayaran Uang Kuliah Tunggal terlebih dahulu." />
                    )}
                </main>
            </div>
        </>
    );
}
