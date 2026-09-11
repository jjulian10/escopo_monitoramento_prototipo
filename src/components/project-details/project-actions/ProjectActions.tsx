import {
  useState,
} from 'react';

import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  User,
  ListChecks,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  CircleDashed,
} from 'lucide-react';

import type {
  Project,
  ProjectTask,
  ProjectSubtask,
  TaskStatusType,
  ProjectHistoryItem,
} from '@/data/projects';

import AddTaskModal from './AddTaskModal';

import AddSubtaskModal from './AddSubtaskModal';


/* ============================================================
   TIPO PARA NOVO REGISTRO DO HISTÓRICO
   ============================================================ */

type NovoRegistroHistorico =
  Omit<
    ProjectHistoryItem,
    'id' | 'createdAt'
  >;


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface ProjectActionsProps {

  /* Projeto atualmente aberto */
  projeto: Project;


  /*
   * Lista compartilhada de tarefas.
   *
   * Essa mesma lista também será utilizada
   * pelo Kanban.
   */
  tarefas: ProjectTask[];


  /*
   * Função responsável por atualizar
   * a lista compartilhada.
   */
  aoAlterarTarefas: (
    tarefas: ProjectTask[]
  ) => void;


  /*
   * Registra movimentações no histórico
   * do projeto.
   */
  aoRegistrarHistorico: (
    item: NovoRegistroHistorico
  ) => void;
}


/* ============================================================
   CONFIGURAÇÃO DOS STATUS
   ============================================================ */

const configuracaoDosStatus: Record<
  TaskStatusType,
  {
    texto: string;
    fundo: string;
    Icone: typeof CircleDashed;
  }
> = {

  'Não iniciado': {
    texto:
      'text-gray-600',

    fundo:
      'bg-gray-100',

    Icone:
      CircleDashed,
  },


  'Em andamento': {
    texto:
      'text-blue-700',

    fundo:
      'bg-blue-50',

    Icone:
      Clock3,
  },


  Homologação: {
    texto:
      'text-amber-700',

    fundo:
      'bg-amber-50',

    Icone:
      ShieldCheck,
  },


  Concluído: {
    texto:
      'text-green-700',

    fundo:
      'bg-green-50',

    Icone:
      CheckCircle2,
  },

};


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function ProjectActions({

  projeto,

  tarefas,

  aoAlterarTarefas,

  aoRegistrarHistorico,

}: ProjectActionsProps) {


  /* ==========================================================
     TAREFAS EXPANDIDAS
     ==========================================================

     Esse estado pode continuar local porque ele controla
     apenas o comportamento visual desta tela.
     ========================================================== */

  const [
    tarefasExpandidas,
    setTarefasExpandidas,
  ] = useState<string[]>([]);


  /* ==========================================================
     MODAL: NOVA TAREFA
     ========================================================== */

  const [
    modalNovaTarefa,
    setModalNovaTarefa,
  ] = useState(false);


  /* ==========================================================
     TAREFA SELECIONADA PARA RECEBER SUBTAREFA
     ========================================================== */

  const [
    tarefaParaSubtarefa,
    setTarefaParaSubtarefa,
  ] = useState<ProjectTask | null>(
    null
  );


  /* ==========================================================
     EXPANDIR / RECOLHER TAREFA
     ========================================================== */

  function alternarTarefa(
    idDaTarefa: string
  ) {

    setTarefasExpandidas(
      (atuais) =>

        atuais.includes(
          idDaTarefa
        )

          ? atuais.filter(
              (id) =>
                id !==
                idDaTarefa
            )

          : [
              ...atuais,
              idDaTarefa,
            ]
    );

  }


  /* ==========================================================
     ADICIONAR NOVA TAREFA
     ========================================================== */

  function adicionarTarefa(
    tarefa: ProjectTask
  ) {

    const novaListaDeTarefas = [
      ...tarefas,
      tarefa,
    ];


    /* --------------------------------------------------------
       ATUALIZA LISTA
       -------------------------------------------------------- */

    aoAlterarTarefas(
      novaListaDeTarefas
    );


    /* --------------------------------------------------------
       REGISTRA NO HISTÓRICO
       -------------------------------------------------------- */

    aoRegistrarHistorico({

      type:
        'task_created',

      title:
        'Tarefa criada',

      description:
        `A tarefa "${tarefa.title}" foi adicionada ao projeto.`,

      user:
        projeto.responsible,

      metadata: {

        taskId:
          tarefa.id,

        taskTitle:
          tarefa.title,

      },

    });


    /* --------------------------------------------------------
       EXPANDE AUTOMATICAMENTE
       -------------------------------------------------------- */

    setTarefasExpandidas(
      (atuais) => [
        ...atuais,
        tarefa.id,
      ]
    );

  }


  /* ==========================================================
     EXCLUIR TAREFA
     ========================================================== */

  function excluirTarefa(
    idDaTarefa: string
  ) {


    /* --------------------------------------------------------
       LOCALIZA A TAREFA ANTES DA EXCLUSÃO
       -------------------------------------------------------- */

    const tarefaExcluida =
      tarefas.find(
        (tarefa) =>
          tarefa.id ===
          idDaTarefa
      );


    if (
      !tarefaExcluida
    ) {

      return;

    }


    /* --------------------------------------------------------
       CONFIRMAÇÃO
       -------------------------------------------------------- */

    const confirmar =
      window.confirm(
        'Deseja realmente excluir esta tarefa e suas subtarefas?'
      );


    if (
      !confirmar
    ) {

      return;

    }


    /* --------------------------------------------------------
       REGISTRA NO HISTÓRICO
       -------------------------------------------------------- */

    aoRegistrarHistorico({

      type:
        'task_deleted',

      title:
        'Tarefa excluída',

      description:
        `A tarefa "${tarefaExcluida.title}" foi removida do projeto.`,

      user:
        projeto.responsible,

      metadata: {

        taskId:
          tarefaExcluida.id,

        taskTitle:
          tarefaExcluida.title,

      },

    });


    /* --------------------------------------------------------
       REMOVE DA LISTA
       -------------------------------------------------------- */

    const novaListaDeTarefas =
      tarefas.filter(
        (tarefa) =>
          tarefa.id !==
          idDaTarefa
      );


    aoAlterarTarefas(
      novaListaDeTarefas
    );


    /* --------------------------------------------------------
       REMOVE DA LISTA DE EXPANDIDOS
       -------------------------------------------------------- */

    setTarefasExpandidas(
      (atuais) =>
        atuais.filter(
          (id) =>
            id !==
            idDaTarefa
        )
    );

  }


  /* ==========================================================
     ADICIONAR SUBTAREFA
     ========================================================== */

  function adicionarSubtarefa(
    idDaTarefa: string,
    subtarefa: ProjectSubtask
  ) {


    /* --------------------------------------------------------
       LOCALIZA A TAREFA PAI
       -------------------------------------------------------- */

    const tarefaPai =
      tarefas.find(
        (tarefa) =>
          tarefa.id ===
          idDaTarefa
      );


    if (
      !tarefaPai
    ) {

      return;

    }


    /* --------------------------------------------------------
       ATUALIZA LISTA
       -------------------------------------------------------- */

    const novaListaDeTarefas =
      tarefas.map(
        (tarefa) =>

          tarefa.id ===
          idDaTarefa

            ? {
                ...tarefa,

                subtasks: [
                  ...(
                    tarefa.subtasks ??
                    []
                  ),

                  subtarefa,
                ],
              }

            : tarefa
      );


    aoAlterarTarefas(
      novaListaDeTarefas
    );


    /* --------------------------------------------------------
       REGISTRA NO HISTÓRICO
       -------------------------------------------------------- */

    aoRegistrarHistorico({

      type:
        'subtask_created',

      title:
        'Subtarefa criada',

      description:
        `A subtarefa "${subtarefa.title}" foi adicionada à tarefa "${tarefaPai.title}".`,

      user:
        projeto.responsible,

      metadata: {

        taskId:
          tarefaPai.id,

        taskTitle:
          tarefaPai.title,

        subtaskId:
          subtarefa.id,

        subtaskTitle:
          subtarefa.title,

      },

    });


    /* --------------------------------------------------------
       GARANTE QUE A TAREFA FIQUE EXPANDIDA
       -------------------------------------------------------- */

    if (
      !tarefasExpandidas.includes(
        idDaTarefa
      )
    ) {

      setTarefasExpandidas(
        (atuais) => [
          ...atuais,
          idDaTarefa,
        ]
      );

    }

  }


  /* ==========================================================
     EXCLUIR SUBTAREFA
     ========================================================== */

  function excluirSubtarefa(
    idDaTarefa: string,
    idDaSubtarefa: string
  ) {


    /* --------------------------------------------------------
       LOCALIZA A TAREFA
       -------------------------------------------------------- */

    const tarefaPai =
      tarefas.find(
        (tarefa) =>
          tarefa.id ===
          idDaTarefa
      );


    /* --------------------------------------------------------
       LOCALIZA A SUBTAREFA
       -------------------------------------------------------- */

    const subtarefaExcluida =
      tarefaPai
        ?.subtasks
        ?.find(
          (subtarefa) =>
            subtarefa.id ===
            idDaSubtarefa
        );


    if (
      !tarefaPai ||
      !subtarefaExcluida
    ) {

      return;

    }


    /* --------------------------------------------------------
       CONFIRMAÇÃO
       -------------------------------------------------------- */

    const confirmar =
      window.confirm(
        'Deseja realmente excluir esta subtarefa?'
      );


    if (
      !confirmar
    ) {

      return;

    }


    /* --------------------------------------------------------
       REGISTRA NO HISTÓRICO
       -------------------------------------------------------- */

    aoRegistrarHistorico({

      type:
        'subtask_deleted',

      title:
        'Subtarefa excluída',

      description:
        `A subtarefa "${subtarefaExcluida.title}" foi removida da tarefa "${tarefaPai.title}".`,

      user:
        projeto.responsible,

      metadata: {

        taskId:
          tarefaPai.id,

        taskTitle:
          tarefaPai.title,

        subtaskId:
          subtarefaExcluida.id,

        subtaskTitle:
          subtarefaExcluida.title,

      },

    });


    /* --------------------------------------------------------
       REMOVE A SUBTAREFA
       -------------------------------------------------------- */

    const novaListaDeTarefas =
      tarefas.map(
        (tarefa) =>

          tarefa.id ===
          idDaTarefa

            ? {
                ...tarefa,

                subtasks:
                  (
                    tarefa.subtasks ??
                    []
                  ).filter(
                    (subtarefa) =>
                      subtarefa.id !==
                      idDaSubtarefa
                  ),
              }

            : tarefa
      );


    aoAlterarTarefas(
      novaListaDeTarefas
    );

  }


  /* ==========================================================
     RESUMO
     ========================================================== */

  const totalDeTarefas =
    tarefas.length;


  const totalDeSubtarefas =
    tarefas.reduce(
      (
        total,
        tarefa
      ) =>

        total +
        (
          tarefa.subtasks?.length ??
          0
        ),

      0
    );


  /* ==========================================================
     PRÓXIMA ORDEM DA TAREFA
     ========================================================== */

  const proximaOrdemDaTarefa =
    tarefas.length > 0

      ? Math.max(
          ...tarefas.map(
            (tarefa) =>
              tarefa.order
          )
        ) + 1

      : 1;


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
          flex-wrap
          items-start
          justify-between
          gap-4
          border-b
          border-gray-200
          pb-5
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

            <ListChecks
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
              Ações do Projeto
            </h2>

          </div>


          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Gerencie as tarefas e subtarefas vinculadas a{' '}

            <span
              className="
                font-semibold
                text-gray-700
              "
            >
              {projeto.code}
            </span>

            .
          </p>


          {/* ==================================================
              RESUMO
              ================================================== */}

          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-2
            "
          >

            <span
              className="
                rounded-full
                bg-institution-50
                px-2.5
                py-1
                text-xs
                font-medium
                text-institution-700
              "
            >
              {totalDeTarefas}{' '}

              {totalDeTarefas === 1
                ? 'tarefa'
                : 'tarefas'}
            </span>


            <span
              className="
                rounded-full
                bg-gray-100
                px-2.5
                py-1
                text-xs
                font-medium
                text-gray-600
              "
            >
              {totalDeSubtarefas}{' '}

              {totalDeSubtarefas === 1
                ? 'subtarefa'
                : 'subtarefas'}
            </span>

          </div>

        </div>


        {/* ====================================================
            NOVA TAREFA
            ==================================================== */}

        <button
          type="button"

          onClick={() =>
            setModalNovaTarefa(
              true
            )
          }

          className="
            flex
            items-center
            gap-2
            rounded-lg
            bg-institution-600
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            shadow-sm
            transition-all
            hover:bg-institution-700
            hover:shadow-md
          "
        >

          <Plus className="h-4 w-4" />

          Nova tarefa

        </button>

      </div>


      {/* ======================================================
          SEM TAREFAS
          ====================================================== */}

      {tarefas.length === 0 ? (

        <div
          className="
            rounded-xl
            border
            border-dashed
            border-gray-300
            bg-gray-50
            px-6
            py-14
            text-center
          "
        >

          <ListChecks
            className="
              mx-auto
              h-8
              w-8
              text-gray-300
            "
          />


          <p
            className="
              mt-3
              text-sm
              font-semibold
              text-gray-600
            "
          >
            Nenhuma tarefa cadastrada
          </p>


          <p
            className="
              mt-1
              text-xs
              text-gray-400
            "
          >
            Crie a primeira tarefa deste projeto.
          </p>

        </div>

      ) : (

        /* =====================================================
           LISTA DE TAREFAS
           ===================================================== */

        <div className="space-y-3">

          {tarefas.map(
            (tarefa) => {


              /* ===============================================
                 ESTADO DA TAREFA
                 =============================================== */

              const expandida =
                tarefasExpandidas.includes(
                  tarefa.id
                );


              const subtarefas =
                tarefa.subtasks ??
                [];


              const configuracao =
                configuracaoDosStatus[
                  tarefa.status
                ];


              const IconeStatus =
                configuracao.Icone;


              return (

                <article
                  key={
                    tarefa.id
                  }

                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    shadow-sm
                    transition-all
                    hover:border-institution-200
                    hover:shadow-md
                  "
                >


                  {/* ===========================================
                      LINHA PRINCIPAL DA TAREFA
                      =========================================== */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-4
                      p-4
                      lg:flex-row
                      lg:items-center
                    "
                  >


                    {/* =========================================
                        EXPANDIR
                        ========================================= */}

                    <button
                      type="button"

                      onClick={() =>
                        alternarTarefa(
                          tarefa.id
                        )
                      }

                      className="
                        flex
                        h-8
                        w-8
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-gray-500
                        transition-colors
                        hover:bg-gray-100
                      "

                      title={
                        expandida
                          ? 'Recolher subtarefas'
                          : 'Visualizar subtarefas'
                      }
                    >

                      {expandida ? (

                        <ChevronDown className="h-4 w-4" />

                      ) : (

                        <ChevronRight className="h-4 w-4" />

                      )}

                    </button>


                    {/* =========================================
                        NÚMERO
                        ========================================= */}

                    <div
                      className="
                        flex
                        h-8
                        w-8
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-institution-100
                        text-xs
                        font-bold
                        text-institution-700
                      "
                    >
                      {tarefa.order}
                    </div>


                    {/* =========================================
                        NOME
                        ========================================= */}

                    <div className="min-w-0 flex-1">

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-gray-800
                        "
                      >
                        {tarefa.title}
                      </p>


                      <div
                        className="
                          mt-1
                          flex
                          flex-wrap
                          items-center
                          gap-3
                          text-xs
                          text-gray-400
                        "
                      >

                        <span
                          className="
                            flex
                            items-center
                            gap-1
                          "
                        >

                          <User className="h-3.5 w-3.5" />

                          {tarefa.responsible}

                        </span>


                        <span>

                          {subtarefas.length}{' '}

                          {subtarefas.length === 1
                            ? 'subtarefa'
                            : 'subtarefas'}

                        </span>

                      </div>

                    </div>


                    {/* =========================================
                        STATUS
                        ========================================= */}

                    <div
                      className={`
                        flex
                        items-center
                        gap-1.5
                        whitespace-nowrap
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-medium

                        ${configuracao.fundo}
                        ${configuracao.texto}
                      `}
                    >

                      <IconeStatus className="h-3.5 w-3.5" />

                      {tarefa.status}

                    </div>


                    {/* =========================================
                        PROGRESSO
                        ========================================= */}

                    <div
                      className="
                        w-28
                        flex-shrink-0
                      "
                    >

                      <div
                        className="
                          mb-1
                          flex
                          justify-between
                          text-[10px]
                          text-gray-400
                        "
                      >

                        <span>
                          Progresso
                        </span>


                        <span
                          className="
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

                            ${
                              tarefa.status ===
                              'Concluído'
                                ? 'bg-green-500'
                                : tarefa.status ===
                                  'Homologação'
                                ? 'bg-amber-500'
                                : tarefa.status ===
                                  'Não iniciado'
                                ? 'bg-gray-400'
                                : 'bg-institution-600'
                            }
                          `}

                          style={{
                            width:
                              `${Math.min(
                                Math.max(
                                  tarefa.progress ??
                                    0,
                                  0
                                ),
                                100
                              )}%`,
                          }}
                        />

                      </div>

                    </div>


                    {/* =========================================
                        EXCLUIR
                        ========================================= */}

                    <button
                      type="button"

                      onClick={() =>
                        excluirTarefa(
                          tarefa.id
                        )
                      }

                      className="
                        flex
                        h-8
                        w-8
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-gray-400
                        transition-colors
                        hover:bg-red-50
                        hover:text-red-600
                      "

                      title="Excluir tarefa"
                    >

                      <Trash2 className="h-4 w-4" />

                    </button>

                  </div>


                  {/* ===========================================
                      SUBTAREFAS
                      =========================================== */}

                  {expandida && (

                    <div
                      className="
                        border-t
                        border-gray-100
                        bg-slate-50/60
                        px-5
                        py-4
                      "
                    >


                      {/* =======================================
                          LISTA
                          ======================================= */}

                      {subtarefas.length > 0 ? (

                        <div className="space-y-2">

                          {subtarefas.map(
                            (subtarefa) => {


                              const configSub =
                                configuracaoDosStatus[
                                  subtarefa.status
                                ];


                              const IconeSub =
                                configSub.Icone;


                              return (

                                <div
                                  key={
                                    subtarefa.id
                                  }

                                  className="
                                    flex
                                    flex-col
                                    gap-3
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-white
                                    px-4
                                    py-3
                                    transition-colors
                                    hover:border-institution-200
                                    sm:flex-row
                                    sm:items-center
                                  "
                                >


                                  {/* NÚMERO */}

                                  <span
                                    className="
                                      flex
                                      h-7
                                      min-w-[38px]
                                      flex-shrink-0
                                      items-center
                                      justify-center
                                      rounded-md
                                      bg-gray-100
                                      px-1.5
                                      text-[10px]
                                      font-bold
                                      text-gray-500
                                    "
                                  >
                                    {tarefa.order}.
                                    {subtarefa.order}
                                  </span>


                                  {/* INFORMAÇÕES */}

                                  <div
                                    className="
                                      min-w-0
                                      flex-1
                                    "
                                  >

                                    <p
                                      className="
                                        text-sm
                                        font-medium
                                        text-gray-700
                                      "
                                    >
                                      {subtarefa.title}
                                    </p>


                                    <div
                                      className="
                                        mt-0.5
                                        flex
                                        items-center
                                        gap-1
                                        text-[11px]
                                        text-gray-400
                                      "
                                    >

                                      <User className="h-3 w-3" />

                                      {subtarefa.responsible}

                                    </div>

                                  </div>


                                  {/* STATUS */}

                                  <span
                                    className={`
                                      inline-flex
                                      items-center
                                      gap-1.5
                                      whitespace-nowrap
                                      rounded-full
                                      px-2.5
                                      py-1
                                      text-[11px]
                                      font-medium

                                      ${configSub.fundo}
                                      ${configSub.texto}
                                    `}
                                  >

                                    <IconeSub className="h-3 w-3" />

                                    {subtarefa.status}

                                  </span>


                                  {/* PROGRESSO */}

                                  <div
                                    className="
                                      w-24
                                      flex-shrink-0
                                    "
                                  >

                                    <div
                                      className="
                                        mb-1
                                        flex
                                        justify-between
                                        text-[9px]
                                        text-gray-400
                                      "
                                    >

                                      <span>
                                        Progresso
                                      </span>


                                      <span
                                        className="
                                          font-bold
                                          text-gray-600
                                        "
                                      >
                                        {subtarefa.progress}%
                                      </span>

                                    </div>


                                    <div
                                      className="
                                        h-1
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
                                        "

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


                                  {/* EXCLUIR */}

                                  <button
                                    type="button"

                                    onClick={() =>
                                      excluirSubtarefa(
                                        tarefa.id,
                                        subtarefa.id
                                      )
                                    }

                                    className="
                                      flex
                                      h-7
                                      w-7
                                      flex-shrink-0
                                      items-center
                                      justify-center
                                      rounded-lg
                                      text-gray-400
                                      transition-colors
                                      hover:bg-red-50
                                      hover:text-red-600
                                    "

                                    title="Excluir subtarefa"
                                  >

                                    <Trash2 className="h-3.5 w-3.5" />

                                  </button>

                                </div>

                              );

                            }
                          )}

                        </div>

                      ) : (

                        /* =====================================
                           TAREFA SEM SUBTAREFAS
                           ===================================== */

                        <div
                          className="
                            rounded-lg
                            border
                            border-dashed
                            border-gray-300
                            bg-white/70
                            px-4
                            py-5
                            text-center
                          "
                        >

                          <p
                            className="
                              text-xs
                              text-gray-400
                            "
                          >
                            Nenhuma subtarefa cadastrada.
                          </p>

                        </div>

                      )}


                      {/* =======================================
                          ADICIONAR SUBTAREFA
                          ======================================= */}

                      <button
                        type="button"

                        onClick={() =>
                          setTarefaParaSubtarefa(
                            tarefa
                          )
                        }

                        className="
                          mt-3
                          flex
                          items-center
                          gap-1.5
                          rounded-lg
                          px-2
                          py-1.5
                          text-xs
                          font-medium
                          text-institution-600
                          transition-colors
                          hover:bg-institution-50
                          hover:text-institution-800
                        "
                      >

                        <Plus className="h-3.5 w-3.5" />

                        Adicionar subtarefa

                      </button>

                    </div>

                  )}

                </article>

              );

            }
          )}

        </div>

      )}


      {/* ======================================================
          MODAL: NOVA TAREFA
          ====================================================== */}

      {modalNovaTarefa && (

        <AddTaskModal
          proximaOrdem={
            proximaOrdemDaTarefa
          }

          aoCriar={
            adicionarTarefa
          }

          aoFechar={() =>
            setModalNovaTarefa(
              false
            )
          }
        />

      )}


      {/* ======================================================
          MODAL: NOVA SUBTAREFA
          ====================================================== */}

      {tarefaParaSubtarefa && (

        <AddSubtaskModal

          proximaOrdem={

            tarefaParaSubtarefa
              .subtasks?.length

              ? Math.max(
                  ...tarefaParaSubtarefa
                    .subtasks
                    .map(
                      (subtarefa) =>
                        subtarefa.order
                    )
                ) + 1

              : 1
          }

          aoCriar={(
            subtarefa
          ) =>

            adicionarSubtarefa(
              tarefaParaSubtarefa.id,
              subtarefa
            )

          }

          aoFechar={() =>
            setTarefaParaSubtarefa(
              null
            )
          }
        />

      )}

    </div>

  );
}