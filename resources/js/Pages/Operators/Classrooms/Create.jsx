import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconCheck, IconDoor } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Create(props) {
    const { academic_year, page_setting } = props;

    const { data, setData, post, processing, errors, reset } = useForm({
        academic_year_id: academic_year.id ?? '',
        name: '',
        code: '',
    });

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const onHandleSubmit = (e) => {
        e.preventDefault();

        post(page_setting.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (response) => {
                const flash = flashMessage(response);
                if (flash) toast[flash.type](flash.message);
                reset();
            },
        });
    };

    const onHandleReset = () => reset();

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={page_setting?.title ?? 'Tambah Kelas'}
                    subtitle={page_setting?.subtitle ?? 'Buat kelas baru di sini. Klik simpan setelah selesai.'}
                    icon={IconDoor}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('operators.classrooms.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={onHandleSubmit} noValidate>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            {/* Tahun Ajaran */}
                            <div className="col-span-full">
                                <Label htmlFor="academic_year_display">Tahun Ajaran</Label>
                                <Input
                                    id="academic_year_display"
                                    type="text"
                                    value={academic_year.name}
                                    disabled
                                />
                                {/* ✅ Hidden input yang tersinkron agar laravel menerima ID yang benar */}
                                <input
                                    type="hidden"
                                    name="academic_year_id"
                                    value={data.academic_year_id}
                                    onChange={(e) => setData('academic_year_id', e.target.value)}
                                />
                                {errors.academic_year_id && (
                                    <InputError message={errors.academic_year_id} />
                                )}
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

                            {/* Kode Kelas (Opsional) */}
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

Create.layout = (page) => <AppLayout children={page} title={page.props.page_setting?.title} />;
