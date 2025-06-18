import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconCheck, IconCircleKey, IconDroplets } from '@tabler/icons-react';
import { toast } from 'sonner'; // ✅ Tambahkan ini

export default function Create(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
       group: 1,
       amount: 0,
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
                    icon={IconDroplets}
                />

                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.fee_groups.index')}>
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
                                <Label htmlFor="group">Golongan</Label>
                                <Input
                                    type="number"
                                    name="group"
                                    id="group"
                                    placeholder="Masukkan golongan ukt"
                                    value={data.group}
                                    onChange={(e) => setData('group', e.target.value)}
                                />
                                {errors.group && <InputError message={errors.group} />}
                            </div>
                             <div className="col-span-full">
                                <Label htmlFor="amount">Jumlah</Label>
                                <Input
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    placeholder="Masukkan jumlah"
                                    value={data.group}
                                    onChange={(e) => setData('amount', e.target.value)}
                                />
                                {errors.amount && <InputError message={errors.amount} />}
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

Create.layout = (page) => <AppLayout children={page} />;
