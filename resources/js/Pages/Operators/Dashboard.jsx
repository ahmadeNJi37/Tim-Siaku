import CardStat from '@/Components/CardStat';
import HeaderTitle from '@/Components/HeaderTitle';
import AppLayout from '@/Layouts/AppLayout';
import { usePage } from '@inertiajs/react';
import { IconBooks, IconDoor, IconLayout2, IconUsers, IconUsersGroup } from '@tabler/icons-react';

export default function Dashboard(props) {
    const auth = usePage().props?.auth?.user;


    return (
        <div className="flex w-full flex-col pb-32">
            <div className="flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconLayout2}
                />
            </div>
            <div className='flex flex-col mb-8'>
                <h2 className='text-xl font-medium leading-relaxed text-foreground'>
                    Hi, {auth?.name ?? 'Guest'}
                </h2>
                <p className='text-muted-foreground text-sm'>
                    Selamat datang di sistem Informasi Akademik Universitas
                </p>
            </div>
            <div className='grid gap-4 mb-8 lg:grid-cols-4'>
                <CardStat
                    data={{ 
                        title: 'Total Mahasiswa',
                        icon: IconUsers,
                        background: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-500',
                        iconClassName: 'text-white'
                    }}
                >
                    <div className='text-2xl font-bold'>
                        {props.count?.students ?? 0}
                    </div>
                </CardStat>
                <CardStat
                    data={{ 
                        title: 'Total Dosen',
                        icon: IconUsersGroup,
                        background: 'text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-500',
                        iconClassName: 'text-white'
                    }}
                >
                    <div className='text-2xl font-bold'>
                        {props.count?.teachers ?? 0}
                    </div>
                </CardStat>
                <CardStat
                    data={{ 
                        title: 'Total Kelas',
                        icon: IconDoor,
                        background: 'text-white bg-gradient-to-r from-lime-400 via-lime-500 to-lime-500',
                        iconClassName: 'text-white'
                    }}
                >
                    <div className='text-2xl font-bold'>
                        {props.count?.classrooms ?? 0}
                    </div>
                </CardStat>
                <CardStat
                    data={{ 
                        title: 'Total Mata Kuliah',
                        icon: IconBooks,
                        background: 'text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500',
                        iconClassName: 'text-white'
                    }}
                >
                    <div className='text-2xl font-bold'>
                        {props.count?.courses ?? 0}
                    </div>
                </CardStat>
            </div>
        </div>
    );
}

Dashboard.layout = (page) => <AppLayout title={page.props.page_settings.title} children={page} />;
