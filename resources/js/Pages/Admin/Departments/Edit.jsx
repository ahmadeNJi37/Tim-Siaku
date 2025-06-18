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
import { IconArrowLeft, IconCheck, IconSchool } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Edit(props) {
    const initialForm = {
        faculty_id: props.department.faculty_id ?? null,
        name: props.department.name ?? '',
        code: props.department.code ?? '',
        method: props.page_setting?.method ?? 'POST', // fallback method
    };

    const { data, setData, post, processing, errors, reset } = useForm(initialForm);

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

                if (flash) {
                    const allowedTypes = ['success', 'error', 'info', 'warning'];
                    const toastType = allowedTypes.includes(flash.type) ? flash.type : 'success';
                    toast[toastType](flash.message || 'Berhasil!');
                }

                // Reset form ke nilai awal setelah sukses submit
                reset(initialForm);
            },
            onError: () => {
                // Bisa handle error khusus jika perlu
            },
        });
    };

    // Reset form handler
    const onHandleReset = () => reset(initialForm);

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting?.title ?? 'Tambah Program Studi'}
                    subtitle={
                        props.page_setting?.subtitle ?? 'Buat program studi baru di sini. Klik simpan setelah selesai.'
                    }
                    icon={IconSchool}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.departments.index')}>
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

                            {/* Nama */}
                            <div className="col-span-full">
                                <Label htmlFor="name">Nama Program Studi</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan nama program studi"
                                    autoComplete="off"
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>

                            {/* Kode */}
                            <div className="col-span-full">
                                <Label htmlFor="code">Kode Program Studi</Label>
                                <Input
                                    type="text"
                                    name="code"
                                    id="code"
                                    value={data.code}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan kode program studi"
                                    autoComplete="off"
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
