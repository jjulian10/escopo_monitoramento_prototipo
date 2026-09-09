// =========================================================
// TIPOS
// =========================================================


// =========================================================
// ETIQUETAS
// =========================================================

export type TagType =
  | 'Impedimento'
  | 'Prioridade'
  | 'Dependência de terceiros'
  | 'Atrasado';


// =========================================================
// STATUS DO PROJETO
// =========================================================

export type StatusType =
  | 'Concluído'
  | 'Em andamento'
  | 'Atrasado'
  | 'Pausado';


// =========================================================
// STATUS DAS TAREFAS / SUBTAREFAS
// =========================================================

export type TaskStatusType =
  | 'Não iniciado'
  | 'Em andamento'
  | 'Homologação'
  | 'Concluído';


// =========================================================
// NÍVEL DE ACESSO
// =========================================================

export type AccessLevel =
  | 'Colaborador'
  | 'Editor'
  | 'Visualizador';


// =========================================================
// TIPO DA TAREFA / SUBTAREFA
// =========================================================

export type ProjectTaskType =
  | 'Documentação'
  | 'Reunião de alinhamento'
  | 'Parametrização'
  | 'Desenvolvimento';


// =========================================================
// TIPOS DO HISTÓRICO
// =========================================================

export type ProjectHistoryType =
  | 'project_created'
  | 'project_updated'
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'subtask_created'
  | 'subtask_updated'
  | 'subtask_deleted'
  | 'status_changed'
  | 'progress_changed'
  | 'responsible_changed'
  | 'tag_added'
  | 'tag_removed';


// =========================================================
// INTERFACE: ITEM DO HISTÓRICO
// =========================================================

export interface ProjectHistoryItem {
  id: string;

  type: ProjectHistoryType;

  title: string;

  description: string;

  user: string;

  /**
   * Data e horário no padrão ISO.
   *
   * Exemplo:
   * 2026-09-09T09:42:00
   */
  createdAt: string;

  metadata?: {
    previousValue?: string;

    newValue?: string;

    taskId?: string;

    subtaskId?: string;

    taskTitle?: string;

    subtaskTitle?: string;
  };
}


// =========================================================
// INTERFACE: SUBTAREFA
// =========================================================

export interface ProjectSubtask {
  id: string;

  // Número dentro da tarefa: 1, 2, 3...
  order: number;

  // Nome da subtarefa
  title: string;

  // Coluna do Kanban
  status: TaskStatusType;

  // Percentual de conclusão
  progress: number;

  // Responsável
  responsible: string;

  // Etiquetas
  tags?: TagType[];

  // Prazo
  deliveryDate?: string;

  // Tipo
  type?: ProjectTaskType;
}


// =========================================================
// INTERFACE: TAREFA / AÇÃO
// =========================================================

export interface ProjectTask {
  id: string;

  // Número exibido: 1, 2, 3...
  order: number;

  // Nome da tarefa
  title: string;

  // Coluna do Kanban
  status: TaskStatusType;

  // Percentual de conclusão
  progress: number;

  // Responsável
  responsible: string;

  // Etiquetas
  tags?: TagType[];

  // Prazo
  deliveryDate?: string;

  // Tipo
  type?: ProjectTaskType;

  // Subtarefas vinculadas
  subtasks?: ProjectSubtask[];
}


// =========================================================
// INTERFACE: PROJETO
// =========================================================

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

  // Tarefas / ações
  tasks?: ProjectTask[];

  // Histórico de movimentações
  history?: ProjectHistoryItem[];
}


// =========================================================
// INTERFACE: ABAS
// =========================================================

export interface TabConfig {
  id:
    | 'mine'
    | 'shared'
    | 'strategic';

  title: string;

  badge: number;

  description: string;
}


// =========================================================
// INTERFACE: PLANEJAMENTO ESTRATÉGICO
// =========================================================

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


// =========================================================
// INTERFACE: CARDS DE RESUMO
// =========================================================

export interface SummaryCardData {
  id: string;

  label: string;

  value: number;

  description: string;

  color: string;
}


// =========================================================
// ABAS PRINCIPAIS
// =========================================================

export const tabs: TabConfig[] = [
  {
    id: 'mine',

    title: 'Meus Projetos',

    badge: 4,

    description:
      'Projetos sob sua responsabilidade ou vinculados a você.',
  },

  {
    id: 'shared',

    title: 'Compartilhados Comigo',

    badge: 3,

    description:
      'Projetos nos quais você possui participação ou acesso.',
  },

  {
    id: 'strategic',

    title: 'Planejamento Estratégico',

    badge: 8,

    description:
      'Projetos vinculados aos eixos estratégicos da instituição.',
  },
];


// =========================================================
// MEUS PROJETOS
// =========================================================

export const projects: Project[] = [

  // -------------------------------------------------------
  // PROJ-01
  // -------------------------------------------------------

  {
    id: '1',

    code: 'PROJ-01',

    title:
      'Modernização da Infraestrutura de Rede e Data Center',

    tags: [
      'Atrasado',
      'Prioridade',
    ],

    status: 'Atrasado',

    progress: 67,

    deliveryDate:
      '30/09/2025',

    responsible:
      'João Silva',


    // =====================================================
    // TAREFAS
    // =====================================================

    tasks: [

      // ---------------------------------------------------
      // TAREFA 1
      // ---------------------------------------------------

      {
        id: 'task-1-1',

        order: 1,

        title:
          'Diagnóstico e Levantamento de Ativos de TI',

        status:
          'Em andamento',

        tags: [
          'Prioridade',
        ],

        progress: 80,

        responsible:
          'João Silva',

        deliveryDate:
          '15/09/2025',

        type:
          'Documentação',

        subtasks: [
          {
            id:
              'subtask-1-1-1',

            order: 1,

            title:
              'Inventário dos servidores e equipamentos de rede',

            status:
              'Concluído',

            progress: 100,

            responsible:
              'João Silva',

            tags: [],

            deliveryDate:
              '10/09/2025',

            type:
              'Documentação',
          },

          {
            id:
              'subtask-1-1-2',

            order: 2,

            title:
              'Elaboração do relatório técnico preliminar',

            status:
              'Em andamento',

            progress: 70,

            responsible:
              'João Silva',

            tags: [
              'Prioridade',
            ],

            deliveryDate:
              '15/09/2025',

            type:
              'Documentação',
          },
        ],
      },


      // ---------------------------------------------------
      // TAREFA 2
      // ---------------------------------------------------

      {
        id: 'task-1-2',

        order: 2,

        title:
          'Execução da Migração de Infraestrutura',

        status:
          'Não iniciado',

        tags: [
          'Dependência de terceiros',
        ],

        progress: 20,

        responsible:
          'Maria Souza',

        deliveryDate:
          '25/09/2025',

        type:
          'Desenvolvimento',

        subtasks: [
          {
            id:
              'subtask-1-2-1',

            order: 1,

            title:
              'Substituição dos switches core do datacenter',

            status:
              'Não iniciado',

            progress: 0,

            responsible:
              'Maria Souza',

            tags: [
              'Dependência de terceiros',
            ],

            deliveryDate:
              '20/09/2025',

            type:
              'Parametrização',
          },
        ],
      },


      // ---------------------------------------------------
      // TAREFA 3
      // ---------------------------------------------------

      {
        id: 'task-1-3',

        order: 3,

        title:
          'Validação e Homologação da Infraestrutura',

        status:
          'Homologação',

        tags: [],

        progress: 60,

        responsible:
          'Carlos Lima',

        deliveryDate:
          '30/09/2025',

        type:
          'Parametrização',

        subtasks: [
          {
            id:
              'subtask-1-3-1',

            order: 1,

            title:
              'Validação técnica do ambiente',

            status:
              'Homologação',

            progress: 60,

            responsible:
              'Carlos Lima',

            tags: [],

            deliveryDate:
              '28/09/2025',

            type:
              'Parametrização',
          },
        ],
      },
    ],


    // =====================================================
    // HISTÓRICO
    // =====================================================

    history: [
      {
        id: 'history-1',

        type:
          'status_changed',

        title:
          'Status da tarefa alterado',

        description:
          'A tarefa "Diagnóstico e Levantamento de Ativos de TI" foi alterada de Não iniciado para Em andamento.',

        user:
          'João Silva',

        createdAt:
          '2026-09-09T09:42:00',

        metadata: {
          previousValue:
            'Não iniciado',

          newValue:
            'Em andamento',

          taskId:
            'task-1-1',

          taskTitle:
            'Diagnóstico e Levantamento de Ativos de TI',
        },
      },

      {
        id: 'history-2',

        type:
          'progress_changed',

        title:
          'Progresso atualizado',

        description:
          'O progresso da tarefa "Diagnóstico e Levantamento de Ativos de TI" foi alterado de 50% para 80%.',

        user:
          'João Silva',

        createdAt:
          '2026-09-09T09:35:00',

        metadata: {
          previousValue:
            '50%',

          newValue:
            '80%',

          taskId:
            'task-1-1',

          taskTitle:
            'Diagnóstico e Levantamento de Ativos de TI',
        },
      },

      {
        id: 'history-3',

        type:
          'task_created',

        title:
          'Tarefa criada',

        description:
          'A tarefa "Validação e Homologação da Infraestrutura" foi adicionada ao projeto.',

        user:
          'Carlos Lima',

        createdAt:
          '2026-09-08T15:20:00',

        metadata: {
          taskId:
            'task-1-3',

          taskTitle:
            'Validação e Homologação da Infraestrutura',
        },
      },

      {
        id: 'history-4',

        type:
          'tag_added',

        title:
          'Etiqueta adicionada',

        description:
          'A etiqueta "Prioridade" foi adicionada à tarefa "Diagnóstico e Levantamento de Ativos de TI".',

        user:
          'João Silva',

        createdAt:
          '2026-09-08T14:15:00',

        metadata: {
          newValue:
            'Prioridade',

          taskId:
            'task-1-1',

          taskTitle:
            'Diagnóstico e Levantamento de Ativos de TI',
        },
      },

      {
        id: 'history-5',

        type:
          'project_created',

        title:
          'Projeto criado',

        description:
          'O projeto PROJ-01 — Modernização da Infraestrutura de Rede e Data Center foi criado.',

        user:
          'João Silva',

        createdAt:
          '2026-09-05T10:00:00',
      },
    ],
  },


  // -------------------------------------------------------
  // PROJ-02
  // -------------------------------------------------------

  {
    id: '2',

    code:
      'PROJ-02',

    title:
      'Renovação do Parque de Equipamentos de TI',

    tags: [
      'Prioridade',
    ],

    status:
      'Pausado',

    progress:
      25,

    deliveryDate:
      '15/12/2025',

    responsible:
      'Maria Souza',

    tasks: [
      {
        id:
          'task-2-1',

        order:
          1,

        title:
          'Levantamento dos equipamentos existentes',

        status:
          'Em andamento',

        progress:
          40,

        responsible:
          'Maria Souza',

        tags: [],

        subtasks: [
          {
            id:
              'subtask-2-1-1',

            order:
              1,

            title:
              'Mapear equipamentos por unidade',

            status:
              'Em andamento',

            progress:
              50,

            responsible:
              'Maria Souza',

            tags: [],
          },

          {
            id:
              'subtask-2-1-2',

            order:
              2,

            title:
              'Consolidar relatório patrimonial',

            status:
              'Não iniciado',

            progress:
              0,

            responsible:
              'Maria Souza',

            tags: [],
          },
        ],
      },

      {
        id:
          'task-2-2',

        order:
          2,

        title:
          'Planejamento da aquisição',

        status:
          'Não iniciado',

        progress:
          0,

        responsible:
          'Rafael Oliveira',

        tags: [
          'Dependência de terceiros',
        ],

        subtasks: [
          {
            id:
              'subtask-2-2-1',

            order:
              1,

            title:
              'Definir especificações técnicas',

            status:
              'Não iniciado',

            progress:
              0,

            responsible:
              'Rafael Oliveira',

            tags: [],
          },
        ],
      },
    ],

    history: [
      {
        id:
          'history-2-1',

        type:
          'project_created',

        title:
          'Projeto criado',

        description:
          'O projeto PROJ-02 — Renovação do Parque de Equipamentos de TI foi criado.',

        user:
          'Maria Souza',

        createdAt:
          '2026-08-20T09:00:00',
      },
    ],
  },


  // -------------------------------------------------------
  // PROJ-03
  // -------------------------------------------------------

  {
    id:
      '3',

    code:
      'PROJ-03',

    title:
      'Implantação de Novo Sistema de Gestão',

    tags: [],

    status:
      'Em andamento',

    progress:
      45,

    deliveryDate:
      '20/11/2025',

    responsible:
      'Carlos Lima',

    tasks: [
      {
        id:
          'task-3-1',

        order:
          1,

        title:
          'Levantamento de requisitos',

        status:
          'Concluído',

        progress:
          100,

        responsible:
          'Carlos Lima',

        tags: [],

        subtasks: [
          {
            id:
              'subtask-3-1-1',

            order:
              1,

            title:
              'Entrevistas com as áreas responsáveis',

            status:
              'Concluído',

            progress:
              100,

            responsible:
              'Carlos Lima',

            tags: [],
          },
        ],
      },

      {
        id:
          'task-3-2',

        order:
          2,

        title:
          'Desenvolvimento do módulo principal',

        status:
          'Em andamento',

        progress:
          55,

        responsible:
          'Carlos Lima',

        tags: [
          'Prioridade',
        ],

        type:
          'Desenvolvimento',
      },
    ],

    history: [
      {
        id:
          'history-3-1',

        type:
          'project_created',

        title:
          'Projeto criado',

        description:
          'O projeto PROJ-03 — Implantação de Novo Sistema de Gestão foi criado.',

        user:
          'Carlos Lima',

        createdAt:
          '2026-08-12T11:30:00',
      },
    ],
  },


  // -------------------------------------------------------
  // PROJ-04
  // -------------------------------------------------------

  {
    id:
      '4',

    code:
      'PROJ-04',

    title:
      'Aquisição de Equipamentos de Segurança',

    tags: [],

    status:
      'Concluído',

    progress:
      100,

    deliveryDate:
      '10/08/2025',

    responsible:
      'Ana Costa',

    tasks: [
      {
        id:
          'task-4-1',

        order:
          1,

        title:
          'Aquisição dos equipamentos',

        status:
          'Concluído',

        progress:
          100,

        responsible:
          'Ana Costa',

        tags: [],

        subtasks: [
          {
            id:
              'subtask-4-1-1',

            order:
              1,

            title:
              'Definição das especificações',

            status:
              'Concluído',

            progress:
              100,

            responsible:
              'Ana Costa',

            tags: [],
          },

          {
            id:
              'subtask-4-1-2',

            order:
              2,

            title:
              'Recebimento e conferência',

            status:
              'Concluído',

            progress:
              100,

            responsible:
              'Ana Costa',

            tags: [],
          },
        ],
      },
    ],

    history: [
      {
        id:
          'history-4-1',

        type:
          'project_created',

        title:
          'Projeto criado',

        description:
          'O projeto PROJ-04 — Aquisição de Equipamentos de Segurança foi criado.',

        user:
          'Ana Costa',

        createdAt:
          '2026-07-01T08:30:00',
      },

      {
        id:
          'history-4-2',

        type:
          'status_changed',

        title:
          'Projeto concluído',

        description:
          'O projeto foi alterado de Em andamento para Concluído.',

        user:
          'Ana Costa',

        createdAt:
          '2026-08-10T17:15:00',

        metadata: {
          previousValue:
            'Em andamento',

          newValue:
            'Concluído',
        },
      },
    ],
  },
];


// =========================================================
// PROJETOS COMPARTILHADOS COMIGO
// =========================================================

export const sharedProjects: Project[] = [

  // -------------------------------------------------------
  // PROJ-05
  // -------------------------------------------------------

  {
    id:
      '5',

    code:
      'PROJ-05',

    title:
      'Portal Integrado de Serviços',

    tags: [
      'Prioridade',
    ],

    status:
      'Em andamento',

    progress:
      72,

    deliveryDate:
      '15/11/2025',

    responsible:
      'Fernanda Costa',

    accessLevel:
      'Colaborador',

    tasks: [
      {
        id:
          'task-5-1',

        order:
          1,

        title:
          'Integração dos serviços institucionais',

        status:
          'Em andamento',

        progress:
          72,

        responsible:
          'Fernanda Costa',

        tags: [
          'Prioridade',
        ],
      },
    ],

    history: [
      {
        id:
          'history-5-1',

        type:
          'project_created',

        title:
          'Projeto criado',

        description:
          'O projeto PROJ-05 — Portal Integrado de Serviços foi criado.',

        user:
          'Fernanda Costa',

        createdAt:
          '2026-08-01T09:00:00',
      },
    ],
  },


  // -------------------------------------------------------
  // PROJ-06
  // -------------------------------------------------------

  {
    id:
      '6',

    code:
      'PROJ-06',

    title:
      'Integração de Sistemas Institucionais',

    tags: [
      'Dependência de terceiros',
    ],

    status:
      'Em andamento',

    progress:
      48,

    deliveryDate:
      '30/01/2026',

    responsible:
      'Rafael Oliveira',

    accessLevel:
      'Editor',

    tasks: [
      {
        id:
          'task-6-1',

        order:
          1,

        title:
          'Mapeamento das integrações',

        status:
          'Em andamento',

        progress:
          48,

        responsible:
          'Rafael Oliveira',

        tags: [
          'Dependência de terceiros',
        ],
      },
    ],

    history: [
      {
        id:
          'history-6-1',

        type:
          'project_created',

        title:
          'Projeto criado',

        description:
          'O projeto PROJ-06 — Integração de Sistemas Institucionais foi criado.',

        user:
          'Rafael Oliveira',

        createdAt:
          '2026-08-05T10:20:00',
      },
    ],
  },


  // -------------------------------------------------------
  // PROJ-07
  // -------------------------------------------------------

  {
    id:
      '7',

    code:
      'PROJ-07',

    title:
      'Modernização dos Serviços Digitais',

    tags: [],

    status:
      'Pausado',

    progress:
      35,

    deliveryDate:
      '20/02/2026',

    responsible:
      'Amanda Souza',

    accessLevel:
      'Visualizador',

    tasks: [
      {
        id:
          'task-7-1',

        order:
          1,

        title:
          'Mapeamento dos serviços existentes',

        status:
          'Em andamento',

        progress:
          35,

        responsible:
          'Amanda Souza',

        tags: [],
      },
    ],

    history: [
      {
        id:
          'history-7-1',

        type:
          'project_created',

        title:
          'Projeto criado',

        description:
          'O projeto PROJ-07 — Modernização dos Serviços Digitais foi criado.',

        user:
          'Amanda Souza',

        createdAt:
          '2026-08-10T14:00:00',
      },
    ],
  },
];


// =========================================================
// CARDS DE RESUMO
// =========================================================

export const summaryCardsByTab: Record<
  string,
  SummaryCardData[]
> = {

  // -------------------------------------------------------
  // MEUS PROJETOS
  // -------------------------------------------------------

  mine: [
    {
      id:
        'total',

      label:
        'Projetos',

      value:
        4,

      description:
        'Total de projetos vinculados a você',

      color:
        'blue',
    },

    {
      id:
        'active',

      label:
        'Em andamento',

      value:
        1,

      description:
        'Projetos em execução',

      color:
        'amber',
    },

    {
      id:
        'done',

      label:
        'Concluído',

      value:
        1,

      description:
        'Finalizado',

      color:
        'green',
    },

    {
      id:
        'late',

      label:
        'Atrasado',

      value:
        1,

      description:
        'Fora do prazo',

      color:
        'red',
    },
  ],


  // -------------------------------------------------------
  // COMPARTILHADOS COMIGO
  // -------------------------------------------------------

  shared: [
    {
      id:
        'total',

      label:
        'Projetos',

      value:
        3,

      description:
        'Projetos compartilhados com você',

      color:
        'blue',
    },

    {
      id:
        'active',

      label:
        'Em andamento',

      value:
        2,

      description:
        'Projetos em execução',

      color:
        'amber',
    },

    {
      id:
        'done',

      label:
        'Concluído',

      value:
        0,

      description:
        'Finalizado',

      color:
        'green',
    },

    {
      id:
        'late',

      label:
        'Atrasado',

      value:
        0,

      description:
        'Fora do prazo',

      color:
        'red',
    },
  ],


  // -------------------------------------------------------
  // PLANEJAMENTO ESTRATÉGICO
  // -------------------------------------------------------

  strategic: [
    {
      id:
        'total',

      label:
        'Eixos',

      value:
        6,

      description:
        'Eixos estratégicos do plano',

      color:
        'blue',
    },

    {
      id:
        'active',

      label:
        'Projetos',

      value:
        32,

      description:
        'Projetos vinculados',

      color:
        'amber',
    },

    {
      id:
        'done',

      label:
        'Concluído',

      value:
        12,

      description:
        'Projetos finalizados',

      color:
        'green',
    },

    {
      id:
        'late',

      label:
        'Atrasado',

      value:
        5,

      description:
        'Fora do prazo',

      color:
        'red',
    },
  ],
};


// =========================================================
// PLANEJAMENTO ESTRATÉGICO
// =========================================================

export const strategicAxes: StrategicAxis[] = [

  // -------------------------------------------------------
  // EIXO 1
  // -------------------------------------------------------

  {
    id:
      'axis-1',

    number:
      1,

    name:
      'Administração e Finanças',

    acronym:
      'PAF',

    projectCount:
      3,

    projects: [
      {
        code:
          'PROJ-10',

        title:
          'Otimização de Processos Financeiros',

        status:
          'Em andamento',

        progress:
          68,

        responsible:
          'Paulo Mendes',
      },

      {
        code:
          'PROJ-11',

        title:
          'Gestão de Contratos e Convênios',

        status:
          'Concluído',

        progress:
          100,

        responsible:
          'Lucia Ferreira',
      },

      {
        code:
          'PROJ-12',

        title:
          'Modernização da Contabilidade',

        status:
          'Em andamento',

        progress:
          42,

        responsible:
          'Roberto Alves',
      },
    ],
  },


  // -------------------------------------------------------
  // EIXO 2
  // -------------------------------------------------------

  {
    id:
      'axis-2',

    number:
      2,

    name:
      'Gestão de Dados e Automação',

    acronym:
      'PDA',

    projectCount:
      7,

    projects: [
      {
        code:
          'PROJ-20',

        title:
          'Implementação de Governança de Dados',

        status:
          'Em andamento',

        progress:
          55,

        responsible:
          'Fernanda Costa',
      },

      {
        code:
          'PROJ-21',

        title:
          'Automação de Relatórios Gerenciais',

        status:
          'Em andamento',

        progress:
          80,

        responsible:
          'Rafael Oliveira',
      },

      {
        code:
          'PROJ-22',

        title:
          'Central de Indicadores',

        status:
          'Pausado',

        progress:
          30,

        responsible:
          'Amanda Souza',
      },

      {
        code:
          'PROJ-23',

        title:
          'Padronização de Banco de Dados',

        status:
          'Em andamento',

        progress:
          62,

        responsible:
          'Carlos Lima',
      },
    ],
  },


  // -------------------------------------------------------
  // EIXO 3
  // -------------------------------------------------------

  {
    id:
      'axis-3',

    number:
      3,

    name:
      'Planejamento Estratégico e Governança',

    acronym:
      'PEG',

    projectCount:
      8,

    projects: [
      {
        code:
          'PROJ-30',

        title:
          'Revisão do Plano Estratégico',

        status:
          'Em andamento',

        progress:
          75,

        responsible:
          'Juliana Prado',
      },

      {
        code:
          'PROJ-31',

        title:
          'Implementação de Gestão por Resultados',

        status:
          'Em andamento',

        progress:
          50,

        responsible:
          'Marcelo Dias',
      },

      {
        code:
          'PROJ-32',

        title:
          'Comitê de Governança',

        status:
          'Concluído',

        progress:
          100,

        responsible:
          'Patrícia Gomes',
      },
    ],
  },


  // -------------------------------------------------------
  // EIXO 4
  // -------------------------------------------------------

  {
    id:
      'axis-4',

    number:
      4,

    name:
      'Infraestrutura e Serviços',

    acronym:
      'PIS',

    projectCount:
      6,

    projects: [
      {
        code:
          'PROJ-40',

        title:
          'Modernização da Infraestrutura de Rede',

        status:
          'Atrasado',

        progress:
          67,

        responsible:
          'João Silva',
      },

      {
        code:
          'PROJ-41',

        title:
          'Adequação do Data Center',

        status:
          'Em andamento',

        progress:
          45,

        responsible:
          'Maria Souza',
      },

      {
        code:
          'PROJ-42',

        title:
          'Renovação de Equipamentos de TI',

        status:
          'Pausado',

        progress:
          25,

        responsible:
          'Carlos Lima',
      },
    ],
  },


  // -------------------------------------------------------
  // EIXO 5
  // -------------------------------------------------------

  {
    id:
      'axis-5',

    number:
      5,

    name:
      'Soluções Digitais',

    acronym:
      'PSD',

    projectCount:
      8,

    projects: [
      {
        code:
          'PROJ-50',

        title:
          'Portal Integrado de Serviços',

        status:
          'Em andamento',

        progress:
          72,

        responsible:
          'Fernanda Costa',
      },

      {
        code:
          'PROJ-51',

        title:
          'Integração de Sistemas Institucionais',

        status:
          'Em andamento',

        progress:
          48,

        responsible:
          'Rafael Oliveira',
      },

      {
        code:
          'PROJ-52',

        title:
          'Modernização dos Serviços Digitais',

        status:
          'Pausado',

        progress:
          35,

        responsible:
          'Amanda Souza',
      },

      {
        code:
          'PROJ-53',

        title:
          'App de Atendimento ao Cidadão',

        status:
          'Em andamento',

        progress:
          58,

        responsible:
          'Pedro Santos',
      },
    ],
  },


  // -------------------------------------------------------
  // EIXO 6
  // -------------------------------------------------------

  {
    id:
      'axis-6',

    number:
      6,

    name:
      'Segurança da Informação',

    acronym:
      'PSI',

    projectCount:
      0,

    projects: [],
  },
];