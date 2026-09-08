import { useState } from 'react';
import { Plus, Minus, BarChart2, FolderKanban } from 'lucide-react';
import type { StrategicAxis } from '@/data/projects';

interface StrategicViewProps {
  axes: StrategicAxis[];
}

const statusDot: Record<string, string> = {
  'Ativo': 'bg-green-500',
  'Paralisado': 'bg-gray-400',
  'Concluído': 'bg-blue-500',
};

const progressColor = (value: number, status: string) => {
  if (status === 'Concluído') return 'bg-green-500';
  if (status === 'Paralisado') return 'bg-gray-400';
  if (value < 50) return 'bg-amber-500';
  return 'bg-institution-600';
};

function AxisRow({ axis, index }: { axis: StrategicAxis; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="animate-fade-in-up rounded-xl border border-gray-200 bg-white shadow-card transition-all hover:border-institution-200 hover:shadow-card-hover"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Axis header row */}
      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:gap-6">
        {/* Axis number */}
        <div className="flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-institution-200 bg-institution-50 text-sm font-bold text-institution-700">
            {axis.number}
          </div>
        </div>

        {/* Axis name + acronym */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug text-gray-800">
            {axis.name}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">
            Sigla: <span className="font-semibold text-gray-600">{axis.acronym}</span>
          </p>
        </div>

        {/* Project count */}
        <div className="flex-shrink-0 lg:w-32">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <div>
              <p className="text-sm font-bold text-gray-700">{axis.projectCount}</p>
              <p className="text-[11px] text-gray-400">projetos</p>
            </div>
          </div>
        </div>

        {/* Ver indicadores */}
        <div className="flex-shrink-0 lg:w-36">
          <button className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-institution-600 transition-colors hover:text-institution-800">
            <BarChart2 className="h-4 w-4" />
            Ver indicadores
          </button>
        </div>

        {/* Expand button */}
        <div className="flex-shrink-0 lg:ml-auto">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-all hover:bg-institution-50 hover:border-institution-200 hover:text-institution-600"
            title={expanded ? 'Recolher' : 'Expandir'}
          >
            {expanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4">
          {axis.projects.length > 0 ? (
            <div className="space-y-2.5">
              {axis.projects.map((p) => (
                <div
                  key={p.code}
                  className="flex flex-col gap-3 rounded-lg bg-gray-50/80 p-3 sm:flex-row sm:items-center sm:gap-4"
                >
                  {/* Code + title */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      <span className="font-semibold text-institution-700">{p.code}</span>
                      {' — '}
                      {p.title}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0 sm:w-24">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 flex-shrink-0 rounded-full ${statusDot[p.status]}`} />
                      <span className="text-xs font-medium text-gray-600">{p.status}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex-shrink-0 sm:w-32">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">Progresso</span>
                      <span className="text-[10px] font-bold text-gray-600">{p.progress}%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`h-full rounded-full ${progressColor(p.progress, p.status)}`}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Responsible */}
                  <div className="flex-shrink-0 sm:w-28">
                    <p className="text-[10px] text-gray-400">Responsável</p>
                    <p className="text-xs font-medium text-gray-600">{p.responsible}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-gray-400">
              Nenhum projeto vinculado a este eixo.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function StrategicView({ axes }: StrategicViewProps) {
  return (
    <section>
      {/* Section header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Planejamento Estratégico</h2>
        </div>

        {/* Plano selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Plano:</label>
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:border-institution-500 focus:outline-none focus:ring-2 focus:ring-institution-100">
            <option>Plano Diretor de Tecnologia da Informação</option>
            <option>Plano de Gestão Administrativa</option>
            <option>Plano de Modernização Institucional</option>
          </select>
        </div>
      </div>

      {/* Summary line */}
      <div className="mb-4 flex items-center gap-4 rounded-lg bg-institution-50/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-institution-700">6</span>
          <span className="text-sm text-gray-600">Eixos</span>
        </div>
        <div className="h-4 w-px bg-institution-200" />
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-institution-700">32</span>
          <span className="text-sm text-gray-600">Projetos</span>
        </div>
      </div>

      {/* Axis rows */}
      <div className="space-y-3">
        {axes.map((axis, index) => (
          <AxisRow key={axis.id} axis={axis} index={index} />
        ))}
      </div>
    </section>
  );
}
