import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconCalendar, IconCheck, IconSchool, IconUser, IconUserCog, IconUsersGroup } from '@tabler/icons-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function Edit(props) {
    const { data, setData, put, processing, errors, reset } = useForm({
       faculty_id: props.schedule.faculty_id ?? null,
       department_id: props.schedule.department_id ?? null,
       course_id: props.schedule.course_id ?? null,
       classroom_id: props.schedule.classroom_id ?? null,
       star_time: props.schedule.start_time ?? '',
       end_time: props.schedule.end_time ?? '',
       day_of_week: props.schedule.day_of_week ?? null,
       quota: props.schedule.quota ?? 0,
        method: props.page_setting?.method ?? 'PUT', // safety fallback method
    });

    // Input change handler (untuk input teks)
    const onHandleChange = (e) => setData(e.target.name, e.target.value);

    // Submit form handler
    const onHandleSubmit = (e) => {
        e.preventDefault();

        put(props.page_setting.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (response) => {
                const flash = flashMessage(response);
                if (flash) toast[flash.type](flash.message);
                // Reset form setelah sukses submit
                reset();
            },
            onError: () => {
                // Bisa handle sesuatu kalau perlu
            },
        });
    };

    // Reset form handler
    const onHandleReset = () => {
        reset();
    };

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting?.title ?? 'Tambah Program Studi'}
                    subtitle={
                        props.page_setting?.subtitle ?? 'Buat program studi baru di sini. Klik simpan setelah selesai.'
                    }
                    icon={IconCalendar}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.schedules.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={onHandleSubmit} noValidate>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            {/* Fakultas */}
                            <div className="col-span-full">
                                <Label htmlFor="faculty_id">Fakultas</Label>
                                <Select
                                    value={data.faculty_id}
                                    onValueChange={(value) => setData('faculty_id', value)}
                                    name="faculty_id"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih fakultas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.faculties.map((faculty) => (
                                            <SelectItem key={faculty.value} value={faculty.value}>
                                                {faculty.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.faculty_id && <InputError message={errors.faculty_id} />}
                            </div>
                            <div className="col-span-full">
                                <Label htmlFor="department_id">Program Studi</Label>
                                <Select
                                    value={data.department_id}
                                    onValueChange={(value) => setData('department_id', value)}
                                    name="department_id"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih program studi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.departments.map((department) => (
                                            <SelectItem key={department.value} value={department.value}>
                                                {department.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.department_id && <InputError message={errors.department_id} />}
                            </div>
                             <div className="col-span-full">
                                <Label htmlFor="course_id">Mata Kuliah</Label>
                                <Select
                                    value={data.course_id}
                                    onValueChange={(value) => setData('course_id', value)}
                                    name="course_id"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih mata kuliah" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.courses.map((course) => (
                                            <SelectItem key={course.value} value={course.value}>
                                                {course.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.course_id && <InputError message={errors.course_id} />}
                            </div>
                            <div className="col-span-full">
                                <Label htmlFor="classroom_id">Kelas</Label>
                                <Select
                                    value={data.classroom_id}
                                    onValueChange={(value) => setData('classroom_id', value)}
                                    name="classroom_id"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.classrooms.map((classroom) => (
                                            <SelectItem key={classroom.value} value={classroom.value}>
                                                {classroom.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.classroom_id && <InputError message={errors.classroom_id} />}
                            </div>
                             <div className="col-span-2">
                                <Label htmlFor="start_time">Waktu Mulai</Label>
                                <Input
                                    type="time"
                                    name="start_time"
                                    id="start_time"
                                    value={data.start_time}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Waktu Mulai"
                                    autoComplete="off"
                                />
                                {errors.start_time && <InputError message={errors.start_time} />}
                            </div>
                              <div className="col-span-2">
                                <Label htmlFor="end_time">Waktu Berakhir</Label>
                                <Input
                                    type="time"
                                    name="end_time"
                                    id="end_time"
                                    value={data.end_time}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Waktu Berakhir"
                                    autoComplete="off"
                                />
                                {errors.end_time && <InputError message={errors.end_time} />}
                            </div>
                             <div className="col-span-full">
                                <Label htmlFor="day_of_week">Hari</Label>
                                <Select
                                    value={data.day_of_week}
                                    onValueChange={(value) => setData('day_of_week', value)}
                                    name="day_of_week"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Hari" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.days.map((day) => (
                                            <SelectItem key={day.value} value={day.value}>
                                                {day.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.day_of_week && <InputError message={errors.day_of_week} />}
                            </div>
                             <div className="col-span-2">
                                <Label htmlFor="quota">Quota</Label>
                                <Input
                                    type="number"
                                    name="quota"
                                    id="quota"
                                    value={data.quota}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Kuota"
                                    autoComplete="off"
                                />
                                {errors.quota && <InputError message={errors.quota} />}
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-2 lg:flex-row lg:justify-end">
                            <Button type="button" variant="ghost" size="xl" onClick={onHandleReset}>
                                Reset
                            </Button>
                            <Button type="submit" variant="blue" size="xl" disabled={processing}>
                                <IconCheck />
                                Simpan
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

Edit.layout = (page) => <AppLayout children={page} title={page.props.page_setting?.title} />;
