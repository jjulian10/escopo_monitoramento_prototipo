import { Calendar, User, ArrowRight, KeyRound } from 'lucide-react';
import type { Project, TagType, StatusType, AccessLevel } from '@/data/projects';

interface ProjectListProps {
  projects: Project[];
  title: string;
  badge: number;
  showAccess?: boolean;
}

const tagStyles: Record<TagType, string> = {
  'Atrasado': 'bg-red-50 text-red-600 border-red-200',
  'Priorizado': 'bg-violet-50 text-violet-600 border-violet-200',
  'Em andamento': 'bg-blue-50 text-blue-600 border-blue-200',
  'Alta prioridade': 'bg-violet-50 text-violet-600 border-violet-200',
  'Médio': 'bg-yellow-50 text-yellow-600 border-yellow-200',
  'Média prioridade': 'bg-yellow-50 text-yellow-600 border-yellow-200',
  'Concluído': 'bg-green-50 text-green-600 border-green-200',
  'Baixa prioridade': 'bg-gray-100 text-gray-500 border-gray-200',
  'Paralisado': 'bg-gray-100 text-gray-500 border-gray-200',
};

const statusConfig: Record<StatusType, { dot: string; text: string }> = {
  'Ativo': { dot: 'bg-green-500', text: 'text-green-700' },
  'Paralisado': { dot: 'bg-gray-400', text: 'text-gray-600' },
  'Concluído': { dot: 'bg-blue-500', text: 'text-blue-700' },
};

const accessStyles: Record<AccessLevel, string> = {
  'Colaborador': 'bg-blue-50 text-blue-600',
  'Editor': 'bg-violet-50 text-violet-600',
  'Visualizador': 'bg-gray-100 text-gray-500',
};

const progressColor = (value: number, status: StatusType) => {
  if (status === 'Concluído') return 'bg-green-500';
  if (status === 'Paralisado') return 'bg-gray-400';
  if (value < 50) return 'bg-amber-500';
  return 'bg-institution-600';
};

function ProjectRow({ project, index, showAccess }: { project: Project; index: number; showAccess?: boolean }) {
  const sc = statusConfig[project.status];

  return (
    <div
      className="animate-fade-in-up rounded-xl border border-gray-200 bg-white p-5 shadow-card transition-all hover:border-institution-200 hover:shadow-card-hover"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        {/* Project number circle */}
        <div className="flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-bold text-gray-500">
            {index + 1}
          </div>
        </div>

        {/* Main info: code + title + tags */}
        <div className="min-w-0 flex-1 lg:max-w-[280px]">
          <h3 className="text-sm font-semibold leading-snug text-gray-800">
            <span className="text-institution-700">{project.code}</span>
            {' — '}
            {project.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${tagStyles[tag]}`}
              >
                {tag}
              </span>
            ))}
            {showAccess && project.accessLevel && (
              <span className={`flex items-center gap-1 rounded-md border border-transparent px-2 py-0.5 text-[11px] font-medium ${accessStyles[project.accessLevel]}`}>
                <KeyRound className="h-3 w-3" />
                {project.accessLevel}
              </span>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex-shrink-0 lg:w-24">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 flex-shrink-0 rounded-full ${sc.dot}`} />
            <span className={`text-sm font-medium ${sc.text}`}>{project.status}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex-shrink-0 lg:w-36">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Progresso</span>
            <span className="text-xs font-bold text-gray-700">{project.progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor(project.progress, project.status)}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Entrega estimada */}
        <div className="flex-shrink-0 lg:w-28">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            <span className="text-[11px] text-gray-400">Entrega estimada</span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-gray-700">{project.deliveryDate}</p>
        </div>

        {/* Responsável */}
        <div className="flex-shrink-0 lg:w-28">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            <span className="text-[11px] text-gray-400">Responsável</span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-gray-700">{project.responsible}</p>
        </div>

        {/* Action */}
        <div className="flex-shrink-0 lg:ml-auto">
          <button className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-institution-600 transition-all hover:bg-institution-50 hover:border-institution-200">
            Ver detalhes
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectList({ projects, title, badge, showAccess }: ProjectListProps) {
  return (
    <section>
      {/* Section header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-institution-100 px-2 text-xs font-bold text-institution-700">
            {badge}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Ordenar por:</label>
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:border-institution-500 focus:outline-none focus:ring-2 focus:ring-institution-100">
            <option>Mais recentes</option>
            <option>Mais antigos</option>
            <option>Maior progresso</option>
            <option>Menor progresso</option>
            <option>Data de entrega</option>
          </select>
        </div>
      </div>

      {/* Project rows */}
      <div className="space-y-3">
        {projects.map((project, index) => (
          <ProjectRow key={project.id} project={project} index={index} showAccess={showAccess} />
        ))}
      </div>
    </section>
  );
}
