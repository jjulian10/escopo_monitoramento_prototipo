import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import {
  Columns3,
  Search,
  X,
  FolderKanban,
  AlertTriangle,
  CheckCircle2,
  ListChecks,
  Layers3,
} from 'lucide-react';

import type {
  Project,
  ProjectTask,
  StatusType,
} from '@/data/projects';

import ProjectKanbanColumn from './ProjectKanbanColumn';

import ProjectKanbanCard from './ProjectKanbanCard';


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface GlobalProjectKanbanProps {
  projetos: Project[];

  aoAbrirProjeto: (
    projeto: Project
  ) => void;

  aoAtualizarProjeto: (
    projeto: Project
  ) => void;
}


/* ============================================================
   ORDEM DAS COLUNAS
   ============================================================ */

const statusDasColunas: StatusType[] = [
  'Em andamento',
  'Atrasado',
  'Pausado',
  'Concluído',
];


/* ============================================================
   VERIFICAR SE É STATUS
   ============================================================ */

function ehStatusDoProjeto(
  valor: string
): valor is StatusType {

  return statusDasColunas.includes(
    valor as StatusType
  );

}


/* ============================================================
   NORMALIZAR TEXTO
   ============================================================ */

function normalizarTexto(
  texto: string
) {

  return texto
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .trim();

}


/* ============================================================
   VERIFICAR TAREFA CONCLUÍDA
   ============================================================ */

function tarefaEstaConcluida(
  tarefa: ProjectTask
) {

  if (
    tarefa.status !==
    'Concluído'
  ) {

    return false;

  }


  const subtarefas =
    tarefa.subtasks ?? [];


  if (
    subtarefas.length === 0
  ) {

    return true;

  }


  return subtarefas.every(
    (subtarefa) =>
      subtarefa.status ===
      'Concluído'
  );

}


/* ============================================================
   PROJETO PODE SER CONCLUÍDO
   ============================================================ */

export function projetoPodeSerConcluido(
  projeto: Project
) {

  const tarefas =
    projeto.tasks ?? [];


  if (
    tarefas.length === 0
  ) {

    return false;

  }


  return tarefas.every(
    tarefaEstaConcluida
  );

}


/* ============================================================
   PENDÊNCIAS
   ============================================================ */

export function obterPendenciasDoProjeto(
  projeto: Project
) {

  const tarefas =
    projeto.tasks ?? [];


  const tarefasPendentes =
    tarefas.filter(
      (tarefa) =>
        tarefa.status !==
        'Concluído'
    );


  const subtarefasPendentes =
    tarefas.flatMap(
      (tarefa) =>
        (
          tarefa.subtasks ??
          []
        ).filter(
          (subtarefa) =>
            subtarefa.status !==
            'Concluído'
        )
    );


  return {

    tarefasPendentes:
      tarefasPendentes.length,

    subtarefasPendentes:
      subtarefasPendentes.length,

    totalPendencias:
      tarefasPendentes.length +
      subtarefasPendentes.length,

  };

}


/* ============================================================
   STATUS DO DESTINO
   ============================================================ */

function encontrarStatusDoDestino(
  idDestino: string,
  projetos: Project[]
): StatusType | null {

  if (
    ehStatusDoProjeto(
      idDestino
    )
  ) {

    return idDestino;

  }


  const projetoDestino =
    projetos.find(
      (projeto) =>
        projeto.id ===
        idDestino
    );


  return (
    projetoDestino?.status ??
    null
  );

}


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function GlobalProjectKanban({
  projetos,
  aoAbrirProjeto,
  aoAtualizarProjeto,
}: GlobalProjectKanbanProps) {


  /* ==========================================================
     PESQUISA
     ========================================================== */

  const [
    pesquisa,
    setPesquisa,
  ] = useState('');


  /* ==========================================================
     PROJETO ATIVO NO DRAG
     ========================================================== */

  const [
    projetoAtivo,
    setProjetoAtivo,
  ] = useState<Project | null>(
    null
  );


  /* ==========================================================
     STATUS ORIGINAL
     ========================================================== */

  const [
    statusOriginal,
    setStatusOriginal,
  ] = useState<StatusType | null>(
    null
  );


  /* ==========================================================
     SNAPSHOT PARA CANCELAMENTO
     ========================================================== */

  const [
    projetoAntesDoArraste,
    setProjetoAntesDoArraste,
  ] = useState<Project | null>(
    null
  );


  /* ==========================================================
     BLOQUEIO DE CONCLUSÃO
     ========================================================== */

  const [
    projetoBloqueado,
    setProjetoBloqueado,
  ] = useState<Project | null>(
    null
  );


  /* ==========================================================
     SENSORES
     ========================================================== */

  const sensores =
    useSensors(

      useSensor(
        PointerSensor,
        {
          activationConstraint: {
            distance:
              6,
          },
        }
      )

    );


  /* ==========================================================
     CONCLUSÃO AUTOMÁTICA
     ========================================================== */

  useEffect(
    () => {

      projetos.forEach(
        (projeto) => {


          if (
            projeto.status ===
            'Concluído'
          ) {

            return;

          }


          if (
            !projetoPodeSerConcluido(
              projeto
            )
          ) {

            return;

          }


          const projetoAtualizado:
            Project = {

            ...projeto,

            status:
              'Concluído',

            progress:
              100,

            history: [

              {
                id:
                  `history-project-completed-${Date.now()}-${projeto.id}`,

                type:
                  'status_changed',

                title:
                  'Projeto concluído',

                description:
                  `O projeto ${projeto.code} — ${projeto.title} foi concluído automaticamente após a conclusão de todas as tarefas e subtarefas.`,

                user:
                  projeto.responsible,

                createdAt:
                  new Date()
                    .toISOString(),

                metadata: {

                  previousValue:
                    projeto.status,

                  newValue:
                    'Concluído',

                },

              },

              ...(
                projeto.history ??
                []
              ),

            ],

          };


          aoAtualizarProjeto(
            projetoAtualizado
          );

        }
      );

    },
    [
      projetos,
      aoAtualizarProjeto,
    ]
  );


  /* ==========================================================
     INICIAR ARRASTE
     ========================================================== */

  function iniciarArraste(
    evento: DragStartEvent
  ) {

    const id =
      String(
        evento.active.id
      );


    const projeto =
      projetos.find(
        (item) =>
          item.id ===
          id
      );


    if (!projeto) {
      return;
    }


    setProjetoAtivo(
      projeto
    );


    setStatusOriginal(
      projeto.status
    );


    setProjetoAntesDoArraste(
      projeto
    );

  }


  /* ==========================================================
     DURANTE ARRASTE
     ========================================================== */

  function duranteArraste(
    evento: DragOverEvent
  ) {

    const {
      active,
      over,
    } = evento;


    if (!over) {
      return;
    }


    const projetoId =
      String(
        active.id
      );


    const destinoId =
      String(
        over.id
      );


    const projetoAtual =
      projetos.find(
        (item) =>
          item.id ===
          projetoId
      );


    if (!projetoAtual) {
      return;
    }


    const novoStatus =
      encontrarStatusDoDestino(
        destinoId,
        projetos
      );


    if (!novoStatus) {
      return;
    }


    /* --------------------------------------------------------
       CONCLUÍDO NÃO MUDA DURANTE DRAG
       -------------------------------------------------------- */

    if (
      novoStatus ===
      'Concluído'
    ) {

      return;

    }


    /* --------------------------------------------------------
       PROJETO JÁ CONCLUÍDO NÃO MOVE
       -------------------------------------------------------- */

    if (
      projetoAtual.status ===
      'Concluído'
    ) {

      return;

    }


    /* --------------------------------------------------------
       JÁ ESTÁ NO STATUS
       -------------------------------------------------------- */

    if (
      projetoAtual.status ===
      novoStatus
    ) {

      return;

    }


    /* --------------------------------------------------------
       ATUALIZA VISUALMENTE
       -------------------------------------------------------- */

    const projetoAtualizado:
      Project = {

      ...projetoAtual,

      status:
        novoStatus,

    };


    aoAtualizarProjeto(
      projetoAtualizado
    );

  }


  /* ==========================================================
     FINALIZAR ARRASTE
     ========================================================== */

  function finalizarArraste(
    evento: DragEndEvent
  ) {

    const {
      active,
      over,
    } = evento;


    const projetoInicial =
      projetoAtivo;


    const statusInicial =
      statusOriginal;


    setProjetoAtivo(
      null
    );


    setStatusOriginal(
      null
    );


    /* --------------------------------------------------------
       SOLTOU FORA
       -------------------------------------------------------- */

    if (!over) {

      if (
        projetoAntesDoArraste
      ) {

        aoAtualizarProjeto(
          projetoAntesDoArraste
        );

      }


      setProjetoAntesDoArraste(
        null
      );


      return;

    }


    const projetoId =
      String(
        active.id
      );


    const destinoId =
      String(
        over.id
      );


    const statusFinal =
      encontrarStatusDoDestino(
        destinoId,
        projetos
      );


    if (
      !projetoInicial ||
      !statusInicial ||
      !statusFinal
    ) {

      setProjetoAntesDoArraste(
        null
      );

      return;

    }


    /* ========================================================
       TENTATIVA DE CONCLUIR MANUALMENTE
       ======================================================== */

    if (
      statusFinal ===
      'Concluído'
    ) {

      /*
       * Restaura o projeto ao estado anterior.
       */
      if (
        projetoAntesDoArraste
      ) {

        aoAtualizarProjeto(
          projetoAntesDoArraste
        );

      }


      setProjetoBloqueado(
        projetoInicial
      );


      setProjetoAntesDoArraste(
        null
      );


      return;

    }


    /* ========================================================
       SEM ALTERAÇÃO
       ======================================================== */

    if (
      statusInicial ===
      statusFinal
    ) {

      setProjetoAntesDoArraste(
        null
      );


      return;

    }


    /* ========================================================
       LOCALIZA ESTADO FINAL
       ======================================================== */

    const projetoFinal =
      projetos.find(
        (item) =>
          item.id ===
          projetoId
      );


    if (!projetoFinal) {

      setProjetoAntesDoArraste(
        null
      );


      return;

    }


    /* ========================================================
       REGISTRA HISTÓRICO
       ======================================================== */

    const projetoComHistorico:
      Project = {

      ...projetoFinal,

      status:
        statusFinal,

      history: [

        {
          id:
            `history-project-status-${Date.now()}-${projetoFinal.id}`,

          type:
            'status_changed',

          title:
            'Status do projeto alterado',

          description:
            `O projeto ${projetoFinal.code} — ${projetoFinal.title} foi alterado de "${statusInicial}" para "${statusFinal}".`,

          user:
            projetoFinal.responsible,

          createdAt:
            new Date()
              .toISOString(),

          metadata: {

            previousValue:
              statusInicial,

            newValue:
              statusFinal,

          },

        },

        ...(
          projetoFinal.history ??
          []
        ),

      ],

    };


    aoAtualizarProjeto(
      projetoComHistorico
    );


    setProjetoAntesDoArraste(
      null
    );

  }


  /* ==========================================================
     CANCELAR ARRASTE
     ========================================================== */

  function cancelarArraste() {

    if (
      projetoAntesDoArraste
    ) {

      aoAtualizarProjeto(
        projetoAntesDoArraste
      );

    }


    setProjetoAtivo(
      null
    );


    setStatusOriginal(
      null
    );


    setProjetoAntesDoArraste(
      null
    );

  }


  /* ==========================================================
     PROJETOS FILTRADOS
     ========================================================== */

  const projetosFiltrados =
    useMemo(
      () => {

        const termo =
          normalizarTexto(
            pesquisa
          );


        if (!termo) {

          return projetos;

        }


        return projetos.filter(
          (projeto) => {

            const conteudo =
              normalizarTexto(
                [
                  projeto.code,
                  projeto.title,
                  projeto.responsible,
                  projeto.status,
                  ...(projeto.tags ?? []),
                ].join(' ')
              );


            return conteudo.includes(
              termo
            );

          }
        );

      },
      [
        pesquisa,
        projetos,
      ]
    );


  /* ==========================================================
     CONTADORES
     ========================================================== */

  const totalDeProjetos =
    projetosFiltrados.length;


  const totalEmAndamento =
    projetosFiltrados.filter(
      (projeto) =>
        projeto.status ===
        'Em andamento'
    ).length;


  const totalAtrasados =
    projetosFiltrados.filter(
      (projeto) =>
        projeto.status ===
        'Atrasado'
    ).length;


  const totalPausados =
    projetosFiltrados.filter(
      (projeto) =>
        projeto.status ===
        'Pausado'
    ).length;


  const totalConcluidos =
    projetosFiltrados.filter(
      (projeto) =>
        projeto.status ===
        'Concluído'
    ).length;


  /* ==========================================================
     PENDÊNCIAS DO BLOQUEADO
     ========================================================== */

  const pendenciasDoProjeto =
    projetoBloqueado

      ? obterPendenciasDoProjeto(
          projetoBloqueado
        )

      : null;


  /* ==========================================================
     INTERFACE
     ========================================================== */

  return (

    <>

      <DndContext
        sensors={
          sensores
        }

        collisionDetection={
          closestCorners
        }

        onDragStart={
          iniciarArraste
        }

        onDragOver={
          duranteArraste
        }

        onDragEnd={
          finalizarArraste
        }

        onDragCancel={
          cancelarArraste
        }
      >

        <div className="space-y-6">


          {/* ==================================================
              CABEÇALHO
              ================================================== */}

          <div
            className="
              flex
              flex-wrap
              items-start
              justify-between
              gap-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-institution-50
                "
              >

                <Columns3
                  className="
                    h-5
                    w-5
                    text-institution-600
                  "
                />

              </div>


              <div>

                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-gray-900
                  "
                >
                  Kanban de Projetos
                </h1>


                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-500
                  "
                >
                  Visualize e organize seus projetos de acordo com a situação atual de execução.
                </p>

              </div>

            </div>


            <div
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                shadow-sm
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-institution-50
                "
              >

                <FolderKanban
                  className="
                    h-4
                    w-4
                    text-institution-600
                  "
                />

              </div>


              <div>

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-400
                  "
                >
                  Projetos
                </p>


                <p
                  className="
                    text-lg
                    font-bold
                    text-gray-800
                  "
                >
                  {totalDeProjetos}
                </p>

              </div>

            </div>

          </div>


          {/* ==================================================
              PESQUISA
              ================================================== */}

          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-4
              shadow-sm
            "
          >

            <div
              className="
                flex
                flex-col
                gap-3
                md:flex-row
                md:items-center
                md:justify-between
              "
            >

              <div
                className="
                  relative
                  w-full
                  md:max-w-xl
                "
              >

                <Search
                  className="
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-gray-400
                  "
                />


                <input
                  value={
                    pesquisa
                  }

                  onChange={(evento) =>
                    setPesquisa(
                      evento.target.value
                    )
                  }

                  placeholder="Pesquisar projeto, código, responsável ou etiqueta..."

                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    py-2.5
                    pl-10
                    pr-10
                    text-sm
                    text-gray-700
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-institution-500
                    focus:ring-2
                    focus:ring-institution-100
                  "
                />


                {pesquisa && (

                  <button
                    type="button"

                    onClick={() =>
                      setPesquisa('')
                    }

                    className="
                      absolute
                      right-2
                      top-1/2
                      flex
                      h-7
                      w-7
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-md
                      text-gray-400
                      transition-colors
                      hover:bg-gray-100
                      hover:text-gray-600
                    "

                    title="Limpar pesquisa"
                  >

                    <X className="h-4 w-4" />

                  </button>

                )}

              </div>


              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                {projetosFiltrados.length}{' '}

                {projetosFiltrados.length === 1
                  ? 'projeto encontrado'
                  : 'projetos encontrados'}
              </p>

            </div>

          </div>


          {/* ==================================================
              RESUMO
              ================================================== */}

          <div
            className="
              grid
              grid-cols-2
              gap-3
              lg:grid-cols-4
            "
          >

            <div
              className="
                rounded-xl
                border
                border-blue-100
                bg-blue-50/60
                px-4
                py-3
              "
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                Em andamento
              </p>

              <p className="mt-1 text-xl font-bold text-blue-700">
                {totalEmAndamento}
              </p>
            </div>


            <div
              className="
                rounded-xl
                border
                border-red-100
                bg-red-50/60
                px-4
                py-3
              "
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-red-500">
                Atrasados
              </p>

              <p className="mt-1 text-xl font-bold text-red-700">
                {totalAtrasados}
              </p>
            </div>


            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
              "
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Pausados
              </p>

              <p className="mt-1 text-xl font-bold text-slate-700">
                {totalPausados}
              </p>
            </div>


            <div
              className="
                rounded-xl
                border
                border-green-100
                bg-green-50/60
                px-4
                py-3
              "
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-green-500">
                Concluídos
              </p>

              <p className="mt-1 text-xl font-bold text-green-700">
                {totalConcluidos}
              </p>
            </div>

          </div>


          {/* ==================================================
              QUADRO
              ================================================== */}

          {projetosFiltrados.length > 0 ? (

            <div
              className="
                overflow-x-auto
                pb-4
              "
            >

              <div
                className="
                  grid
                  min-w-[1100px]
                  grid-cols-4
                  items-start
                  gap-4
                "
              >

                {statusDasColunas.map(
                  (status) => {


                    const projetosDaColuna =
                      projetosFiltrados.filter(
                        (projeto) =>
                          projeto.status ===
                          status
                      );


                    return (

                      <ProjectKanbanColumn
                        key={
                          status
                        }

                        status={
                          status
                        }

                        projetos={
                          projetosDaColuna
                        }

                        aoAbrirProjeto={
                          aoAbrirProjeto
                        }
                      />

                    );

                  }
                )}

              </div>

            </div>

          ) : (

            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-gray-300
                bg-white
                px-6
                py-14
                text-center
              "
            >

              <Search
                className="
                  mx-auto
                  h-7
                  w-7
                  text-gray-300
                "
              />

              <p className="mt-3 text-sm font-semibold text-gray-600">
                Nenhum projeto encontrado
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Tente pesquisar utilizando outro nome, código ou responsável.
              </p>

            </div>

          )}

        </div>


        {/* ====================================================
            CARD FLUTUANTE
            ==================================================== */}

        <DragOverlay
          dropAnimation={{
            duration:
              180,

            easing:
              'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >

          {projetoAtivo ? (

            <div
              className="
                w-[280px]
                rotate-[1deg]
                scale-[1.02]
                cursor-grabbing
                opacity-95
                shadow-2xl
              "
            >

              <ProjectKanbanCard
                projeto={
                  projetoAtivo
                }

                aoAbrirProjeto={() => {}}

                permitirArrastar={
                  false
                }
              />

            </div>

          ) : null}

        </DragOverlay>

      </DndContext>


      {/* ======================================================
          MODAL — CONCLUSÃO BLOQUEADA
          ====================================================== */}

      {projetoBloqueado && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/40
            p-4
            backdrop-blur-[2px]
          "
        >

          <div
            className="
              w-full
              max-w-lg
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            <div
              className="
                flex
                items-start
                gap-3
                border-b
                border-gray-100
                px-6
                py-5
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-amber-50
                "
              >

                <AlertTriangle
                  className="
                    h-5
                    w-5
                    text-amber-600
                  "
                />

              </div>


              <div>

                <h2 className="text-base font-semibold text-gray-800">
                  Conclusão automática
                </h2>


                <p className="mt-1 text-sm text-gray-500">
                  O projeto não pode ser movido manualmente para Concluído.
                </p>

              </div>

            </div>


            <div className="px-6 py-5">

              <p className="text-xs font-semibold text-institution-600">
                {projetoBloqueado.code}
              </p>


              <p className="mt-1 text-sm font-semibold text-gray-800">
                {projetoBloqueado.title}
              </p>


              {pendenciasDoProjeto &&
              pendenciasDoProjeto.totalPendencias > 0 ? (

                <>

                  <p className="mt-4 text-sm leading-relaxed text-gray-600">
                    Para concluir este projeto, finalize todas as tarefas e subtarefas pendentes.
                  </p>


                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div
                      className="
                        rounded-xl
                        border
                        border-gray-200
                        bg-slate-50
                        p-4
                      "
                    >

                      <div className="flex items-center gap-2">

                        <ListChecks className="h-4 w-4 text-institution-600" />

                        <span className="text-xs text-gray-500">
                          Tarefas pendentes
                        </span>

                      </div>


                      <p className="mt-2 text-2xl font-bold text-gray-800">
                        {pendenciasDoProjeto.tarefasPendentes}
                      </p>

                    </div>


                    <div
                      className="
                        rounded-xl
                        border
                        border-gray-200
                        bg-slate-50
                        p-4
                      "
                    >

                      <div className="flex items-center gap-2">

                        <Layers3 className="h-4 w-4 text-institution-600" />

                        <span className="text-xs text-gray-500">
                          Subtarefas pendentes
                        </span>

                      </div>


                      <p className="mt-2 text-2xl font-bold text-gray-800">
                        {pendenciasDoProjeto.subtarefasPendentes}
                      </p>

                    </div>

                  </div>

                </>

              ) : (

                <div
                  className="
                    mt-4
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-green-100
                    bg-green-50
                    p-4
                  "
                >

                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />


                  <p className="text-sm leading-relaxed text-green-700">
                    Todas as atividades estão concluídas. O sistema concluirá o projeto automaticamente.
                  </p>

                </div>

              )}

            </div>


            <div
              className="
                flex
                items-center
                justify-end
                gap-3
                border-t
                border-gray-100
                bg-slate-50/70
                px-6
                py-4
              "
            >

              <button
                type="button"

                onClick={() =>
                  setProjetoBloqueado(
                    null
                  )
                }

                className="
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-600
                  hover:bg-gray-50
                "
              >
                Fechar
              </button>


              <button
                type="button"

                onClick={() => {

                  const projeto =
                    projetoBloqueado;


                  setProjetoBloqueado(
                    null
                  );


                  aoAbrirProjeto(
                    projeto
                  );

                }}

                className="
                  rounded-lg
                  bg-institution-600
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  shadow-sm
                  hover:bg-institution-700
                "
              >
                Abrir projeto
              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );
}