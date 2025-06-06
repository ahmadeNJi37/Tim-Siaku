import NavLink from '@/Components/NavLink';
import {
    IconBooks,
    IconBuildingSkyscraper,
    IconCalendar,
    IconCalendarTime,
    IconCircleKey,
    IconDoor,
    IconDroplets,
    IconLayout2,
    IconLogout2,
    IconMoneybag,
    IconSchool,
    IconUserCog,
    IconUserPentagon,
    IconUsersGroup,
} from '@tabler/icons-react';

export default function SidebarResponsive({ auth, url }) {
    return (
        <nav className="mt-4 flex flex-1 flex-col items-top">
            <ul role="list" className="flex flex-1 flex-col">

                {auth.roles.some((role) => ['Admin'].includes(role)) && (
                    <>
                        <NavLink
                            url="#"
                            active={url.startsWith('/admin/dashboard')}
                            title="Dashboard"
                            icon={IconLayout2}
                        />

                        <div className="px-5 py-3 text-xs font-medium text-white">Master</div>
                        <NavLink
                            url={route('admin.faculties.index')}
                            active={url.startsWith('/admin/faculties')}
                            title="Fakultas"
                            icon={IconBuildingSkyscraper}
                        />
                        <NavLink
                            url={route('admin.departments.imdex')}
                            active={url.startsWith('/admin/departments')}
                            title="Program Studi"
                            icon={IconSchool}
                        />
                        <NavLink
                            url="#"
                            active={url.startsWith('/admin/academic-years')}
                            title="Tahun Ajaran"
                            icon={IconCalendarTime}
                        />
                        <NavLink url="#" active={url.startsWith('/admin/classrooms')} title="Kelas" icon={IconDoor} />
                        <NavLink url="#" active={url.startsWith('/admin/roles')} title="Peran" icon={IconCircleKey} />

                        <div className="px-5 py-3 text-xs font-medium text-white">Pengguna</div>
                        <NavLink
                            url="#"
                            active={url.startsWith('/admin/students')}
                            title="Mahasiswa"
                            icon={IconUserPentagon}
                        />
                        <NavLink
                            url="#"
                            active={url.startsWith('/admin/teachers')}
                            title="Dosen"
                            icon={IconUsersGroup}
                        />
                        <NavLink
                            url="#"
                            active={url.startsWith('/admin/operators')}
                            title="Operator"
                            icon={IconUserCog}
                        />

                        <div className="px-5 py-3 text-xs font-medium text-white">Akademik</div>
                        <NavLink
                            url="#"
                            active={url.startsWith('/admin/courses')}
                            title="Mata Kuliah"
                            icon={IconBooks}
                        />
                        <NavLink
                            url="#"
                            active={url.startsWith('/admin/schedules')}
                            title="Jadwal"
                            icon={IconCalendar}
                        />

                        <div className="px-5 py-3 text-xs font-medium text-white">Pembayaran</div>
                        <NavLink
                            url="#"
                            active={url.startsWith('/admin/fees')}
                            title="Uang Kuliah Tunggal"
                            icon={IconMoneybag}
                        />
                        <NavLink
                            url="#"
                            active={url.startsWith('/admin/fee-groups')}
                            title="Golongan UKT"
                            icon={IconDroplets}
                        />
                    </>
                )}

                {auth.roles.some((role) => ['Teacher'].includes(role)) && (
                    <>
                    <NavLink
                            url="#"
                            active={url.startsWith('/teachers/dashboard')}
                            title="Dashboard"
                            icon={IconLayout2}
                        />

                    <div className="px-5 py-3 text-xs font-medium text-white">Akademik</div>
                    <NavLink
                            url="#"
                            active={url.startsWith('/teachers/courses')}
                            title="Mata Kuliah"
                            icon={IconBooks}
                    />
                    <NavLink
                            url="#"
                            active={url.startsWith('/teachers/schedules')}
                            title="Jadwal"
                            icon={IconCalendar}
                    />

                    </>
                )}

                {auth.roles.some((role) => ['Operator'].includes(role)) && (
                    <>
                        <NavLink
                            url="#"
                            active={url.startsWith('/operators/dashboard')}
                            title="Dashboard"
                            icon={IconLayout2}
                        />

                        <div className="px-5 py-3 text-xs font-medium text-white">Pengguna</div>
                        <NavLink
                            url="#"
                            active={url.startsWith('/operators/students')}
                            title="Mahasiswa"
                            icon={IconUserPentagon}
                        />
                        <NavLink
                            url="#"
                            active={url.startsWith('/operators/teachers')}
                            title="Dosen"
                            icon={IconUsersGroup}
                        />

                        <div className="px-5 py-3 text-xs font-medium text-white">Akademik</div>
                        <NavLink
                            url="#"
                            active={url.startsWith('/operators/classrooms')}
                            title="Kelas"
                            icon={IconDoor}
                        />
                        <NavLink
                            url="#"
                            active={url.startsWith('/operators/courses')}
                            title="Mata Kuliah"
                            icon={IconBooks}
                        />
                        <NavLink
                            url="#"
                            active={url.startsWith('/operators/schedules')}
                            title="Jadwal"
                            icon={IconCalendar}
                        />
                    </>
                )}

            <div className="font-large px-5 py-3 text-xs text-white">Lainnya</div>

            <NavLink
                url={route('logout')}
                method="post"
                as="button"
                className='w-full'
                active={url.startsWith('/logout')}
                title="Logout"
                icon={IconLogout2}
            />
            </ul>
        </nav>
    );
}
