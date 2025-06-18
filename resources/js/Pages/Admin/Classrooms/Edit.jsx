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
import { IconArrowLeft, IconCheck, IconDoor } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Edit(props) {
    // props.classroom: objek dengan { id, faculty_id, department_id, academic_year: {id,name}, name, code, slug, ... }
    // props.faculties, props.departments, props.page_setting (method PUT, action route update)
    const { classroom, faculties, departments, academic_year, page_setting } = props;

    const initialForm = {
        faculty_id: classroom.faculty_id?.toString() ?? '',
        department_id: classroom.department_id?.toString() ?? '',
        // academic_year_id tetap di backend, tidak diubah; kita tidak kirim akademik year di update
        name: classroom.name ?? '',
        code: classroom.code ?? '',
    };

    const { data, setData, put, processing, errors, reset } = useForm(initialForm);

    const action = page_setting?.action ?? route('admin.classrooms.update', classroom.slug);

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const onHandleSubmit = (e) => {
        e.preventDefault();
        put(action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (response) => {
                const flash = flashMessage(response);
                if (flash) {
                    toast[flash.type](flash.message);
                }
            },
            onError: () => {
                toast.error('Terjadi kesalahan saat menyimpan data.');
            },
        });
    };

    const onHandleReset = () => reset(initialForm);

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={page_setting?.title ?? 'Edit Kelas'}
                    subtitle={page_setting?.subtitle ?? 'Edit kelas di sini. Klik simpan setelah selesai.'}
                    icon={IconDoor}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.classrooms.index')}>
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
                                <Select value={data.faculty_id} onValueChange={(value) => setData('faculty_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih fakultas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {faculties.map((faculty) => (
                                            <SelectItem key={faculty.value} value={faculty.value}>
                                                {faculty.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.faculty_id && <InputError message={errors.faculty_id} />}
                            </div>

                            {/* Program Studi */}
                            <div className="col-span-full">
                                <Label htmlFor="department_id">Program Studi</Label>
                                <Select
                                    value={data.department_id}
                                    onValueChange={(value) => setData('department_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih program studi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((department) => (
                                            <SelectItem key={department.value} value={department.value}>
                                                {department.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.department_id && <InputError message={errors.department_id} />}
                            </div>

                            {/* Tahun Ajaran (tampil nama saja, tidak diubah) */}
                            <div className="col-span-full">
                                <Label htmlFor="academic_year_display">Tahun Ajaran</Label>
                                <Input id="academic_year_display" type="text" value={academic_year.name} disabled />
                            </div>

                            {/* Nama Kelas */}
                            <div className="col-span-full">
                                <Label htmlFor="name">Nama Kelas</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan nama kelas"
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>

                            {/* Kode Kelas (opsional) */}
                            <div className="col-span-full">
                                <Label htmlFor="code">Kode Kelas</Label>
                                <Input
                                    type="text"
                                    name="code"
                                    id="code"
                                    value={data.code}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan kode kelas (opsional)"
                                />
                                {errors.code && <InputError message={errors.code} />}
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
