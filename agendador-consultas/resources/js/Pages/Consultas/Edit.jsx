import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ consulta, tipos }) {
    const { data, setData, put, processing, errors } = useForm({
        tipo: consulta.tipo,
        data: consulta.data,
        horario: consulta.horario,
        observacoes: consulta.observacoes ?? '',
    });

    function submit(e) {
        e.preventDefault();
        put(route('consultas.update', consulta.id));
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-clinical-900">Editar consulta</h2>}
        >
            <Head title="Editar consulta" />

            <div className="py-10">
                <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                    <div className="border border-gray-200 bg-white p-8 sm:rounded-md">
                        <p className="mb-6 text-sm text-gray-500">
                            Se a consulta já estiver confirmada, alterar qualquer dado abaixo fará com
                            que ela volte para o status pendente.
                        </p>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="tipo" value="Especialidade" />
                                <select
                                    id="tipo"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-clinical-500 focus:ring-clinical-500"
                                    value={data.tipo}
                                    onChange={(e) => setData('tipo', e.target.value)}
                                >
                                    {tipos.map((tipo) => (
                                        <option key={tipo} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.tipo} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="data" value="Data" />
                                    <TextInput
                                        id="data"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.data}
                                        onChange={(e) => setData('data', e.target.value)}
                                    />
                                    <InputError message={errors.data} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="horario" value="Horário" />
                                    <TextInput
                                        id="horario"
                                        type="time"
                                        className="mt-1 block w-full"
                                        value={data.horario}
                                        onChange={(e) => setData('horario', e.target.value)}
                                    />
                                    <InputError message={errors.horario} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="observacoes" value="Observações (opcional)" />
                                <TextInput
                                    id="observacoes"
                                    className="mt-1 block w-full"
                                    value={data.observacoes}
                                    onChange={(e) => setData('observacoes', e.target.value)}
                                />
                                <InputError message={errors.observacoes} className="mt-2" />
                            </div>

                            <div className="border-t border-gray-100 pt-5">
                                <PrimaryButton disabled={processing}>Salvar alterações</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}