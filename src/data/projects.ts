export type TagType =
  | 'Atrasado'
  | 'Priorizado'
  | 'Em andamento'
  | 'Alta prioridade'
  | 'Médio'
  | 'Média prioridade'
  | 'Concluído'
  | 'Baixa prioridade'
  | 'Paralisado';

export type StatusType = 'Ativo' | 'Paralisado' | 'Concluído';

export type AccessLevel = 'Colaborador' | 'Editor' | 'Visualizador';

export interface Project {
  id: string;
  code: string;
  title: string;
  tags: TagType[];
  status: StatusType;
  progress: number;
  deliveryDate: string;
  responsible: string;
  accessLevel?: AccessLevel;
}

export interface TabConfig {
  id: 'mine' | 'shared' | 'strategic';
  title: string;
  badge: number;
  description: string;
}

export interface StrategicAxis {
  id: string;
  number: number;
  name: string;
  acronym: string;
  projectCount: number;
  projects: AxisProject[];
}

export interface AxisProject {
  code: string;
  title: string;
  status: StatusType;
  progress: number;
  responsible: string;
}

export interface SummaryCardData {
  id: string;
  label: string;
  value: number;
  description: string;
  color: string;
}

export const tabs: TabConfig[] = [
  {
    id: 'mine',
    title: 'Meus Projetos',
    badge: 4,
    description: 'Projetos sob sua responsabilidade ou vinculados a você.',
  },
  {
    id: 'shared',
    title: 'Compartilhados Comigo',
    badge: 3,
    description: 'Projetos nos quais você possui participação ou acesso.',
  },
  {
    id: 'strategic',
    title: 'Planejamento Estratégico',
    badge: 8,
    description: 'Projetos vinculados aos eixos estratégicos da instituição.',
  },
];

export const projects: Project[] = [
  {
    id: '1',
    code: 'PROJ-01',
    title: 'Modernização da Infraestrutura de Rede e Data Center',
    tags: ['Atrasado', 'Priorizado'],
    status: 'Ativo',
    progress: 67,
    deliveryDate: '30/09/2025',
    responsible: 'João Silva',
  },
  {
    id: '2',
    code: 'PROJ-02',
    title: 'Renovação do Parque de Equipamentos de TI',
    tags: ['Em andamento', 'Alta prioridade'],
    status: 'Paralisado',
    progress: 25,
    deliveryDate: '15/12/2025',
    responsible: 'Maria Souza',
  },
  {
    id: '3',
    code: 'PROJ-03',
    title: 'Implantação de Novo Sistema de Gestão',
    tags: ['Em andamento', 'Médio'],
    status: 'Ativo',
    progress: 45,
    deliveryDate: '20/11/2025',
    responsible: 'Carlos Lima',
  },
  {
    id: '4',
    code: 'PROJ-04',
    title: 'Aquisição de Equipamentos de Segurança',
    tags: ['Concluído', 'Baixa prioridade'],
    status: 'Concluído',
    progress: 100,
    deliveryDate: '10/08/2025',
    responsible: 'Ana Costa',
  },
];

export const sharedProjects: Project[] = [
  {
    id: '5',
    code: 'PROJ-05',
    title: 'Portal Integrado de Serviços',
    tags: ['Em andamento', 'Priorizado'],
    status: 'Ativo',
    progress: 72,
    deliveryDate: '15/11/2025',
    responsible: 'Fernanda Costa',
    accessLevel: 'Colaborador',
  },
  {
    id: '6',
    code: 'PROJ-06',
    title: 'Integração de Sistemas Institucionais',
    tags: ['Em andamento', 'Alta prioridade'],
    status: 'Ativo',
    progress: 48,
    deliveryDate: '30/01/2026',
    responsible: 'Rafael Oliveira',
    accessLevel: 'Editor',
  },
  {
    id: '7',
    code: 'PROJ-07',
    title: 'Modernização dos Serviços Digitais',
    tags: ['Paralisado', 'Média prioridade'],
    status: 'Paralisado',
    progress: 35,
    deliveryDate: '20/02/2026',
    responsible: 'Amanda Souza',
    accessLevel: 'Visualizador',
  },
];

export const summaryCardsByTab: Record<string, SummaryCardData[]> = {
  mine: [
    { id: 'total', label: 'Projetos', value: 4, description: 'Total de projetos vinculados a você', color: 'blue' },
    { id: 'active', label: 'Ativos', value: 2, description: 'Em andamento', color: 'amber' },
    { id: 'done', label: 'Concluído', value: 1, description: 'Finalizado', color: 'green' },
    { id: 'late', label: 'Atrasado', value: 1, description: 'Fora do prazo', color: 'red' },
  ],
  shared: [
    { id: 'total', label: 'Projetos', value: 3, description: 'Projetos compartilhados com você', color: 'blue' },
    { id: 'active', label: 'Ativos', value: 2, description: 'Em andamento', color: 'amber' },
    { id: 'done', label: 'Concluído', value: 0, description: 'Finalizado', color: 'green' },
    { id: 'late', label: 'Atrasado', value: 0, description: 'Fora do prazo', color: 'red' },
  ],
  strategic: [
    { id: 'total', label: 'Eixos', value: 6, description: 'Eixos estratégicos do plano', color: 'blue' },
    { id: 'active', label: 'Projetos', value: 32, description: 'Projetos vinculados', color: 'amber' },
    { id: 'done', label: 'Concluído', value: 12, description: 'Projetos finalizados', color: 'green' },
    { id: 'late', label: 'Atrasado', value: 5, description: 'Fora do prazo', color: 'red' },
  ],
};

export const strategicAxes: StrategicAxis[] = [
  {
    id: 'axis-1',
    number: 1,
    name: 'Administração e Finanças',
    acronym: 'PAF',
    projectCount: 3,
    projects: [
      { code: 'PROJ-10', title: 'Otimização de Processos Financeiros', status: 'Ativo', progress: 68, responsible: 'Paulo Mendes' },
      { code: 'PROJ-11', title: 'Gestão de Contratos e Convênios', status: 'Concluído', progress: 100, responsible: 'Lucia Ferreira' },
      { code: 'PROJ-12', title: 'Modernização da Contabilidade', status: 'Ativo', progress: 42, responsible: 'Roberto Alves' },
    ],
  },
  {
    id: 'axis-2',
    number: 2,
    name: 'Gestão de Dados e Automação',
    acronym: 'PDA',
    projectCount: 7,
    projects: [
      { code: 'PROJ-20', title: 'Implementação de Governança de Dados', status: 'Ativo', progress: 55, responsible: 'Fernanda Costa' },
      { code: 'PROJ-21', title: 'Automação de Relatórios Gerenciais', status: 'Ativo', progress: 80, responsible: 'Rafael Oliveira' },
      { code: 'PROJ-22', title: 'Central de Indicadores', status: 'Paralisado', progress: 30, responsible: 'Amanda Souza' },
      { code: 'PROJ-23', title: 'Padronização de Banco de Dados', status: 'Ativo', progress: 62, responsible: 'Carlos Lima' },
    ],
  },
  {
    id: 'axis-3',
    number: 3,
    name: 'Planejamento Estratégico e Governança',
    acronym: 'PEG',
    projectCount: 8,
    projects: [
      { code: 'PROJ-30', title: 'Revisão do Plano Estratégico', status: 'Ativo', progress: 75, responsible: 'Juliana Prado' },
      { code: 'PROJ-31', title: 'Implementação de Gestão por Resultados', status: 'Ativo', progress: 50, responsible: 'Marcelo Dias' },
      { code: 'PROJ-32', title: 'Comitê de Governança', status: 'Concluído', progress: 100, responsible: 'Patrícia Gomes' },
    ],
  },
  {
    id: 'axis-4',
    number: 4,
    name: 'Infraestrutura e Serviços',
    acronym: 'PIS',
    projectCount: 6,
    projects: [
      { code: 'PROJ-40', title: 'Modernização da Infraestrutura de Rede', status: 'Ativo', progress: 67, responsible: 'João Silva' },
      { code: 'PROJ-41', title: 'Adequação do Data Center', status: 'Ativo', progress: 45, responsible: 'Maria Souza' },
      { code: 'PROJ-42', title: 'Renovação de Equipamentos de TI', status: 'Paralisado', progress: 25, responsible: 'Carlos Lima' },
    ],
  },
  {
    id: 'axis-5',
    number: 5,
    name: 'Soluções Digitais',
    acronym: 'PSD',
    projectCount: 8,
    projects: [
      { code: 'PROJ-50', title: 'Portal Integrado de Serviços', status: 'Ativo', progress: 72, responsible: 'Fernanda Costa' },
      { code: 'PROJ-51', title: 'Integração de Sistemas Institucionais', status: 'Ativo', progress: 48, responsible: 'Rafael Oliveira' },
      { code: 'PROJ-52', title: 'Modernização dos Serviços Digitais', status: 'Paralisado', progress: 35, responsible: 'Amanda Souza' },
      { code: 'PROJ-53', title: 'App de Atendimento ao Cidadão', status: 'Ativo', progress: 58, responsible: 'Pedro Santos' },
    ],
  },
  {
    id: 'axis-6',
    number: 6,
    name: 'Segurança da Informação',
    acronym: 'PSI',
    projectCount: 0,
    projects: [],
  },
];
