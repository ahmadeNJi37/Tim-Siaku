// import tetap seperti sebelumnya...
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
import { IconArrowLeft, IconCheck, IconUser } from '@tabler/icons-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function Create(props) {
    const fileInputAvatar = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        classroom_id: '',
        fee_group_id: '',
        name: '',
        email: '',
        password: '',
        avatar: null,
        student_number: '',
        semester: '',
        batch: '',
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
                fileInputAvatar.current.value = null;
            },
        });
    };

    const onHandleReset = () => {
        reset();
        fileInputAvatar.current.value = null;
    };

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting?.title ?? 'Tambah Mahasiswa'}
                    subtitle={props.page_setting?.subtitle ?? 'Buat mahasiswa baru di sini. Klik simpan setelah selesai.'}
                    icon={IconUser}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('operators.students.index')}>
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
                                <Label htmlFor="name">Nama Mahasiswa</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name ?? ''}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan nama mahasiswa"
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>

                            {/* Email */}
                            <div className="col-span-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={data.email ?? ''}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan email"
                                />
                                {errors.email && <InputError message={errors.email} />}
                            </div>

                            {/* Password */}
                            <div className="col-span-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={data.password ?? ''}
                                    onChange={onHandleChange}
                                    placeholder="********"
                                />
                                {errors.password && <InputError message={errors.password} />}
                            </div>

                            {/* Classroom */}
                            <div className="col-span-full">
                                <Label htmlFor="classroom_id">Kelas</Label>
                                <Select
                                    value={data.classroom_id ?? ''}
                                    onValueChange={(value) => setData('classroom_id', value)}
                                    name="classroom_id"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(props.classrooms ?? []).map((classroom) => (
                                            <SelectItem key={classroom.value} value={classroom.value}>
                                                {classroom.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.classroom_id && <InputError message={errors.classroom_id} />}
                            </div>

                            {/* Fee Group */}
                            <div className="col-span-full">
                                <Label htmlFor="fee_group_id">Golongan UKT</Label>
                                <Select
                                    value={data.fee_group_id ?? ''}
                                    onValueChange={(value) => setData('fee_group_id', value)}
                                    name="fee_group_id"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih golongan UKT" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(props.feeGroups ?? []).map((feeGroup) => (
                                            <SelectItem key={feeGroup.value} value={feeGroup.value}>
                                                {feeGroup.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.fee_group_id && <InputError message={errors.fee_group_id} />}
                            </div>

                            {/* Student Number */}
                            <div className="col-span-2">
                                <Label htmlFor="student_number">Nomor Pokok Mahasiswa</Label>
                                <Input
                                    type="text"
                                    name="student_number"
                                    id="student_number"
                                    value={data.student_number ?? ''}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan NIM"
                                />
                                {errors.student_number && <InputError message={errors.student_number} />}
                            </div>

                            {/* Semester */}
                            <div className="col-span-2">
                                <Label htmlFor="semester">Semester</Label>
                                <Input
                                    type="number"
                                    name="semester"
                                    id="semester"
                                    value={data.semester ?? ''}
                                    onChange={onHandleChange}
                                    placeholder="Semester"
                                />
                                {errors.semester && <InputError message={errors.semester} />}
                            </div>

                            {/* Batch */}
                            <div className="col-span-2">
                                <Label htmlFor="batch">Angkatan</Label>
                                <Input
                                    type="text"
                                    name="batch"
                                    id="batch"
                                    value={data.batch ?? ''}
                                    onChange={onHandleChange}
                                    placeholder="Angkatan"
                                />
                                {errors.batch && <InputError message={errors.batch} />}
                            </div>

                            {/* Avatar */}
                            <div className="col-span-2">
                                <Label htmlFor="avatar">Avatar</Label>
                                <Input
                                    type="file"
                                    name="avatar"
                                    id="avatar"
                                    onChange={(e) => setData('avatar', e.target.files[0])}
                                    ref={fileInputAvatar}
                                />
                                {errors.avatar && <InputError message={errors.avatar} />}
                            </div>
                        </div>

                        {/* Tombol */}
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

Create.layout = (page) => <AppLayout children={page} title={page.props.page_setting?.title} />;
