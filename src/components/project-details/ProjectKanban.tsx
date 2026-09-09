import {
  useMemo,
  useState,
} from 'react';

import type {
  ElementType,
} from 'react';

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  CSS,
} from '@dnd-kit/utilities';

import {
  CalendarDays,
  User,
  FileText,
  AlertTriangle,
  CircleDashed,
  Clock3,
  ShieldCheck,
  CheckCircle2,
  GripVertical,
  Layers3,
} from 'lucide-react';

import type {
  Project,
  ProjectTask,
  ProjectSubtask,
  ProjectHistoryItem,
  TaskStatusType,
  TagType,
} from '@/data/projects';

import TaskTags from '@/components/task-tags/TaskTags';


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface KanbanProjetoProps {
  projeto: Project;

  tarefas: ProjectTask[];

  aoAlterarTarefas: (
    tarefas: ProjectTask[]
  ) => void;

  aoRegistrarHistorico: (
    item: Omit<
      ProjectHistoryItem,
      'id' | 'createdAt'
    >
  ) => void;
}


/* ============================================================
   ITEM DO KANBAN
   ============================================================ */

interface ItemKanban
  extends ProjectSubtask {

  tarefaId: string;

  tarefaTitulo: string;

  tarefaOrdem: number;
}


/* ============================================================
   COLUNAS
   ============================================================ */

const colunasDoKanban: Array<{
  status: TaskStatusType;
  titulo: string;
  descricao: string;
  Icone: ElementType;
  corCabecalho: string;
  corIcone: string;
}> = [

  {
    status:
      'Não iniciado',

    titulo:
      'Não iniciado',

    descricao:
      'Subtarefas ainda não iniciadas',

    Icone:
      CircleDashed,

    corCabecalho:
      'bg-slate-50 border-slate-200',

    corIcone:
      'text-slate-500',
  },

  {
    status:
      'Em andamento',

    titulo:
      'Em andamento',

    descricao:
      'Subtarefas em execução',

    Icone:
      Clock3,

    corCabecalho:
      'bg-blue-50 border-blue-200',

    corIcone:
      'text-blue-600',
  },

  {
    status:
      'Homologação',

    titulo:
      'Homologação',

    descricao:
      'Subtarefas em validação',

    Icone:
      ShieldCheck,

    corCabecalho:
      'bg-amber-50 border-amber-200',

    corIcone:
      'text-amber-600',
  },

  {
    status:
      'Concluído',

    titulo:
      'Concluído',

    descricao:
      'Subtarefas finalizadas',

    Icone:
      CheckCircle2,

    corCabecalho:
      'bg-green-50 border-green-200',

    corIcone:
      'text-green-600',
  },

];


/* ============================================================
   VERIFICAR COLUNA
   ============================================================ */

function ehStatusDeColuna(
  id: string
): id is TaskStatusType {

  return colunasDoKanban.some(
    (coluna) =>
      coluna.status === id
  );

}


/* ============================================================
   GERAR ITENS
   ============================================================ */

function gerarItensDoKanban(
  tarefas: ProjectTask[]
): ItemKanban[] {

  return tarefas.flatMap(
    (tarefa) =>

      (
        tarefa.subtasks ??
        []
      ).map(
        (subtarefa) => ({

          ...subtarefa,

          tarefaId:
            tarefa.id,

          tarefaTitulo:
            tarefa.title,

          tarefaOrdem:
            tarefa.order,

        })
      )
  );

}


/* ============================================================
   STATUS DO DESTINO
   ============================================================ */

function encontrarStatusDoDestino(
  idDoDestino: string,
  itens: ItemKanban[]
): TaskStatusType | null {

  if (
    ehStatusDeColuna(
      idDoDestino
    )
  ) {

    return idDoDestino;

  }


  const item =
    itens.find(
      (subtarefa) =>
        subtarefa.id ===
        idDoDestino
    );


  return (
    item?.status ??
    null
  );

}


/* ============================================================
   COR DO PROGRESSO
   ============================================================ */

function definirCorDoProgresso(
  subtarefa: ItemKanban
) {

  if (
    subtarefa.status ===
    'Concluído'
  ) {
    return 'bg-green-500';
  }


  if (
    subtarefa.status ===
    'Homologação'
  ) {
    return 'bg-amber-500';
  }


  if (
    subtarefa.status ===
    'Não iniciado'
  ) {
    return 'bg-slate-400';
  }


  return 'bg-blue-500';

}


/* ============================================================
   CONTEÚDO DO CARD
   ============================================================ */

function ConteudoCardSubtarefa({
  subtarefa,
  permitirEditarEtiquetas = true,
  aoAlterarEtiquetas,
}: {
  subtarefa: ItemKanban;

  permitirEditarEtiquetas?: boolean;

  aoAlterarEtiquetas?: (
    idDaTarefa: string,
    idDaSubtarefa: string,
    etiquetas: TagType[]
  ) => void;
}) {

  const etiquetas =
    subtarefa.tags ?? [];


  return (

    <>

      {/* IDENTIFICAÇÃO */}

      <div
        className="
          mb-3
          flex
          items-start
          justify-between
          gap-2
        "
      >

        <div>

          <span
            className="
              inline-flex
              items-center
              gap-1
              rounded-md
              bg-slate-100
              px-2
              py-1
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-slate-500
            "
          >

            <Layers3 className="h-3 w-3" />

            Tarefa {subtarefa.tarefaOrdem}

          </span>


          <p
            className="
              mt-1
              text-[10px]
              font-medium
              text-institution-600
            "
          >
            {subtarefa.tarefaTitulo}
          </p>

        </div>


        <span
          className="
            text-[10px]
            font-bold
            text-gray-500
          "
        >
          {subtarefa.tarefaOrdem}.
          {subtarefa.order}
        </span>

      </div>


      {/* TÍTULO */}

      <h4
        className="
          text-sm
          font-semibold
          leading-snug
          text-gray-800
        "
      >
        {subtarefa.title}
      </h4>


      {/* ETIQUETAS */}

      {permitirEditarEtiquetas ? (

        <TaskTags
          etiquetasIniciais={
            etiquetas
          }

          aoAlterarEtiquetas={(
            novasEtiquetas
          ) =>

            aoAlterarEtiquetas?.(
              subtarefa.tarefaId,
              subtarefa.id,
              novasEtiquetas
            )

          }
        />

      ) : (

        etiquetas.length > 0 && (

          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-1.5
            "
          >

            {etiquetas.map(
              (etiqueta) => {


                const estilo =

                  etiqueta ===
                  'Impedimento'

                    ? 'border-orange-200 bg-orange-50 text-orange-700'

                    : etiqueta ===
                      'Prioridade'

                    ? 'border-violet-200 bg-violet-50 text-violet-700'

                    : etiqueta ===
                      'Dependência de terceiros'

                    ? 'border-cyan-200 bg-cyan-50 text-cyan-700'

                    : 'border-red-200 bg-red-50 text-red-700';


                return (

                  <span
                    key={
                      etiqueta
                    }

                    className={`
                      rounded-full
                      border
                      px-2
                      py-0.5
                      text-[10px]
                      font-semibold

                      ${estilo}
                    `}
                  >
                    {etiqueta}
                  </span>

                );

              }
            )}

          </div>

        )

      )}


      {/* PROGRESSO */}

      <div className="mt-4">

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
            {subtarefa.progress ?? 0}%
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
              transition-all

              ${definirCorDoProgresso(
                subtarefa
              )}
            `}

            style={{
              width:
                `${Math.min(
                  Math.max(
                    subtarefa.progress ??
                    0,
                    0
                  ),
                  100
                )}%`,
            }}
          />

        </div>

      </div>


      {/* INFORMAÇÕES */}

      <div
        className="
          mt-4
          space-y-2
          border-t
          border-gray-100
          pt-3
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-xs
            text-gray-500
          "
        >

          <User
            className="
              h-3.5
              w-3.5
              text-gray-400
            "
          />

          <span className="truncate">
            {subtarefa.responsible}
          </span>

        </div>


        {subtarefa.deliveryDate && (

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-gray-500
            "
          >

            <CalendarDays
              className="
                h-3.5
                w-3.5
                text-gray-400
              "
            />

            <span>
              {subtarefa.deliveryDate}
            </span>

          </div>

        )}


        {subtarefa.type && (

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-gray-500
            "
          >

            <FileText
              className="
                h-3.5
                w-3.5
                text-gray-400
              "
            />

            <span>
              {subtarefa.type}
            </span>

          </div>

        )}

      </div>


      {/* IMPEDIMENTO */}

      {etiquetas.includes(
        'Impedimento'
      ) && (

        <div
          className="
            mt-3
            flex
            items-start
            gap-2
            rounded-lg
            bg-orange-50
            p-2.5
            text-[11px]
            text-orange-700
          "
        >

          <AlertTriangle
            className="
              mt-0.5
              h-3.5
              w-3.5
              flex-shrink-0
            "
          />

          Esta subtarefa possui impedimento.

        </div>

      )}

    </>

  );

}


/* ============================================================
   CARD ARRASTÁVEL
   ============================================================ */

function CardDaSubtarefa({
  subtarefa,
  aoAlterarEtiquetas,
}: {
  subtarefa: ItemKanban;

  aoAlterarEtiquetas: (
    idDaTarefa: string,
    idDaSubtarefa: string,
    etiquetas: TagType[]
  ) => void;
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({

    id:
      subtarefa.id,

  });


  const estilo = {

    transform:
      CSS.Transform.toString(
        transform
      ),

    transition,

  };


  return (

    <article
      ref={
        setNodeRef
      }

      style={
        estilo
      }

      className={`
        relative
        rounded-xl
        border
        bg-white
        p-4
        shadow-sm
        transition-shadow

        ${
          isDragging

            ? `
              border-institution-200
              opacity-20
            `

            : `
              border-gray-200
              hover:border-institution-200
              hover:shadow-md
            `
        }
      `}
    >

      <button
        type="button"

        {...attributes}

        {...listeners}

        className="
          absolute
          right-3
          top-3
          z-10
          cursor-grab
          rounded-md
          p-1
          text-gray-400
          hover:bg-gray-100
          hover:text-gray-600
          active:cursor-grabbing
        "

        title="Arrastar subtarefa"
      >

        <GripVertical className="h-4 w-4" />

      </button>


      <ConteudoCardSubtarefa
        subtarefa={
          subtarefa
        }

        aoAlterarEtiquetas={
          aoAlterarEtiquetas
        }
      />

    </article>

  );

}


/* ============================================================
   CARD FLUTUANTE
   ============================================================ */

function CardFlutuante({
  subtarefa,
}: {
  subtarefa: ItemKanban;
}) {

  return (

    <article
      className="
        w-[280px]
        rotate-[1deg]
        scale-[1.02]
        cursor-grabbing
        rounded-xl
        border
        border-institution-200
        bg-white
        p-4
        opacity-95
        shadow-2xl
        ring-1
        ring-black/5
      "
    >

      <ConteudoCardSubtarefa
        subtarefa={
          subtarefa
        }

        permitirEditarEtiquetas={
          false
        }
      />

    </article>

  );

}


/* ============================================================
   COLUNA
   ============================================================ */

function ColunaKanban({
  status,
  titulo,
  descricao,
  Icone,
  corCabecalho,
  corIcone,
  subtarefas,
  aoAlterarEtiquetas,
}: {
  status: TaskStatusType;

  titulo: string;

  descricao: string;

  Icone: ElementType;

  corCabecalho: string;

  corIcone: string;

  subtarefas: ItemKanban[];

  aoAlterarEtiquetas: (
    idDaTarefa: string,
    idDaSubtarefa: string,
    etiquetas: TagType[]
  ) => void;
}) {

  const {
    setNodeRef,
    isOver,
  } = useDroppable({

    id:
      status,

  });


  const ids =
    subtarefas.map(
      (subtarefa) =>
        subtarefa.id
    );


  return (

    <section
      ref={
        setNodeRef
      }

      className={`
        min-w-0
        rounded-xl
        border
        p-3
        transition-all
        duration-200

        ${
          isOver

            ? `
              border-institution-300
              bg-institution-50/50
              ring-2
              ring-institution-100
            `

            : `
              border-gray-200
              bg-slate-50/70
            `
        }
      `}
    >

      <div
        className={`
          mb-3
          rounded-lg
          border
          p-3

          ${corCabecalho}
        `}
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-2
          "
        >

          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
            "
          >

            <Icone
              className={`
                h-4
                w-4

                ${corIcone}
              `}
            />


            <h3
              className="
                truncate
                text-sm
                font-semibold
                text-gray-700
              "
            >
              {titulo}
            </h3>

          </div>


          <span
            className="
              flex
              h-6
              min-w-[24px]
              items-center
              justify-center
              rounded-full
              bg-white
              px-2
              text-xs
              font-bold
              text-gray-600
              shadow-sm
            "
          >
            {subtarefas.length}
          </span>

        </div>


        <p
          className="
            mt-1
            text-[11px]
            text-gray-400
          "
        >
          {descricao}
        </p>

      </div>


      <SortableContext
        items={
          ids
        }

        strategy={
          verticalListSortingStrategy
        }
      >

        <div
          className="
            min-h-[180px]
            space-y-3
          "
        >

          {subtarefas.length > 0 ? (

            subtarefas.map(
              (subtarefa) => (

                <CardDaSubtarefa
                  key={
                    subtarefa.id
                  }

                  subtarefa={
                    subtarefa
                  }

                  aoAlterarEtiquetas={
                    aoAlterarEtiquetas
                  }
                />

              )
            )

          ) : (

            <div
              className={`
                flex
                min-h-[150px]
                items-center
                justify-center
                rounded-lg
                border
                border-dashed
                px-3
                text-center

                ${
                  isOver

                    ? `
                      border-institution-300
                      bg-institution-50
                    `

                    : `
                      border-gray-300
                      bg-white/70
                    `
                }
              `}
            >

              <div>

                <p
                  className="
                    text-xs
                    font-medium
                    text-gray-400
                  "
                >
                  Solte uma subtarefa aqui
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-gray-300
                  "
                >
                  O status será atualizado automaticamente
                </p>

              </div>

            </div>

          )}

        </div>

      </SortableContext>

    </section>

  );

}


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function ProjectKanban({
  projeto,
  tarefas,
  aoAlterarTarefas,
  aoRegistrarHistorico,
}: KanbanProjetoProps) {


  /* ==========================================================
     FILTROS
     ========================================================== */

  const [
    tarefaSelecionada,
    setTarefaSelecionada,
  ] = useState(
    'todas'
  );


  const [
    responsavelSelecionado,
    setResponsavelSelecionado,
  ] = useState(
    'todos'
  );


  /* ==========================================================
     DRAG
     ========================================================== */

  const [
    subtarefaAtiva,
    setSubtarefaAtiva,
  ] = useState<ItemKanban | null>(
    null
  );


  const [
    statusOriginal,
    setStatusOriginal,
  ] = useState<TaskStatusType | null>(
    null
  );


  /* ==========================================================
     SNAPSHOT PARA CANCELAMENTO
     ========================================================== */

  const [
    tarefasAntesDoArraste,
    setTarefasAntesDoArraste,
  ] = useState<ProjectTask[] | null>(
    null
  );


  /* ==========================================================
     ITENS
     ========================================================== */

  const todosOsItens =
    useMemo(
      () =>
        gerarItensDoKanban(
          tarefas
        ),

      [
        tarefas,
      ]
    );


  /* ==========================================================
     RESPONSÁVEIS
     ========================================================== */

  const responsaveis =
    useMemo(
      () =>

        Array.from(
          new Set(
            todosOsItens
              .map(
                (item) =>
                  item.responsible
              )
              .filter(Boolean)
          )
        ),

      [
        todosOsItens,
      ]
    );


  /* ==========================================================
     FILTRO
     ========================================================== */

  const itensFiltrados =
    useMemo(
      () =>

        todosOsItens.filter(
          (item) => {

            const tarefaOk =

              tarefaSelecionada ===
                'todas' ||

              item.tarefaId ===
                tarefaSelecionada;


            const responsavelOk =

              responsavelSelecionado ===
                'todos' ||

              item.responsible ===
                responsavelSelecionado;


            return (
              tarefaOk &&
              responsavelOk
            );

          }
        ),

      [
        todosOsItens,
        tarefaSelecionada,
        responsavelSelecionado,
      ]
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
     ETIQUETAS
     ========================================================== */

  function alterarEtiquetasDaSubtarefa(
    tarefaId: string,
    subtarefaId: string,
    novasEtiquetas: TagType[]
  ) {

    const tarefa =
      tarefas.find(
        (item) =>
          item.id === tarefaId
      );


    const subtarefa =
      tarefa?.subtasks?.find(
        (item) =>
          item.id === subtarefaId
      );


    if (
      !tarefa ||
      !subtarefa
    ) {
      return;
    }


    const anteriores =
      subtarefa.tags ?? [];


    const adicionadas =
      novasEtiquetas.filter(
        (etiqueta) =>
          !anteriores.includes(
            etiqueta
          )
      );


    const removidas =
      anteriores.filter(
        (etiqueta) =>
          !novasEtiquetas.includes(
            etiqueta
          )
      );


    const tarefasAtualizadas =
      tarefas.map(
        (item) =>

          item.id === tarefaId

            ? {
                ...item,

                subtasks:
                  (
                    item.subtasks ??
                    []
                  ).map(
                    (subitem) =>

                      subitem.id ===
                      subtarefaId

                        ? {
                            ...subitem,

                            tags:
                              novasEtiquetas,
                          }

                        : subitem

                  ),
              }

            : item

      );


    aoAlterarTarefas(
      tarefasAtualizadas
    );


    adicionadas.forEach(
      (etiqueta) => {

        aoRegistrarHistorico({

          type:
            'tag_added',

          title:
            'Etiqueta adicionada',

          description:
            `A etiqueta "${etiqueta}" foi adicionada à subtarefa "${subtarefa.title}".`,

          user:
            subtarefa.responsible,

          metadata: {

            newValue:
              etiqueta,

            taskId:
              tarefa.id,

            taskTitle:
              tarefa.title,

            subtaskId:
              subtarefa.id,

            subtaskTitle:
              subtarefa.title,

          },

        });

      }
    );


    removidas.forEach(
      (etiqueta) => {

        aoRegistrarHistorico({

          type:
            'tag_removed',

          title:
            'Etiqueta removida',

          description:
            `A etiqueta "${etiqueta}" foi removida da subtarefa "${subtarefa.title}".`,

          user:
            subtarefa.responsible,

          metadata: {

            previousValue:
              etiqueta,

            taskId:
              tarefa.id,

            taskTitle:
              tarefa.title,

            subtaskId:
              subtarefa.id,

            subtaskTitle:
              subtarefa.title,

          },

        });

      }
    );

  }


  /* ==========================================================
     ALTERAR STATUS
     ========================================================== */

  function atualizarStatusDaSubtarefa(
    subtarefaId: string,
    novoStatus: TaskStatusType
  ) {

    const tarefasAtualizadas =
      tarefas.map(
        (tarefa) => ({

          ...tarefa,

          subtasks:
            (
              tarefa.subtasks ??
              []
            ).map(
              (subtarefa) =>

                subtarefa.id ===
                subtarefaId

                  ? {
                      ...subtarefa,

                      status:
                        novoStatus,
                    }

                  : subtarefa

            ),

        })
      );


    aoAlterarTarefas(
      tarefasAtualizadas
    );

  }


  /* ==========================================================
     INICIAR
     ========================================================== */

  function iniciarArraste(
    evento: DragStartEvent
  ) {

    const id =
      String(
        evento.active.id
      );


    const subtarefa =
      todosOsItens.find(
        (item) =>
          item.id === id
      );


    setSubtarefaAtiva(
      subtarefa ??
      null
    );


    setStatusOriginal(
      subtarefa?.status ??
      null
    );


    setTarefasAntesDoArraste(
      tarefas
    );

  }


  /* ==========================================================
     DURANTE
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


    const idAtivo =
      String(
        active.id
      );


    const idDestino =
      String(
        over.id
      );


    const itemAtual =
      todosOsItens.find(
        (item) =>
          item.id ===
          idAtivo
      );


    if (!itemAtual) {
      return;
    }


    const novoStatus =
      encontrarStatusDoDestino(
        idDestino,
        todosOsItens
      );


    if (
      !novoStatus ||
      novoStatus ===
        itemAtual.status
    ) {
      return;
    }


    atualizarStatusDaSubtarefa(
      idAtivo,
      novoStatus
    );

  }


  /* ==========================================================
     FINALIZAR
     ========================================================== */

  function finalizarArraste(
    evento: DragEndEvent
  ) {

    const {
      active,
      over,
    } = evento;


    const itemOriginal =
      subtarefaAtiva;


    const statusInicial =
      statusOriginal;


    setSubtarefaAtiva(
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
        tarefasAntesDoArraste
      ) {

        aoAlterarTarefas(
          tarefasAntesDoArraste
        );

      }


      setTarefasAntesDoArraste(
        null
      );


      return;

    }


    const idAtivo =
      String(
        active.id
      );


    const idDestino =
      String(
        over.id
      );


    const statusFinal =
      encontrarStatusDoDestino(
        idDestino,
        todosOsItens
      );


    /* --------------------------------------------------------
       REGISTRO DE STATUS
       -------------------------------------------------------- */

    if (
      itemOriginal &&
      statusInicial &&
      statusFinal &&
      statusInicial !==
        statusFinal
    ) {

      aoRegistrarHistorico({

        type:
          'status_changed',

        title:
          'Status da subtarefa alterado',

        description:
          `A subtarefa "${itemOriginal.title}" foi alterada de ${statusInicial} para ${statusFinal}.`,

        user:
          itemOriginal.responsible,

        metadata: {

          previousValue:
            statusInicial,

          newValue:
            statusFinal,

          taskId:
            itemOriginal.tarefaId,

          taskTitle:
            itemOriginal.tarefaTitulo,

          subtaskId:
            itemOriginal.id,

          subtaskTitle:
            itemOriginal.title,

        },

      });

    }


    setTarefasAntesDoArraste(
      null
    );


    /* --------------------------------------------------------
       MESMO ELEMENTO
       -------------------------------------------------------- */

    if (
      idAtivo ===
      idDestino
    ) {
      return;
    }


    /* --------------------------------------------------------
       REORDENAÇÃO
       -------------------------------------------------------- */

    const itemAtivo =
      todosOsItens.find(
        (item) =>
          item.id ===
          idAtivo
      );


    const itemDestino =
      todosOsItens.find(
        (item) =>
          item.id ===
          idDestino
      );


    if (
      itemAtivo &&
      itemDestino &&
      itemAtivo.tarefaId ===
        itemDestino.tarefaId
    ) {

      const tarefasAtualizadas =
        tarefas.map(
          (tarefa) => {


            if (
              tarefa.id !==
              itemAtivo.tarefaId
            ) {

              return tarefa;

            }


            const subtarefas =
              tarefa.subtasks ??
              [];


            const indiceAntigo =
              subtarefas.findIndex(
                (subtarefa) =>
                  subtarefa.id ===
                  idAtivo
              );


            const indiceNovo =
              subtarefas.findIndex(
                (subtarefa) =>
                  subtarefa.id ===
                  idDestino
              );


            if (
              indiceAntigo === -1 ||
              indiceNovo === -1
            ) {

              return tarefa;

            }


            return {

              ...tarefa,

              subtasks:
                arrayMove(
                  subtarefas,
                  indiceAntigo,
                  indiceNovo
                ),

            };

          }
        );


      aoAlterarTarefas(
        tarefasAtualizadas
      );

      return;

    }


    /* --------------------------------------------------------
       COLUNA
       -------------------------------------------------------- */

    if (
      ehStatusDeColuna(
        idDestino
      )
    ) {

      atualizarStatusDaSubtarefa(
        idAtivo,
        idDestino
      );

    }

  }


  /* ==========================================================
     CANCELAR
     ========================================================== */

  function cancelarArraste() {

    if (
      tarefasAntesDoArraste
    ) {

      aoAlterarTarefas(
        tarefasAntesDoArraste
      );

    }


    setSubtarefaAtiva(
      null
    );


    setStatusOriginal(
      null
    );


    setTarefasAntesDoArraste(
      null
    );

  }


  /* ==========================================================
     RESUMO
     ========================================================== */

  const total =
    itensFiltrados.length;


  const concluidas =
    itensFiltrados.filter(
      (item) =>
        item.status ===
        'Concluído'
    ).length;


  const percentual =
    total > 0

      ? Math.round(
          (
            concluidas /
            total
          ) *
          100
        )

      : 0;


  /* ==========================================================
     INTERFACE
     ========================================================== */

  return (

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


        {/* CABEÇALHO */}

        <div
          className="
            flex
            flex-wrap
            items-start
            justify-between
            gap-4
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-semibold
                text-gray-800
              "
            >
              Kanban
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Organize e acompanhe as subtarefas vinculadas a{' '}

              <span
                className="
                  font-semibold
                  text-institution-700
                "
              >
                {projeto.code}
              </span>.
            </p>

          </div>


          <div
            className="
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              shadow-sm
            "
          >

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
                Subtarefas
              </p>

              <p
                className="
                  text-lg
                  font-bold
                  text-gray-700
                "
              >
                {total}
              </p>

            </div>


            <div
              className="
                h-8
                w-px
                bg-gray-200
              "
            />


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
                Concluído
              </p>

              <p
                className="
                  text-lg
                  font-bold
                  text-green-600
                "
              >
                {percentual}%
              </p>

            </div>

          </div>

        </div>


        {/* FILTROS */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            rounded-xl
            border
            border-gray-200
            bg-white
            p-4
            sm:grid-cols-2
          "
        >

          <div>

            <label
              className="
                mb-1.5
                block
                text-xs
                font-semibold
                text-gray-600
              "
            >
              Tarefa
            </label>


            <select
              value={
                tarefaSelecionada
              }

              onChange={(evento) =>
                setTarefaSelecionada(
                  evento.target.value
                )
              }

              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-2.5
                text-sm
                text-gray-700
                outline-none
                focus:border-institution-500
                focus:ring-2
                focus:ring-institution-100
              "
            >

              <option value="todas">
                Todas as tarefas
              </option>


              {tarefas.map(
                (tarefa) => (

                  <option
                    key={
                      tarefa.id
                    }

                    value={
                      tarefa.id
                    }
                  >
                    {tarefa.order}. {tarefa.title}
                  </option>

                )
              )}

            </select>

          </div>


          <div>

            <label
              className="
                mb-1.5
                block
                text-xs
                font-semibold
                text-gray-600
              "
            >
              Responsável
            </label>


            <select
              value={
                responsavelSelecionado
              }

              onChange={(evento) =>
                setResponsavelSelecionado(
                  evento.target.value
                )
              }

              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-2.5
                text-sm
                text-gray-700
                outline-none
                focus:border-institution-500
                focus:ring-2
                focus:ring-institution-100
              "
            >

              <option value="todos">
                Todos os responsáveis
              </option>


              {responsaveis.map(
                (responsavel) => (

                  <option
                    key={
                      responsavel
                    }

                    value={
                      responsavel
                    }
                  >
                    {responsavel}
                  </option>

                )
              )}

            </select>

          </div>

        </div>


        {/* QUADRO */}

        {todosOsItens.length === 0 ? (

          <div
            className="
              rounded-xl
              border
              border-dashed
              border-gray-300
              bg-gray-50
              p-12
              text-center
            "
          >

            <p
              className="
                text-sm
                font-medium
                text-gray-600
              "
            >
              Nenhuma subtarefa cadastrada.
            </p>


            <p
              className="
                mt-1
                text-xs
                text-gray-400
              "
            >
              Crie subtarefas em Ações do Projeto para visualizá-las no Kanban.
            </p>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              items-start
              gap-4
              md:grid-cols-2
              xl:grid-cols-4
            "
          >

            {colunasDoKanban.map(
              (coluna) => {


                const subtarefas =
                  itensFiltrados.filter(
                    (item) =>
                      item.status ===
                      coluna.status
                  );


                return (

                  <ColunaKanban
                    key={
                      coluna.status
                    }

                    status={
                      coluna.status
                    }

                    titulo={
                      coluna.titulo
                    }

                    descricao={
                      coluna.descricao
                    }

                    Icone={
                      coluna.Icone
                    }

                    corCabecalho={
                      coluna.corCabecalho
                    }

                    corIcone={
                      coluna.corIcone
                    }

                    subtarefas={
                      subtarefas
                    }

                    aoAlterarEtiquetas={
                      alterarEtiquetasDaSubtarefa
                    }
                  />

                );

              }
            )}

          </div>

        )}

      </div>


      {/* CARD FLUTUANTE */}

      <DragOverlay
        dropAnimation={{
          duration:
            180,

          easing:
            'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
      >

        {subtarefaAtiva ? (

          <CardFlutuante
            subtarefa={
              subtarefaAtiva
            }
          />

        ) : null}

      </DragOverlay>

    </DndContext>

  );

}