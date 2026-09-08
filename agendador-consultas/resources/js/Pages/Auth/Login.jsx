import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Entrar" />

            <div className="mb-6">
                <h1 className="text-lg font-semibold text-clinical-900">Acesse sua conta</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Entre para marcar ou gerenciar suas consultas.
                </p>
            </div>

            {status && (
                <div className="mb-4 border border-clinical-200 bg-clinical-50 px-4 py-3 text-sm text-clinical-800 rounded-md">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="E-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Senha" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">Lembrar de mim</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-clinical-600 underline hover:text-clinical-800"
                        >
                            Esqueceu sua senha?
                        </Link>
                    )}
                </div>

                <PrimaryButton className="w-full justify-center" disabled={processing}>
                    Entrar
                </PrimaryButton>

                <p className="text-center text-sm text-gray-500">
                    Não tem uma conta?{' '}
                    <Link href={route('register')} className="font-medium text-clinical-600 underline hover:text-clinical-800">
                        Cadastre-se
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}