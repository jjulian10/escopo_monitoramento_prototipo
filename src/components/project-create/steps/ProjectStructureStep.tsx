import {
    useState,
  } from 'react';
  
  import {
    ChevronDown,
    ChevronRight,
    Layers3,
    ListChecks,
    Plus,
    Trash2,
    User,
  } from 'lucide-react';
  
  import type {
    ProjectTask,
    ProjectSubtask,
  } from '@/data/projects';
  
  import AddTaskModal from '@/components/project-details/project-actions/AddTaskModal';
  import AddSubtaskModal from '@/components/project-details/project-actions/AddSubtaskModal';
  
  
  /* ============================================================
     PROPRIEDADES
     ============================================================ */
  
  interface ProjectStructureStepProps {
    tarefas: ProjectTask[];
  
    aoAlterarTarefas: (
      tarefas: ProjectTask[]
    ) => void;
  }
  
  
  /* ============================================================
     COMPONENTE
     ============================================================ */
  
  export default function ProjectStructureStep({
    tarefas,
    aoAlterarTarefas,
  }: ProjectStructureStepProps) {
  
  
    /* ==========================================================
       TAREFAS EXPANDIDAS
       ========================================================== */
  
    const [
      tarefasExpandidas,
      setTarefasExpandidas,
    ] = useState<string[]>([]);
  
  
    /* ==========================================================
       MODAL NOVA TAREFA
       ========================================================== */
  
    const [
      modalNovaTarefaAberto,
      setModalNovaTarefaAberto,
    ] = useState(false);
  
  
    /* ==========================================================
       TAREFA PARA NOVA SUBTAREFA
       ========================================================== */
  
    const [
      tarefaSelecionada,
      setTarefaSelecionada,
    ] = useState<ProjectTask | null>(
      null
    );
  
  
    /* ==========================================================
       EXPANDIR / RECOLHER
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
                  id !== idDaTarefa
              )
  
            : [
                ...atuais,
                idDaTarefa,
              ]
      );
    }
  
  
    /* ==========================================================
       ADICIONAR TAREFA
       ========================================================== */
  
    function adicionarTarefa(
      tarefa: ProjectTask
    ) {
  
      aoAlterarTarefas([
        ...tarefas,
        tarefa,
      ]);
  
  
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
  
      const confirmar =
        window.confirm(
          'Deseja excluir esta tarefa e todas as subtarefas vinculadas?'
        );
  
  
      if (!confirmar) {
        return;
      }
  
  
      aoAlterarTarefas(
        tarefas.filter(
          (tarefa) =>
            tarefa.id !== idDaTarefa
        )
      );
  
  
      setTarefasExpandidas(
        (atuais) =>
          atuais.filter(
            (id) =>
              id !== idDaTarefa
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
  
      aoAlterarTarefas(
        tarefas.map(
          (tarefa) =>
  
            tarefa.id === idDaTarefa
  
              ? {
                  ...tarefa,
  
                  subtasks: [
                    ...(tarefa.subtasks ?? []),
                    subtarefa,
                  ],
                }
  
              : tarefa
        )
      );
    }
  
  
    /* ==========================================================
       EXCLUIR SUBTAREFA
       ========================================================== */
  
    function excluirSubtarefa(
      idDaTarefa: string,
      idDaSubtarefa: string
    ) {
  
      aoAlterarTarefas(
        tarefas.map(
          (tarefa) =>
  
            tarefa.id === idDaTarefa
  
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
        )
      );
    }
  
  
    /* ==========================================================
       TOTAL DE SUBTAREFAS
       ========================================================== */
  
    const totalDeSubtarefas =
      tarefas.reduce(
        (total, tarefa) =>
          total +
          (
            tarefa.subtasks?.length ??
            0
          ),
        0
      );
  
  
    /* ==========================================================
       PRÓXIMA ORDEM
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
          "
        >
  
          <div>
  
            <div className="flex items-center gap-2">
  
              <Layers3
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
                Estrutura do Projeto
              </h2>
  
            </div>
  
  
            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Organize as tarefas e subtarefas que compõem o projeto.
            </p>
  
  
            <div
              className="
                mt-3
                flex
                flex-wrap
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
                {tarefas.length}{' '}
  
                {tarefas.length === 1
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
  
  
          <button
            onClick={() =>
              setModalNovaTarefaAberto(
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
              bg-white
              px-6
              py-16
              text-center
            "
          >
  
            <ListChecks
              className="
                mx-auto
                h-9
                w-9
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
              Nenhuma tarefa adicionada
            </p>
  
  
            <p
              className="
                mt-1
                text-xs
                text-gray-400
              "
            >
              Crie a primeira tarefa para estruturar o projeto.
            </p>
  
  
            <button
              onClick={() =>
                setModalNovaTarefaAberto(
                  true
                )
              }
  
              className="
                mx-auto
                mt-4
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-institution-200
                bg-institution-50
                px-4
                py-2
                text-sm
                font-medium
                text-institution-700
                hover:bg-institution-100
              "
            >
  
              <Plus className="h-4 w-4" />
  
              Adicionar tarefa
  
            </button>
  
          </div>
  
        ) : (
  
          /* =====================================================
             LISTA
             ===================================================== */
  
          <div className="space-y-3">
  
            {tarefas.map(
              (tarefa) => {
  
  
                const expandida =
                  tarefasExpandidas.includes(
                    tarefa.id
                  );
  
  
                const subtarefas =
                  tarefa.subtasks ??
                  [];
  
  
                return (
  
                  <article
                    key={tarefa.id}
  
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
                        TAREFA
                        =========================================== */}
  
                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        p-4
                        sm:flex-row
                        sm:items-center
                      "
                    >
  
  
                      {/* EXPANDIR */}
  
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
                          items-center
                          justify-center
                          rounded-lg
                          text-gray-500
                          hover:bg-gray-100
                        "
                      >
  
                        {expandida ? (
  
                          <ChevronDown className="h-4 w-4" />
  
                        ) : (
  
                          <ChevronRight className="h-4 w-4" />
  
                        )}
  
                      </button>
  
  
                      {/* ORDEM */}
  
                      <div
                        className="
                          flex
                          h-9
                          w-9
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
  
  
                      {/* INFORMAÇÕES */}
  
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
  
  
                      {/* STATUS */}
  
                      <span
                        className="
                          rounded-full
                          bg-gray-100
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-gray-600
                        "
                      >
                        {tarefa.status}
                      </span>
  
  
                      {/* EXCLUIR */}
  
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
  
  
                        {subtarefas.length > 0 ? (
  
                          <div className="space-y-2">
  
                            {subtarefas.map(
                              (subtarefa) => (
  
                                <div
                                  key={subtarefa.id}
  
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
                                    sm:flex-row
                                    sm:items-center
                                  "
                                >
  
  
                                  <span
                                    className="
                                      flex
                                      h-7
                                      min-w-[42px]
                                      items-center
                                      justify-center
                                      rounded-md
                                      bg-gray-100
                                      px-2
                                      text-[10px]
                                      font-bold
                                      text-gray-500
                                    "
                                  >
                                    {tarefa.order}.
                                    {subtarefa.order}
                                  </span>
  
  
                                  <div className="min-w-0 flex-1">
  
                                    <p
                                      className="
                                        text-sm
                                        font-medium
                                        text-gray-700
                                      "
                                    >
                                      {subtarefa.title}
                                    </p>
  
  
                                    <p
                                      className="
                                        mt-0.5
                                        text-[11px]
                                        text-gray-400
                                      "
                                    >
                                      {subtarefa.responsible}
                                    </p>
  
                                  </div>
  
  
                                  <span
                                    className="
                                      rounded-full
                                      bg-gray-100
                                      px-2.5
                                      py-1
                                      text-[11px]
                                      font-medium
                                      text-gray-600
                                    "
                                  >
                                    {subtarefa.status}
                                  </span>
  
  
                                  <span
                                    className="
                                      w-12
                                      text-right
                                      text-xs
                                      font-semibold
                                      text-gray-500
                                    "
                                  >
                                    {subtarefa.progress}%
                                  </span>
  
  
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
                                      items-center
                                      justify-center
                                      rounded-lg
                                      text-gray-400
                                      hover:bg-red-50
                                      hover:text-red-600
                                    "
  
                                    title="Excluir subtarefa"
                                  >
  
                                    <Trash2 className="h-3.5 w-3.5" />
  
                                  </button>
  
                                </div>
  
                              )
                            )}
  
                          </div>
  
                        ) : (
  
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
  
                            <p className="text-xs text-gray-400">
                              Nenhuma subtarefa cadastrada.
                            </p>
  
                          </div>
  
                        )}
  
  
                        {/* NOVA SUBTAREFA */}
  
                        <button
                          type="button"
  
                          onClick={() =>
                            setTarefaSelecionada(
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
            MODAL NOVA TAREFA
            ====================================================== */}
  
        {modalNovaTarefaAberto && (
  
          <AddTaskModal
            proximaOrdem={
              proximaOrdemDaTarefa
            }
  
            aoCriar={
              adicionarTarefa
            }
  
            aoFechar={() =>
              setModalNovaTarefaAberto(
                false
              )
            }
          />
  
        )}
  
  
        {/* ======================================================
            MODAL NOVA SUBTAREFA
            ====================================================== */}
  
        {tarefaSelecionada && (
  
          <AddSubtaskModal
  
            proximaOrdem={
  
              tarefaSelecionada
                .subtasks?.length
  
                ? Math.max(
                    ...tarefaSelecionada
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
                tarefaSelecionada.id,
                subtarefa
              )
  
            }
  
            aoFechar={() =>
              setTarefaSelecionada(
                null
              )
            }
          />
  
        )}
  
      </div>
  
    );
  }