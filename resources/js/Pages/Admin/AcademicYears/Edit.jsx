import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconCalendar, IconCheck } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Edit({ academicYear, faculties, page_setting, academicYearSemester }) {
    const initialForm = {
        name: academicYear?.name ?? '',
        start_date: academicYear?.start_date ?? '',
        end_date: academicYear?.end_date ?? '',
        semester: academicYear?.semester ?? '',
        is_active: academicYear?.is_active ?? false,
        code: academicYear?.code ?? '',
    };

    const { data, setData, put, processing, errors, reset } = useForm(initialForm);
    const action = page_setting?.action ?? route('admin.academic-years.update', academicYear?.slug);

    const onHandleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(name, type === 'checkbox' ? checked : value);
    };

    const onHandleSubmit = (e) => {
        e.preventDefault();

        put(action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (response) => {
                const flash = flashMessage(response);
                if (flash) {
                    const allowedTypes = ['success', 'error', 'info', 'warning'];
                    const toastType = allowedTypes.includes(flash.type) ? flash.type : 'success';
                    toast[toastType](flash.message || 'Data berhasil disimpan');
                }
            },
            onError: () => {
                toast.error('Terjadi kesalahan saat menyimpan data.');
            },
        });
    };

    const onHandleReset = () => reset({ ...initialForm });

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={page_setting?.title ?? 'Edit Tahun Ajaran'}
                    subtitle={page_setting?.subtitle ?? 'Edit tahun ajaran di sini. Klik simpan setelah selesai.'}
                    icon={IconCalendar}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.academic-years.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={onHandleSubmit} noValidate>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            {/* Nama Tahun Ajaran */}
                            <div className="col-span-full">
                                <Label htmlFor="name">Nama Tahun Ajaran</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={onHandleChange}
                                    placeholder="Contoh: 2024/2025 Ganjil"
                                    autoComplete="off"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Tanggal Mulai */}
                            <div className="col-span-2">
                                <Label htmlFor="start_date">Tanggal Dimulai</Label>
                                <Input
                                    type="date"
                                    name="start_date"
                                    id="start_date"
                                    value={data.start_date}
                                    onChange={onHandleChange}
                                    autoComplete="off"
                                />
                                <InputError message={errors.start_date} />
                            </div>

                            {/* Tanggal Berakhir */}
                            <div className="col-span-2">
                                <Label htmlFor="end_date">Tanggal Berakhir</Label>
                                <Input
                                    type="date"
                                    name="end_date"
                                    id="end_date"
                                    value={data.end_date}
                                    onChange={onHandleChange}
                                    autoComplete="off"
                                />
                                <InputError message={errors.end_date} />
                            </div>

                            {/* Semester */}
                            <div className="col-span-full">
                                <Label htmlFor="semester">Semester</Label>
                                <Select value={data.semester} onValueChange={(value) => setData('semester', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih semester">
                                            {
                                                academicYearSemester.find(
                                                    (semester) => semester.value === data.semester,
                                                )?.label
                                            }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYearSemester.map((semester, index) => (
                                            <SelectItem key={index} value={semester.value}>
                                                {semester.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.semester} />
                            </div>

                            {/* Checkbox is_active */}
                            <div className="col-span-full">
                                <div className="items-top flex space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked === true)}
                                    />
                                    <div className="gap-1/5 grid leading-none">
                                        <Label htmlFor="is_active">Apakah Aktif?</Label>
                                    </div>
                                </div>
                                <InputError message={errors.is_active} />
                            </div>

                            {/* Kode Tahun Ajaran */}
                            <div className="col-span-full">
                                <Label htmlFor="code">Kode Tahun Ajaran</Label>
                                <Input
                                    type="text"
                                    name="code"
                                    id="code"
                                    value={data.code}
                                    onChange={onHandleChange}
                                    placeholder="Contoh: 2024G"
                                    autoComplete="off"
                                />
                                <InputError message={errors.code} />
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
