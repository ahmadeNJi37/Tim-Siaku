import ApplicationLogo from '@/Components/ApplicationLogo';
import { Toaster } from '@/Components/ui/toaster';
import { Head, Link } from '@inertiajs/react';

export default function GuestLayout({ children, title }) {
    return (
        <>
        <Head title={title}/>
        <Toaster position='top-center' richColors/>
        {children}
        </>
    );
}
