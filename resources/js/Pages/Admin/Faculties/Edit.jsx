import HeaderTitle from "@/Components/HeaderTitle"; 
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Toast } from "@/Components/ui/toast";
import AppLayout from "@/Layouts/AppLayout";
import { Link, useForm } from "@inertiajs/react";
import { IconArrowLeft, IconBuildingSkyscraper } from "@tabler/icons-react";
import { useRef } from "react";

export default function Edit(props) {
    const fileInputLogo = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: props.faculty.name ?? '',
        logo: null,
        _method: props.page_setting?.method ?? 'POST',
    });

    const onHandleReset = () => {
        reset();
        fileInputLogo.current.value = null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(props.page_setting.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) Toast[flash.type](flash.message);
            },
        });

        // Jika backend memerlukan FormData, gunakan:
        // post(route('admin.faculties.store'), { forceFormData: true });
    };

    return (
        <div className="flex flex-col w-full pb-32">
            <div className="flex flex-col items-start justify-between mb-8 gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting?.title ?? 'Judul Default'}
                    subtitle={props.page_setting?.subtitle ?? ''}
                    icon={IconBuildingSkyscraper}
                />

                <Button
                    variant="orange"
                    size="xl"
                    className="w-full lg:w-auto"
                    asChild
                >
                    <Link href={route('admin.faculties.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            <div className="col-span-full">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Masukkan nama fakultas"
                                    value={data.name}
                                    onChange={(e) => setData(e.target.name, e.target.value)}
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>

                            <div className="col-span-full">
                                <Label htmlFor="logo">Logo</Label>
                                <Input
                                    type="file"
                                    name="logo"
                                    id="logo"
                                    onChange={(e) => setData('logo', e.target.files[0])}
                                    ref={fileInputLogo}
                                />
                                {errors.logo && <InputError message={errors.logo} />}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-8 lg:flex-row lg:justify-end">
                            <Button type="submit" variant="blue" size="xl" disabled={processing}>
                                Simpan
                            </Button>
                            <Button type="button" variant="ghost" size="xl" onClick={onHandleReset}>
                                Reset
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

Edit.layout = (page) => <AppLayout children={page} />;
