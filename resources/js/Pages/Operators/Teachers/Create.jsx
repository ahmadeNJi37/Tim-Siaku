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
import { IconArrowLeft, IconCheck, IconSchool, IconUser, IconUsersGroup } from '@tabler/icons-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function Create(props) {
    const fileInputAvatar = useRef(null);
    const { data, setData, post, processing, errors, reset } = useForm({
       name: '',
       email: '',
       password: '',
       avatar: null,
       teacher_number: '',
       academic_title: '',
        method: props.page_setting?.method ?? 'POST', // safety fallback method
    });

    // Input change handler (untuk input teks)
    const onHandleChange = (e) => setData(e.target.name, e.target.value);

    // Submit form handler
    const onHandleSubmit = (e) => {
        e.preventDefault();

        post(props.page_setting.action, {
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
                    icon={IconUsersGroup}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('operators.teachers.index')}>
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
                                <Label htmlFor="name">Nama dosen</Label>
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
                             <div className="col-span-2">
                                <Label htmlFor="teacher_number">Nomor Induk Dosen</Label>
                                <Input
                                    type="text"
                                    name="teacher_number"
                                    id="teacher_number"
                                    value={data.teacher_number}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan  nomor Indyk dosen"
                                    autoComplete="off"
                                />
                                {errors.student_number && <InputError message={errors.student_number} />}
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="academic_title">Jabatan Akademik</Label>
                                <Input
                                    type="text"
                                    name="academic_title"
                                    id="academic_title"
                                    value={data.academic_title}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan jabatan akademik"
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

Create.layout = (page) => <AppLayout children={page} title={page.props.page_setting?.title} />;
