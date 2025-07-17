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
import { IconArrowLeft, IconBooks, IconCheck } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Edit(props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        teacher_id: props.course.teacher_id ?? '',
        name: props.course.name ?? '',
        credit: props.course.credit ?? 1,
        semester: props.course.semester ?? 1,
    });

    const onHandleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const onHandleSubmit = (e) => {
        e.preventDefault();

        put(props.page_setting.action, {
            data: {
                ...data,
                credit: parseInt(data.credit),
                semester: parseInt(data.semester),
                faculty_id: parseInt(data.faculty_id),
                department_id: parseInt(data.department_id),
                teacher_id: parseInt(data.teacher_id),
            },
            preserveScroll: true,
            preserveState: true,
            onSuccess: (response) => {
                const flash = flashMessage(response);
                if (flash) toast[flash.type](flash.message);
                reset();
            },
            onError: (errors) => {
                console.error("Validation error:", errors);
            },
            onFinish: () => {
                console.log("Submit selesai.");
            },
        });
    };

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting?.title ?? 'Tambah Mata Kuliah'}
                    subtitle={props.page_setting?.subtitle ?? ''}
                    icon={IconBooks}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('operators.courses.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={onHandleSubmit} noValidate>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            {/* Dosen */}
                            <div className="col-span-full">
                                <Label htmlFor="teacher_id">Dosen</Label>
                                <Select
                                    value={data.teacher_id}
                                    onValueChange={(value) => setData('teacher_id', value)}
                                >
                                    <SelectTrigger id="teacher_id">
                                        <SelectValue placeholder="Pilih dosen pengampu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.teachers?.map((item) => (
                                            <SelectItem key={item.value} value={String(item.value)}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.teacher_id} />
                            </div>

                            {/* Nama Mata Kuliah */}
                            <div className="col-span-full">
                                <Label htmlFor="name">Nama Mata Kuliah</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={onHandleChange}
                                    placeholder="Contoh: Algoritma dan Pemrograman"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Credit (SKS) */}
                            <div className="col-span-2">
                                <Label htmlFor="credit">Jumlah SKS</Label>
                                <Input
                                    type="number"
                                    name="credit"
                                    id="credit"
                                    value={data.credit}
                                    onChange={onHandleChange}
                                    placeholder="Misal: 3"
                                />
                                <InputError message={errors.credit} />
                            </div>

                            {/* Semester */}
                            <div className="col-span-2">
                                <Label htmlFor="semester">Semester</Label>
                                <Input
                                    type="number"
                                    name="semester"
                                    id="semester"
                                    value={data.semester}
                                    onChange={onHandleChange}
                                    placeholder="Misal: 1"
                                />
                                <InputError message={errors.semester} />
                            </div>
                        </div>

                        {/* Tombol */}
                        <div className="mt-8 flex flex-col gap-2 lg:flex-row lg:justify-end">
                            <Button type="button" variant="ghost" size="xl" onClick={() => reset()}>
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

Edit.layout = (page) => <AppLayout children={page} title={page.props.page_setting?.title} />;
