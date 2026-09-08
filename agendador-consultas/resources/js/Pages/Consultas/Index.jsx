import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const CORES_STATUS = {
    pendente: 'bg-amber-50 text-amber-700 border border-amber-200',
    confirmado: 'bg-clinical-50 text-clinical-700 border border-clinical-200',
    cancelado: 'bg-red-50 text-red-700 border border-red-200',
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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-clinical-900">
                    Minhas consultas
                </h2>
            }
        >
            <Head title="Minhas consultas" />

            <div className="py-10">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 border border-clinical-200 bg-clinical-50 px-4 py-3 text-sm text-clinical-800 sm:rounded-md">
                            {flash.success}
                        </div>
                    )}

                    <div className="mb-4 flex justify-end">
                        <Link
                            href={route('consultas.create')}
                            className="rounded-md bg-clinical-800 px-4 py-2 text-sm font-semibold text-white hover:bg-clinical-700"
                        >
                            Marcar nova consulta
                        </Link>
                    </div>

                    {consultas.length === 0 ? (
                        <div className="border border-gray-200 bg-white p-10 text-center text-gray-500 sm:rounded-md">
                            Você ainda não tem nenhuma consulta agendada.
                        </div>
                    ) : (
                        <div className="overflow-hidden border border-gray-200 bg-white sm:rounded-md">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Especialidade</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Data</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Horário</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {consultas.map((consulta) => (
                                        <tr key={consulta.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-800">{consulta.tipo}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{consulta.data}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{consulta.horario}</td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-md px-2 py-1 text-xs font-medium ${CORES_STATUS[consulta.status]}`}>
                                                    {consulta.status}
                                                </span>
                                            </td>
                                            <td className="space-x-3 px-6 py-4 text-right text-sm">
                                                {consulta.pode_ser_alterada && (
                                                    <>
                                                        <Link
                                                            href={route('consultas.edit', consulta.id)}
                                                            className="font-medium text-clinical-600 hover:text-clinical-800"
                                                        >
                                                            Editar
                                                        </Link>
                                                        {consulta.status === 'pendente' && (
                                                            <button onClick={() => confirmar(consulta)} className="font-medium text-emerald-600 hover:text-emerald-800">
                                                                Confirmar
                                                            </button>
                                                        )}
                                                        <button onClick={() => cancelar(consulta)} className="font-medium text-amber-600 hover:text-amber-800">
                                                            Cancelar
                                                        </button>
                                                        <button onClick={() => excluir(consulta)} className="font-medium text-red-600 hover:text-red-800">
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