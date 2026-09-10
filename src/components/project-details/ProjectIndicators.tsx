import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    CircleDashed,
    Clock3,
    ListChecks,
    ShieldCheck,
    TrendingUp,
    Users,
  } from 'lucide-react';
  
  import type {
    Project,
    ProjectSubtask,
    TaskStatusType,
  } from '@/data/projects';
  
  
  /* ============================================================
     PROPRIEDADES
     ============================================================ */
  
  interface ProjectIndicatorsProps {
    projeto: Project;
  }
  
  
  /* ============================================================
     CONFIGURAÇÃO DOS STATUS
     ============================================================ */
  
  const configuracaoStatus: Record<
    TaskStatusType,
    {
      label: string;
      corTexto: string;
      corFundo: string;
      corBarra: string;
    }
  > = {
    'Não iniciado': {
      label: 'Não iniciado',
      corTexto: 'text-slate-600',
      corFundo: 'bg-slate-100',
      corBarra: 'bg-slate-400',
    },
  
    'Em andamento': {
      label: 'Em andamento',
      corTexto: 'text-blue-700',
      corFundo: 'bg-blue-50',
      corBarra: 'bg-blue-500',
    },
  
    Homologação: {
      label: 'Homologação',
      corTexto: 'text-amber-700',
      corFundo: 'bg-amber-50',
      corBarra: 'bg-amber-500',
    },
  
    Concluído: {
      label: 'Concluído',
      corTexto: 'text-green-700',
      corFundo: 'bg-green-50',
      corBarra: 'bg-green-500',
    },
  };
  
  
  /* ============================================================
     COMPONENTE PRINCIPAL
     ============================================================ */
  
  export default function ProjectIndicators({
    projeto,
  }: ProjectIndicatorsProps) {
  
  
    /* ==========================================================
       TAREFAS
       ========================================================== */
  
    const tarefas =
      projeto.tasks ?? [];
  
  
    /* ==========================================================
       SUBTAREFAS
       ========================================================== */
  
    const subtarefas: ProjectSubtask[] =
      tarefas.flatMap(
        (tarefa) =>
          tarefa.subtasks ?? []
      );
  
  
    /* ==========================================================
       RESUMO DAS TAREFAS
       ========================================================== */
  
    const totalTarefas =
      tarefas.length;
  
  
    const tarefasConcluidas =
      tarefas.filter(
        (tarefa) =>
          tarefa.status ===
          'Concluído'
      ).length;
  
  
    const tarefasPendentes =
      totalTarefas -
      tarefasConcluidas;
  
  
    /* ==========================================================
       RESUMO DAS SUBTAREFAS
       ========================================================== */
  
    const totalSubtarefas =
      subtarefas.length;
  
  
    const subtarefasConcluidas =
      subtarefas.filter(
        (subtarefa) =>
          subtarefa.status ===
          'Concluído'
      ).length;
  
  
    const subtarefasEmAndamento =
      subtarefas.filter(
        (subtarefa) =>
          subtarefa.status ===
          'Em andamento'
      ).length;
  
  
    const subtarefasHomologacao =
      subtarefas.filter(
        (subtarefa) =>
          subtarefa.status ===
          'Homologação'
      ).length;
  
  
    const subtarefasNaoIniciadas =
      subtarefas.filter(
        (subtarefa) =>
          subtarefa.status ===
          'Não iniciado'
      ).length;
  
  
    /* ==========================================================
       SUBTAREFAS COM IMPEDIMENTO
       ========================================================== */
  
    const subtarefasComImpedimento =
      subtarefas.filter(
        (subtarefa) =>
          (
            subtarefa.tags ??
            []
          ).includes(
            'Impedimento'
          )
      ).length;
  
  
    /* ==========================================================
       PROGRESSO CALCULADO PELAS SUBTAREFAS
       ==========================================================
  
       Se existirem subtarefas, usamos a média delas.
  
       Caso contrário, usamos o progresso do próprio projeto.
       ========================================================== */
  
    const progressoCalculado =
      totalSubtarefas > 0
  
        ? Math.round(
            subtarefas.reduce(
              (
                total,
                subtarefa
              ) =>
                total +
                (
                  subtarefa.progress ??
                  0
                ),
  
              0
            ) /
            totalSubtarefas
          )
  
        : projeto.progress;
  
  
    /* ==========================================================
       RESPONSÁVEIS
       ========================================================== */
  
    const responsaveis =
      Array.from(
        new Set(
          [
            ...tarefas.map(
              (tarefa) =>
                tarefa.responsible
            ),
  
            ...subtarefas.map(
              (subtarefa) =>
                subtarefa.responsible
            ),
          ].filter(Boolean)
        )
      );
  
  
    /* ==========================================================
       DISTRIBUIÇÃO DOS STATUS
       ========================================================== */
  
    const statusDisponiveis: TaskStatusType[] = [
      'Não iniciado',
      'Em andamento',
      'Homologação',
      'Concluído',
    ];
  
  
    /* ==========================================================
       INTERFACE
       ========================================================== */
  
    return (
  
      <div className="space-y-6">
  
  
        {/* ======================================================
            CABEÇALHO
            ====================================================== */}
  
        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-gray-200
            pb-5
            xl:flex-row
            xl:items-start
            xl:justify-between
          "
        >
  
          <div>
  
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
  
              <Activity
                className="
                  h-5
                  w-5
                  text-institution-600
                "
              />
  
  
              <h2
                className="
                  text-lg
                  font-semibold
                  text-gray-800
                "
              >
                Indicadores do Projeto
              </h2>
  
            </div>
  
  
            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Visão executiva do andamento de{' '}
  
              <span
                className="
                  font-semibold
                  text-gray-700
                "
              >
                {projeto.code}
              </span>.
            </p>
  
          </div>
  
  
          {/* ====================================================
              STATUS GERAL
              ==================================================== */}
  
          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              px-5
              py-3
              shadow-sm
            "
          >
  
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-gray-400
              "
            >
              Status atual
            </p>
  
  
            <div
              className="
                mt-1
                flex
                items-center
                gap-2
              "
            >
  
              <span
                className="
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-institution-500
                "
              />
  
  
              <span
                className="
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                {projeto.status}
              </span>
  
            </div>
  
          </div>
  
        </div>
  
  
        {/* ======================================================
            PROGRESSO GERAL
            ====================================================== */}
  
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
  
          <div
            className="
              flex
              flex-col
              gap-5
              p-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
  
            <div className="min-w-0 flex-1">
  
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
  
                <TrendingUp
                  className="
                    h-5
                    w-5
                    text-institution-600
                  "
                />
  
  
                <h3
                  className="
                    text-base
                    font-semibold
                    text-gray-800
                  "
                >
                  Progresso geral
                </h3>
  
              </div>
  
  
              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                Calculado com base no avanço das subtarefas.
              </p>
  
  
              <div className="mt-5">
  
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "
                >
  
                  <span
                    className="
                      text-xs
                      font-medium
                      text-gray-500
                    "
                  >
                    Execução do projeto
                  </span>
  
  
                  <span
                    className="
                      text-sm
                      font-bold
                      text-institution-700
                    "
                  >
                    {progressoCalculado}%
                  </span>
  
                </div>
  
  
                <div
                  className="
                    h-3
                    overflow-hidden
                    rounded-full
                    bg-gray-100
                  "
                >
  
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-institution-600
                      transition-all
                      duration-500
                    "
                    style={{
                      width:
                        `${Math.min(
                          Math.max(
                            progressoCalculado,
                            0
                          ),
                          100
                        )}%`,
                    }}
                  />
  
                </div>
  
              </div>
  
            </div>
  
  
            <div
              className="
                flex
                h-24
                w-24
                flex-shrink-0
                items-center
                justify-center
                rounded-full
                border-8
                border-institution-100
                bg-institution-50
              "
            >
  
              <span
                className="
                  text-2xl
                  font-bold
                  text-institution-700
                "
              >
                {progressoCalculado}%
              </span>
  
            </div>
  
          </div>
  
        </div>
  
  
        {/* ======================================================
            CARDS EXECUTIVOS
            ====================================================== */}
  
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
  
  
          {/* TOTAL */}
  
          <CardIndicador
            titulo="Total de tarefas"
            valor={totalTarefas}
            descricao={`${totalSubtarefas} subtarefas vinculadas`}
            Icone={ListChecks}
            fundo="bg-blue-50"
            corIcone="text-blue-600"
          />
  
  
          {/* CONCLUÍDAS */}
  
          <CardIndicador
            titulo="Tarefas concluídas"
            valor={tarefasConcluidas}
            descricao={`${tarefasPendentes} ainda pendentes`}
            Icone={CheckCircle2}
            fundo="bg-green-50"
            corIcone="text-green-600"
          />
  
  
          {/* IMPEDIMENTOS */}
  
          <CardIndicador
            titulo="Com impedimento"
            valor={subtarefasComImpedimento}
            descricao="Necessitam acompanhamento"
            Icone={AlertTriangle}
            fundo="bg-orange-50"
            corIcone="text-orange-600"
          />
  
  
          {/* RESPONSÁVEIS */}
  
          <CardIndicador
            titulo="Responsáveis"
            valor={responsaveis.length}
            descricao="Pessoas envolvidas na execução"
            Icone={Users}
            fundo="bg-violet-50"
            corIcone="text-violet-600"
          />
  
        </div>
  
  
        {/* ======================================================
            DISTRIBUIÇÃO DAS SUBTAREFAS
            ====================================================== */}
  
        <div
          className="
            grid
            grid-cols-1
            gap-5
            xl:grid-cols-3
          "
        >
  
  
          {/* ====================================================
              STATUS
              ==================================================== */}
  
          <div
            className="
              overflow-hidden
              rounded-xl
              border
              border-gray-200
              bg-white
              shadow-sm
              xl:col-span-2
            "
          >
  
            <div
              className="
                border-b
                border-gray-100
                px-5
                py-4
              "
            >
  
              <h3
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                Distribuição das subtarefas
              </h3>
  
  
              <p
                className="
                  mt-1
                  text-xs
                  text-gray-400
                "
              >
                Situação atual dos itens executáveis do projeto.
              </p>
  
            </div>
  
  
            <div
              className="
                space-y-5
                p-5
              "
            >
  
              {statusDisponiveis.map(
                (status) => {
  
  
                  const quantidade =
                    subtarefas.filter(
                      (subtarefa) =>
                        subtarefa.status ===
                        status
                    ).length;
  
  
                  const percentual =
                    totalSubtarefas > 0
  
                      ? Math.round(
                          (
                            quantidade /
                            totalSubtarefas
                          ) *
                          100
                        )
  
                      : 0;
  
  
                  const configuracao =
                    configuracaoStatus[
                      status
                    ];
  
  
                  return (
  
                    <div
                      key={
                        status
                      }
                    >
  
                      <div
                        className="
                          mb-2
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >
  
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >
  
                          <span
                            className={`
                              h-2.5
                              w-2.5
                              rounded-full
  
                              ${configuracao.corBarra}
                            `}
                          />
  
  
                          <span
                            className="
                              text-sm
                              font-medium
                              text-gray-600
                            "
                          >
                            {status}
                          </span>
  
                        </div>
  
  
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >
  
                          <span
                            className="
                              text-xs
                              text-gray-400
                            "
                          >
                            {quantidade}
                          </span>
  
  
                          <span
                            className="
                              w-10
                              text-right
                              text-xs
                              font-semibold
                              text-gray-600
                            "
                          >
                            {percentual}%
                          </span>
  
                        </div>
  
                      </div>
  
  
                      <div
                        className="
                          h-2
                          overflow-hidden
                          rounded-full
                          bg-gray-100
                        "
                      >
  
                        <div
                          className={`
                            h-full
                            rounded-full
                            transition-all
  
                            ${configuracao.corBarra}
                          `}
                          style={{
                            width:
                              `${percentual}%`,
                          }}
                        />
  
                      </div>
  
                    </div>
  
                  );
  
                }
              )}
  
            </div>
  
          </div>
  
  
          {/* ====================================================
              RESUMO OPERACIONAL
              ==================================================== */}
  
          <div
            className="
              overflow-hidden
              rounded-xl
              border
              border-gray-200
              bg-white
              shadow-sm
            "
          >
  
            <div
              className="
                border-b
                border-gray-100
                px-5
                py-4
              "
            >
  
              <h3
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                Resumo operacional
              </h3>
  
  
              <p
                className="
                  mt-1
                  text-xs
                  text-gray-400
                "
              >
                Visão rápida da execução.
              </p>
  
            </div>
  
  
            <div
              className="
                divide-y
                divide-gray-100
              "
            >
  
              <ResumoOperacional
                Icone={CheckCircle2}
                titulo="Concluídas"
                valor={subtarefasConcluidas}
                corIcone="text-green-600"
                fundoIcone="bg-green-50"
              />
  
  
              <ResumoOperacional
                Icone={Clock3}
                titulo="Em andamento"
                valor={subtarefasEmAndamento}
                corIcone="text-blue-600"
                fundoIcone="bg-blue-50"
              />
  
  
              <ResumoOperacional
                Icone={ShieldCheck}
                titulo="Em homologação"
                valor={subtarefasHomologacao}
                corIcone="text-amber-600"
                fundoIcone="bg-amber-50"
              />
  
  
              <ResumoOperacional
                Icone={CircleDashed}
                titulo="Não iniciadas"
                valor={subtarefasNaoIniciadas}
                corIcone="text-slate-500"
                fundoIcone="bg-slate-100"
              />
  
            </div>
  
          </div>
  
        </div>
  
  
        {/* ======================================================
            SITUAÇÃO DAS TAREFAS
            ====================================================== */}
  
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
  
          <div
            className="
              border-b
              border-gray-100
              px-5
              py-4
            "
          >
  
            <h3
              className="
                text-sm
                font-semibold
                text-gray-800
              "
            >
              Andamento por tarefa
            </h3>
  
  
            <p
              className="
                mt-1
                text-xs
                text-gray-400
              "
            >
              Acompanhe o progresso de cada etapa principal do projeto.
            </p>
  
          </div>
  
  
          {tarefas.length === 0 ? (
  
            <div
              className="
                px-6
                py-12
                text-center
                text-sm
                text-gray-400
              "
            >
              Nenhuma tarefa cadastrada.
            </div>
  
          ) : (
  
            <div
              className="
                divide-y
                divide-gray-100
              "
            >
  
              {tarefas.map(
                (tarefa) => {
  
  
                  const quantidadeSubtarefas =
                    tarefa.subtasks?.length ??
                    0;
  
  
                  const concluidasDaTarefa =
                    (
                      tarefa.subtasks ??
                      []
                    ).filter(
                      (subtarefa) =>
                        subtarefa.status ===
                        'Concluído'
                    ).length;
  
  
                  const configuracao =
                    configuracaoStatus[
                      tarefa.status
                    ];
  
  
                  return (
  
                    <div
                      key={
                        tarefa.id
                      }
  
                      className="
                        flex
                        flex-col
                        gap-4
                        px-5
                        py-4
                        lg:flex-row
                        lg:items-center
                      "
                    >
  
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          flex-shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-institution-50
                          text-xs
                          font-bold
                          text-institution-700
                        "
                      >
                        {tarefa.order}
                      </div>
  
  
                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
  
                        <p
                          className="
                            text-sm
                            font-semibold
                            text-gray-700
                          "
                        >
                          {tarefa.title}
                        </p>
  
  
                        <p
                          className="
                            mt-1
                            text-xs
                            text-gray-400
                          "
                        >
                          {concluidasDaTarefa} de{' '}
                          {quantidadeSubtarefas}{' '}
                          subtarefas concluídas
                        </p>
  
                      </div>
  
  
                      <span
                        className={`
                          inline-flex
                          items-center
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-medium
  
                          ${configuracao.corFundo}
                          ${configuracao.corTexto}
                        `}
                      >
                        {tarefa.status}
                      </span>
  
  
                      <div
                        className="
                          w-full
                          lg:w-40
                        "
                      >
  
                        <div
                          className="
                            mb-1
                            flex
                            items-center
                            justify-between
                          "
                        >
  
                          <span
                            className="
                              text-[10px]
                              text-gray-400
                            "
                          >
                            Progresso
                          </span>
  
  
                          <span
                            className="
                              text-[10px]
                              font-bold
                              text-gray-600
                            "
                          >
                            {tarefa.progress}%
                          </span>
  
                        </div>
  
  
                        <div
                          className="
                            h-1.5
                            overflow-hidden
                            rounded-full
                            bg-gray-100
                          "
                        >
  
                          <div
                            className={`
                              h-full
                              rounded-full
  
                              ${configuracao.corBarra}
                            `}
                            style={{
                              width:
                                `${Math.min(
                                  Math.max(
                                    tarefa.progress,
                                    0
                                  ),
                                  100
                                )}%`,
                            }}
                          />
  
                        </div>
  
                      </div>
  
                    </div>
  
                  );
  
                }
              )}
  
            </div>
  
          )}
  
        </div>
  
      </div>
  
    );
  }
  
  
  /* ============================================================
     CARD DE INDICADOR
     ============================================================ */
  
  function CardIndicador({
    titulo,
    valor,
    descricao,
    Icone,
    fundo,
    corIcone,
  }: {
    titulo: string;
  
    valor: number;
  
    descricao: string;
  
    Icone: typeof Activity;
  
    fundo: string;
  
    corIcone: string;
  }) {
  
    return (
  
      <div
        className="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
          transition-all
          hover:border-institution-200
          hover:shadow-md
        "
      >
  
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
  
          <div>
  
            <p
              className="
                text-xs
                font-medium
                text-gray-500
              "
            >
              {titulo}
            </p>
  
  
            <p
              className="
                mt-2
                text-2xl
                font-bold
                tracking-tight
                text-gray-800
              "
            >
              {valor}
            </p>
  
          </div>
  
  
          <div
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
  
              ${fundo}
            `}
          >
  
            <Icone
              className={`
                h-5
                w-5
  
                ${corIcone}
              `}
            />
  
          </div>
  
        </div>
  
  
        <p
          className="
            mt-3
            text-xs
            leading-relaxed
            text-gray-400
          "
        >
          {descricao}
        </p>
  
      </div>
  
    );
  }
  
  
  /* ============================================================
     ITEM DO RESUMO OPERACIONAL
     ============================================================ */
  
  function ResumoOperacional({
    Icone,
    titulo,
    valor,
    corIcone,
    fundoIcone,
  }: {
    Icone: typeof Activity;
  
    titulo: string;
  
    valor: number;
  
    corIcone: string;
  
    fundoIcone: string;
  }) {
  
    return (
  
      <div
        className="
          flex
          items-center
          gap-3
          px-5
          py-4
        "
      >
  
        <div
          className={`
            flex
            h-9
            w-9
            flex-shrink-0
            items-center
            justify-center
            rounded-lg
  
            ${fundoIcone}
          `}
        >
  
          <Icone
            className={`
              h-4
              w-4
  
              ${corIcone}
            `}
          />
  
        </div>
  
  
        <div className="min-w-0 flex-1">
  
          <p
            className="
              text-xs
              text-gray-400
            "
          >
            {titulo}
          </p>
  
        </div>
  
  
        <span
          className="
            text-lg
            font-bold
            text-gray-700
          "
        >
          {valor}
        </span>
  
      </div>
  
    );
  }