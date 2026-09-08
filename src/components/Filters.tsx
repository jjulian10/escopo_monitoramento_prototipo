import { useState } from 'react';
import { BarChart3, Download, RotateCcw, Filter } from 'lucide-react';

export default function Filters() {
  const [projectFilter, setProjectFilter] = useState('Todos os projetos');
  const [axisFilter, setAxisFilter] = useState('Todos os eixos');
  const [stepFilter, setStepFilter] = useState('Todas as etapas');
  const [statusFilter, setStatusFilter] = useState('Todos os status');
  const [actionName, setActionName] = useState('');
  const [responsible, setResponsible] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const handleClear = () => {
    setProjectFilter('Todos os projetos');
    setAxisFilter('Todos os eixos');
    setStepFilter('Todas as etapas');
    setStatusFilter('Todos os status');
    setActionName('');
    setResponsible('');
    setDateStart('');
    setDateEnd('');
  };

  const selectClass =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:border-institution-500 focus:outline-none focus:ring-2 focus:ring-institution-100';
  const inputClass = selectClass;
  const labelClass = 'mb-1.5 block text-xs font-semibold text-gray-600';
  const sectionTitleClass = 'text-base font-semibold text-gray-800';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
      <h2 className={sectionTitleClass}>Filtros de Projetos</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={labelClass}>Projeto</label>
          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className={selectClass}>
            <option>Todos os projetos</option>
            <option>PROJ-01</option>
            <option>PROJ-02</option>
            <option>PROJ-03</option>
            <option>PROJ-04</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Eixo</label>
          <select value={axisFilter} onChange={(e) => setAxisFilter(e.target.value)} className={selectClass}>
            <option>Todos os eixos</option>
            <option>Infraestrutura</option>
            <option>Tecnologia da Informação</option>
            <option>Gestão e Governança</option>
            <option>Segurança</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Etapa</label>
          <select value={stepFilter} onChange={(e) => setStepFilter(e.target.value)} className={selectClass}>
            <option>Todas as etapas</option>
            <option>Planejamento</option>
            <option>Execução</option>
            <option>Monitoramento</option>
            <option>Encerramento</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
            <option>Todos os status</option>
            <option>Ativo</option>
            <option>Paralisado</option>
            <option>Concluído</option>
          </select>
        </div>
      </div>

      {/* Divider + Action filters */}
      <div className="mt-6 mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      <h2 className={sectionTitleClass}>Filtros de Ações</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={labelClass}>Nome da Ação</label>
          <input
            type="text"
            value={actionName}
            onChange={(e) => setActionName(e.target.value)}
            placeholder="Buscar por nome da ação..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Responsável</label>
          <input
            type="text"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            placeholder="Filtrar por responsável..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Data início</label>
          <input
            type="text"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            placeholder="dd/mm/aaaa"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Data fim</label>
          <input
            type="text"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            placeholder="dd/mm/aaaa"
            className={inputClass}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          <BarChart3 className="h-4 w-4" />
          Visão Gráfica
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={handleClear}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            <RotateCcw className="h-4 w-4" />
            Limpar
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700">
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg bg-institution-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-institution-700">
            <Filter className="h-4 w-4" />
            Filtrar
          </button>
        </div>
      </div>
    </div>
  );
}
