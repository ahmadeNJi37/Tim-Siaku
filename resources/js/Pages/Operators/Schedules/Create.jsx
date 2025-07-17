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
import { IconArrowLeft, IconCalendar, IconCheck } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Create(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        course_id: '',
        classroom_id: '',
        start_time: '',
        end_time: '',
        day_of_week: '',
        quota: '',
        method: props.page_setting?.method ?? 'POST',
    });

    const onHandleChange = (e) => setData(e.target.name, e.target.value);

    const onHandleSubmit = (e) => {
        e.preventDefault();

        post(props.page_setting.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (response) => {
                const flash = flashMessage(response);
                if (flash) toast[flash.type](flash.message);
                reset();
            },
            onError: () => {
                // Optional: handle error
            },
        });
    };

    const onHandleReset = () => reset();

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting?.title ?? 'Tambah Jadwal'}
                    subtitle={props.page_setting?.subtitle ?? 'Buat jadwal baru di sini. Klik simpan setelah selesai.'}
                    icon={IconCalendar}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('operators.schedules.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={onHandleSubmit} noValidate>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            <div className="col-span-full">
                                <Label htmlFor="course_id">Mata Kuliah</Label>
                                <Select
                                    value={data.course_id}
                                    onValueChange={(value) => setData('course_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih mata kuliah" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.courses.map((course) => (
                                            <SelectItem key={course.value} value={String(course.value)}>
                                                {course.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.course_id} />
                            </div>

                            <div className="col-span-full">
                                <Label htmlFor="classroom_id">Kelas</Label>
                                <Select
                                    value={data.classroom_id}
                                    onValueChange={(value) => setData('classroom_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.classrooms.map((classroom) => (
                                            <SelectItem key={classroom.value} value={String(classroom.value)}>
                                                {classroom.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.classroom_id} />
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
                                <InputError message={errors.start_time} />
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
                                <InputError message={errors.end_time} />
                            </div>

                            <div className="col-span-full">
                                <Label htmlFor="day_of_week">Hari</Label>
                                <Select
                                    value={data.day_of_week}
                                    onValueChange={(value) => setData('day_of_week', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Hari" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.days.map((day) => (
                                            <SelectItem key={day.value} value={String(day.value)}>
                                                {day.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.day_of_week} />
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="quota">Kuota</Label>
                                <Input
                                    type="number"
                                    name="quota"
                                    id="quota"
                                    value={data.quota}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Kuota"
                                    autoComplete="off"
                                />
                                <InputError message={errors.quota} />
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-2 lg:flex-row lg:justify-end">
                            <Button type="button" variant="ghost" size="xl" onClick={onHandleReset}>
                                Reset
                            </Button>
                            <Button type="submit" variant="blue" size="xl" disabled={processing}>
                                <IconCheck className="mr-2" />
                                Simpan
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

Create.layout = (page) => <AppLayout children={page} title={page.props.page_setting?.title} />;
