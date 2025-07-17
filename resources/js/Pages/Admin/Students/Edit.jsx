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
import { IconArrowLeft, IconCheck, IconSchool, IconUser } from '@tabler/icons-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function Edit(props) {
    const fileInputAvatar = useRef(null);
    const { data, setData, put, processing, errors, reset } = useForm({
       faculty_id: props.student.faculty_id ?? null,
       department_id:props.student.department_id ?? null,
       classroom_id: props.student.classroom_id ?? null,
       fee_group_id: props.student.fee_group_id ?? null,
       name: props.student.user.name ?? '',
       email: props.student.user.email ?? '',
       password: '',
       avatar: null,
       student_number: props.student.student_number ?? '',
       semester: props.student.semester ?? 1,
       batch: props.student.batch ?? '',
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
        fileInputAvatar.current.value = null;
    };

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting?.title ?? 'Tambah Program Studi'}
                    subtitle={
                        props.page_setting?.subtitle ?? 'Buat program studi baru di sini. Klik simpan setelah selesai.'
                    }
                    icon={IconUser}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.students.index')}>
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
                                <Label htmlFor="name">Nama mahasiswa</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan nama mahasiswa"
                                    autoComplete="off"
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>
                             <div className="col-span-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={data.email}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan alamat email"
                                    autoComplete="off"
                                />
                                {errors.email && <InputError message={errors.email} />}
                            </div>
                             <div className="col-span-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={data.password}
                                    onChange={onHandleChange}
                                    placeholder="********"
                                    autoComplete="off"
                                />
                                {errors.password && <InputError message={errors.password} />}
                            </div>
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
                                <Label htmlFor="classroom_id">Kelas</Label>
                                <Select
                                    value={data.classroom_id}
                                    onValueChange={(value) => setData('classroom_id', value)}
                                    name="classroom_id"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih program studi" />
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
                             <div className="col-span-full">
                                <Label htmlFor="fee_group_id">Golongan UKT</Label>
                                <Select
                                    value={data.fee_group_id}
                                    onValueChange={(value) => setData('fee_group_id', value)}
                                    name="fee_group_id"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih golongan ukt" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.feeGroups.map((feeGroup) => (
                                            <SelectItem key={feeGroup.value} value={feeGroup.value}>
                                                {feeGroup.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.fee_group_id && <InputError message={errors.fee_group_id} />}
                            </div>
                             <div className="col-span-2">
                                <Label htmlFor="student_number">Nomor Pokok Mahasiswa</Label>
                                <Input
                                    type="text"
                                    name="student_number"
                                    id="student_number"
                                    value={data.student_number}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan  nomor pokok mahasiswa"
                                    autoComplete="off"
                                />
                                {errors.student_number && <InputError message={errors.student_number} />}
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="semester">Semester</Label>
                                <Input
                                    type="number"
                                    name="semester"
                                    id="semester"
                                    value={data.semester}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan semester"
                                    autoComplete="off"
                                />
                                {errors.semester && <InputError message={errors.semester} />}
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="batch">Angkatan</Label>
                                <Input
                                    type="text"
                                    name="batch"
                                    id="batch"
                                    value={data.batch}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan angkatan"
                                    autoComplete="off"
                                />
                                {errors.batch && <InputError message={errors.batch} />}
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="avatar">Avatar</Label>
                                <Input
                                    type="file"
                                    name="avatar"
                                    id="avatar"
                                    value={data.avatar}
                                    onChange={(e) => setData(e.target.name, e.target.file[0])}
                                    ref={fileInputAvatar}
                                    autoComplete="off"
                                />
                                {errors.avatar && <InputError message={errors.avatar} />}
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
