import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Painel({ consultas, contadores, filtros }) {
    const [status, setStatus] = useState(filtros.status ?? '');
    const [tipo, setTipo] = useState(filtros.tipo ?? '');
    const [data, setData] = useState(filtros.data ?? '');
    const [paciente, setPaciente] = useState(filtros.paciente ?? '');

    function aplicarFiltros(e) {
        e.preventDefault();
        router.get(route('painel.index'), { status, tipo,data, paciente }, { preserveState: true });
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Painel administrativo</h2>}>
            <Head title="Painel administrativo" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="mb-6 grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 text-center shadow sm:rounded-lg">
                            <p className="text-2xl font-bold">{contadores.pendentes}</p>
                            <p className="text-sm text-gray-500">Pendentes</p>
                        </div>
                        <div className="bg-white p-4 text-center shadow sm:rounded-lg">
                            <p className="text-2xl font-bold">{contadores.confirmadas}</p>
                            <p className="text-sm text-gray-500">Confirmadas hoje</p>
                        </div>
                        <div className="bg-white p-4 text-center shadow sm:rounded-lg">
                            <p className="text-2xl font-bold">{contadores.canceladas}</p>
                            <p className="text-sm text-gray-500">Canceladas</p>
                        </div>
                    </div>

                    <form onSubmit={aplicarFiltros} className="mb-6 flex flex-wrap gap-4 bg-white p-4 shadow sm:rounded-lg">
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border-gray-300">
                            <option value="">Todos os status</option>
                            <option value="pendente">Pendente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="rounded-md border-gray-300">
                            <option value="">Todas as especialidades</option>
                            <option value="Clínica Geral">Clínica Geral</option>
                            <option value="Cardiologia">Cardiologia</option>
                            <option value="Dermatologia">Dermatologia</option>
                            <option value="Pediatria">Pediatria</option>
                        </select>
                        <input
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            className="rounded-md border-gray-300"
                        />
                        <input
                            type="text"
                            placeholder="Buscar por paciente..."
                            value={paciente}
                            onChange={(e) => setPaciente(e.target.value)}
                            className="rounded-md border-gray-300"
                        />
                        <button type="submit" className="rounded bg-indigo-600 px-4 py-2 text-white">
                            Filtrar
                        </button>
                    </form>

                    {consultas.length === 0 ? (
                        <div className="bg-white p-6 text-center text-gray-500 shadow sm:rounded-lg">
                            Nenhuma consulta agendada ainda.
                        </div>
                    ) : (
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Paciente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Especialidade</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Data</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Horário</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {consultas.map((consulta) => (
                                        <tr key={consulta.id}>
                                            <td className="px-6 py-4">{consulta.user.name}</td>
                                            <td className="px-6 py-4">{consulta.tipo}</td>
                                            <td className="px-6 py-4">{consulta.data}</td>
                                            <td className="px-6 py-4">{consulta.horario}</td>
                                            <td className="px-6 py-4">{consulta.status}</td>
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