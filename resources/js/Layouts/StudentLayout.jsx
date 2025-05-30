import Banner from '@/Components/Banner';
import { Card, CardContent } from '@/Components/ui/card';
import { Toaster } from '@/Components/ui/toaster';
import { flashMessage } from '@/lib/utils';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import HeaderStudentLayout from './Partials/HeaderStudentLayout';

export default function StudentLayout({ children, title }) {
    const checkFee = usePage().props.checkFee;
    const { url } = usePage();
    const auth = usePage().props.auth || {}; 
    const flash = flashMessage(usePage());
    const studentNumber = usePage().props.auth?.student_number || "Nomor tidak tersedia";
    console.log("Auth:", usePage().props.auth);
    console.log("Student:", usePage().props.auth.student);
    console.log("Classroom:", usePage().props.auth.classroom);

    useEffect(() => {
        if (flash && flash.Message && flash.type === 'warning') toast[flash.type](flash.message);
    }, [flash]);

    return (
        <>
            <Head title={title} />
            <Toaster position="top-center" richColors />
            <div className="min-h-full">
                <div className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 pb-32">
                    {/* {Header Layout} */}
                    <HeaderStudentLayout auth={auth} url={url} />
                </div>

                <main className="-mt-32 px-6 pb-12 lg:px-28">
                    <Card>
                        <CardContent className="p-6">{children}</CardContent>
                    </Card>

                    {/* {checkFee} */}
                    {checkFee === false && (
                        <Banner message="Harap melakukan pembayaran Uang Kuliah Tunggal terlebih dahulu" />
                    )}
                </main>
            </div>
        </>
    );
}
