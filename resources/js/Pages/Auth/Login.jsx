import ApplicationLogo from '@/Components/ApplicationLogo';
import InputError from '@/Components/InputError';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const onHandleSubmit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex flex-col px-6 py-4">
                <ApplicationLogo

                    bgLogo="from-blue-400 via-blue-600 to-blue-800"

                    colorLogo="text-white"
                    colorText="text-white"
                />
                <div className="flex flex-col items-center justify-center py-12 lg:py-48">
                    <div className="mx-auto flex w-full flex-col gap-6 lg:w-1/2">
                        <div className="grid gap-2 text-center">
                            {status && (
                                <Alert variant="success">
                                    <AlertDescription>{status}</AlertDescription>
                                </Alert>
                            )}
                            <h1 className="text-3xl font-bold text-foreground">Masuk</h1>
                            <p className="text-balance text-muted-foreground">

                                Masukan email anda dibawah ini untuk masuk ke akun anda
                            </p>
                        </div>
                        <form onSubmit={onHandleSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2"></div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    placeholder="Luffy@siakubwa.test"
                                    onChange={(e) => setData(e.target.name, e.target.value)}
                                />
                                {errors.email && <InputError message={errors.email} />}
                                <div className="grid gap-2">
                                    <Label htmlFor="password">password</Label>
                                    <div className="flex items-center">
                                        
                                        <Input
                                            type="password"
                                            id="password"
                                            name="password"
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData(e.target.name, e.target.value)}
                                        />
                                        {errors.password && <InputError message={errors.password} />}
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="items-top flex space-x-2">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                checked={data.remember}
                                                onCheckedChange={(checked) => setData('remember', checked)}
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <Label htmlFor="remember">Ingat saya</Label>
                                            </div>
                                        </div>
                                        {errors.remember && <InputError message={errors.remember} />}
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="blue"
                                        size="xl"
                                        className="w-full"

                                        disabled={processing}

                                    >
                                        Masuk
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="lg:block hidden bg-muted">
                <img src="/images/bg-login.webp" alt="login" className="h-full max-h-screen w-full object-cover" />

            </div>
        </div>
    );
}


Login.Layout = (page) => <GuestLayout children={page} title="Login" />;

