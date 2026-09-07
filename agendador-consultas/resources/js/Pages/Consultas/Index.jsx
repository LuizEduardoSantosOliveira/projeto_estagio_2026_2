import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const CORES_STATUS = {
    pendente: 'bg-yellow-100 text-yellow-800',
    confirmado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
};

export default function Index({ consultas }) {
    const { flash } = usePage().props;

    function confirmar(consulta) {
        router.patch(route('consultas.confirm', consulta.id));
    }

    function cancelar(consulta) {
        if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
            router.patch(route('consultas.cancel', consulta.id));
        }
    }

    function excluir(consulta) {
        if (confirm('Tem certeza que deseja excluir esta consulta?')) {
            router.delete(route('consultas.destroy', consulta.id));
        }
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Minhas consultas</h2>}>
            <Head title="Minhas consultas" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded bg-green-50 p-4 text-green-800">{flash.success}</div>
                    )}

                    <div className="mb-4 flex justify-end">
                        <Link
                            href={route('consultas.create')}
                            className="rounded bg-indigo-600 px-4 py-2 text-white"
                        >
                            Marcar nova consulta
                        </Link>
                    </div>

                    {consultas.length === 0 ? (
                        <div className="bg-white p-6 text-center text-gray-500 shadow sm:rounded-lg">
                            Você ainda não tem nenhuma consulta agendada.
                        </div>
                    ) : (
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Especialidade</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Data</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Horário</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {consultas.map((consulta) => (
                                        <tr key={consulta.id}>
                                            <td className="px-6 py-4">{consulta.tipo}</td>
                                            <td className="px-6 py-4">{consulta.data}</td>
                                            <td className="px-6 py-4">{consulta.horario}</td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${CORES_STATUS[consulta.status]}`}>
                                                    {consulta.status}
                                                </span>
                                            </td>
                                            <td className="space-x-2 px-6 py-4 text-right">
                                                {consulta.pode_ser_alterada && (
                                                    <>
                                                        <Link
                                                            href={route('consultas.edit', consulta.id)}
                                                            className="text-indigo-600 hover:underline"
                                                        >
                                                            Editar
                                                        </Link>
                                                        {consulta.status === 'pendente' && (
                                                            <button onClick={() => confirmar(consulta)} className="text-green-600 hover:underline">
                                                                Confirmar
                                                            </button>
                                                        )}
                                                        <button onClick={() => cancelar(consulta)} className="text-orange-600 hover:underline">
                                                            Cancelar
                                                        </button>
                                                        <button onClick={() => excluir(consulta)} className="text-red-600 hover:underline">
                                                            Excluir
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}