import AppLayout from '@/layouts/AppLayout';
import HeaderTitle from '@/Components/HeaderTitle';
import EmptyState from '@/Components/EmptyState';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { IconDoor } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Show({ course, page_setting }) {
   {
        return (
            <div className="p-6">
                <HeaderTitle
                    title="Data Tidak Ditemukan"
                    subtitle="Mata kuliah atau jadwal tidak tersedia."
                    icon={IconDoor}
                />
                <EmptyState
                    icon={IconDoor}
                    title="Data tidak tersedia"
                    subtitle="Silakan periksa kembali atau hubungi administrator."
                />
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={page_setting?.title ?? 'Detail Mata Kuliah'}
                    subtitle={page_setting?.subtitle ?? ''}
                    icon={IconDoor}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Kelas</CardTitle>
                </CardHeader>

                <CardContent>
                    {course.schedules.length === 0 ? (
                        <EmptyState
                            icon={IconDoor}
                            title="Tidak ada kelas"
                            subtitle="Mulailah dengan membuat kelas baru."
                        />
                    ) : (
                        <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3">
                            {course.schedules.map((schedule) => (
                                <li
                                    key={index}
                                    className="overflow-hidden rounded-xl border border-secondary bg-gray-50 hover:bg-blue-50"
                                >
                                    <Link
                                        href="#"
                                        className="flex flex-col gap-2 p-6"
                                    >
                                        <div className="text-lg font-bold leading-relaxed text-foreground">
                                            {schedule.classroom?.name ?? '-'}
                                        </div>
                                        <div className="text-sm font-medium leading-relaxed text-muted-foreground">
                                            {schedule.faculty?.name ?? '-'} - {schedule.department?.name ?? '-'}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

Show.layout = (page) => <AppLayout>{page}</AppLayout>;
