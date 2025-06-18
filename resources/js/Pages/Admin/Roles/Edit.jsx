import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconCheck, IconCircleKey } from '@tabler/icons-react';
import { toast } from 'sonner'; // ✅ Tambahkan ini

export default function Edit(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: props.role.name ?? '',
        _method: props.page_setting?.method ?? 'POST',
    });

    const onHandleReset = () => {
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Submit to:', props.page_setting.action);

        post(props.page_setting.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('Peran berhasil ditambahkan!'); // ✅ Ganti flashMessage dengan toast
            },
        });
    };

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting?.title ?? 'Tambah Fakultas'}
                    subtitle={
                        props.page_setting?.subtitle ?? 'Buat fakultas baru di sini. Klik simpan setelah selesai.'
                    }
                    icon={IconCircleKey}
                />

                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.roles.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            <div className="col-span-full">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Masukkan nama peran"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <InputError message={errors.name} />}
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

Edit.layout = (page) => <AppLayout children={page} />;
