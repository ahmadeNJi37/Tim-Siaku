import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconCheck, IconUser } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function Edit(props) {
    const fileInputAvatar = useRef(null);
    const [preview, setPreview] = useState(null);

    const initialData = {
        faculty_id: props.student.faculty_id ?? null,
        department_id: props.student.department_id ?? null,
        classroom_id: props.student.classroom_id ?? null,
        fee_group_id: props.student.fee_group_id ?? null,
        name: props.student?.user?.name ?? '',
        email: props.student?.user?.email ?? '',
        password: '',
        avatar: null,
        student_number: props.student.student_number ?? '',
        semester: props.student.semester ?? 1,
        batch: props.student.batch ?? '',
        method: props.page_setting.method,
    };

    const { data, setData, put, processing, errors, reset } = useForm(initialData);

    const onHandleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const onHandleAvatarChange = (e) => {
        const file = e.target.files[0];
        setData('avatar', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const onHandleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            name: data.name?.trim() || null,
            email: data.email?.trim() || null,
            password: data.password?.trim() || null,
            student_number: data.student_number?.trim() || null,
            semester: data.semester ? parseInt(data.semester) : null,
            batch: data.batch ? parseInt(data.batch) : null,
            faculty_id: data.faculty_id ? parseInt(data.faculty_id) : null,
            department_id: data.department_id ? parseInt(data.department_id) : null,
            classroom_id: data.classroom_id ? parseInt(data.classroom_id) : null,
            fee_group_id: data.fee_group_id ? parseInt(data.fee_group_id) : null,
            avatar: data.avatar || null,
        };

        if (!submitData.password) {
            delete submitData.password;
        }

        put(props.page_setting.action, {
            data: submitData,
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: (response) => {
                const flash = flashMessage(response);
                if (flash) toast[flash.type](flash.message);
                reset({ ...initialData, avatar: null });
                setPreview(null);
                if (fileInputAvatar.current) fileInputAvatar.current.value = null;
            },
        });
    };

    const onHandleReset = () => {
        reset({ ...initialData, avatar: null });
        setPreview(null);
        if (fileInputAvatar.current) fileInputAvatar.current.value = null;
    };

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting?.title ?? 'Edit Mahasiswa'}
                    subtitle={props.page_setting?.subtitle ?? 'Perbarui data mahasiswa di sini.'}
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
                            {/* Nama */}
                            <div className="col-span-full">
                                <Label htmlFor="name">Nama mahasiswa</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan nama mahasiswa"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="col-span-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={data.email}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan email"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="col-span-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={data.password}
                                    onChange={onHandleChange}
                                    placeholder="********"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Fakultas */}
                            <div className="col-span-full">
                                <Label htmlFor="faculty_id">Fakultas</Label>
                                <Select
                                    value={data.faculty_id?.toString() ?? ''}
                                    onValueChange={(value) => setData('faculty_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih fakultas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.faculties.map((faculty) => (
                                            <SelectItem key={faculty.value} value={faculty.value.toString()}>
                                                {faculty.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.faculty_id} />
                            </div>

                            {/* Prodi */}
                            <div className="col-span-full">
                                <Label htmlFor="department_id">Program Studi</Label>
                                <Select
                                    value={data.department_id?.toString() ?? ''}
                                    onValueChange={(value) => setData('department_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih program studi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.departments.map((department) => (
                                            <SelectItem key={department.value} value={department.value.toString()}>
                                                {department.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.department_id} />
                            </div>

                            {/* Kelas */}
                            <div className="col-span-full">
                                <Label htmlFor="classroom_id">Kelas</Label>
                                <Select
                                    value={data.classroom_id?.toString() ?? ''}
                                    onValueChange={(value) => setData('classroom_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.classrooms.map((classroom) => (
                                            <SelectItem key={classroom.value} value={classroom.value.toString()}>
                                                {classroom.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.classroom_id} />
                            </div>

                            {/* UKT */}
                            <div className="col-span-full">
                                <Label htmlFor="fee_group_id">Golongan UKT</Label>
                                <Select
                                    value={data.fee_group_id?.toString() ?? ''}
                                    onValueChange={(value) => setData('fee_group_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih golongan UKT" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.feeGroups.map((feeGroup) => (
                                            <SelectItem key={feeGroup.value} value={feeGroup.value.toString()}>
                                                {feeGroup.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.fee_group_id} />
                            </div>

                            {/* NPM */}
                            <div className="col-span-2">
                                <Label htmlFor="student_number">Nomor Pokok Mahasiswa</Label>
                                <Input
                                    type="text"
                                    name="student_number"
                                    id="student_number"
                                    value={data.student_number}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan NPM"
                                />
                                <InputError message={errors.student_number} />
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
                                    placeholder="Masukkan semester"
                                />
                                <InputError message={errors.semester} />
                            </div>

                            {/* Angkatan */}
                            <div className="col-span-2">
                                <Label htmlFor="batch">Angkatan</Label>
                                <Input
                                    type="text"
                                    name="batch"
                                    id="batch"
                                    value={data.batch}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan angkatan"
                                />
                                <InputError message={errors.batch} />
                            </div>

                            {/* Avatar */}
                            <div className="col-span-2">
                                <Label htmlFor="avatar">Avatar</Label>
                                <Input
                                    type="file"
                                    name="avatar"
                                    id="avatar"
                                    accept="image/*"
                                    onChange={onHandleAvatarChange}
                                    ref={fileInputAvatar}
                                />
                                <InputError message={errors.avatar} />
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mt-2 h-24 w-24 rounded-full object-cover"
                                    />
                                )}
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
