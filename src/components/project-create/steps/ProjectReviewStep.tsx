import {
    CheckCircle2,
    FileText,
    Layers3,
    ListChecks,
    User,
  } from 'lucide-react';
  
  import type {
    ProjectTask,
  } from '@/data/projects';
  
  import type {
    InformacoesBasicasProjeto,
  } from './ProjectBasicInfoStep';
  
  
  /* ============================================================
     PROPRIEDADES
     ============================================================ */
  
  interface ProjectReviewStepProps {
    informacoes: InformacoesBasicasProjeto;
  
    tarefas: ProjectTask[];
  }
  
  
  /* ============================================================
     COMPONENTE
     ============================================================ */
  
  export default function ProjectReviewStep({
    informacoes,
    tarefas,
  }: ProjectReviewStepProps) {
  
  
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
  
  
    return (
  
      <div className="space-y-6">
  
  
        {/* ======================================================
            CABEÇALHO
            ====================================================== */}
  
        <div>
  
          <div className="flex items-center gap-2">
  
            <CheckCircle2
              className="
                h-5
                w-5
                text-green-600
              "
            />
  
            <h2
              className="
                text-lg
                font-semibold
                text-gray-800
              "
            >
              Revisão do Projeto
            </h2>
  
          </div>
  
  
          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Revise as informações antes de criar o projeto.
          </p>
  
        </div>
  
  
        {/* ======================================================
            RESUMO
            ====================================================== */}
  
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
  
  
          {/* TAREFAS */}
  
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
  
            <p
              className="
                text-xs
                font-medium
                text-gray-400
              "
            >
              Tarefas
            </p>
  
  
            <p
              className="
                mt-1
                text-2xl
                font-bold
                text-gray-800
              "
            >
              {tarefas.length}
            </p>
  
          </div>
  
  
          {/* SUBTAREFAS */}
  
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
  
            <p
              className="
                text-xs
                font-medium
                text-gray-400
              "
            >
              Subtarefas
            </p>
  
  
            <p
              className="
                mt-1
                text-2xl
                font-bold
                text-gray-800
              "
            >
              {totalDeSubtarefas}
            </p>
  
          </div>
  
  
          {/* ORIGEM */}
  
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
  
            <p
              className="
                text-xs
                font-medium
                text-gray-400
              "
            >
              Origem
            </p>
  
  
            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-gray-700
              "
            >
              {informacoes.origem || 'Não informado'}
            </p>
  
          </div>
  
  
          {/* NÍVEL */}
  
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
  
            <p
              className="
                text-xs
                font-medium
                text-gray-400
              "
            >
              Nível
            </p>
  
  
            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-gray-700
              "
            >
              {informacoes.nivel || 'Não informado'}
            </p>
  
          </div>
  
        </div>
  
  
        {/* ======================================================
            INFORMAÇÕES PRINCIPAIS
            ====================================================== */}
  
        <section
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
          "
        >
  
          <div
            className="
              mb-5
              flex
              items-center
              gap-2
            "
          >
  
            <FileText
              className="
                h-5
                w-5
                text-institution-600
              "
            />
  
            <h3
              className="
                text-sm
                font-semibold
                text-gray-800
              "
            >
              Informações
            </h3>
  
          </div>
  
  
          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
            "
          >
  
  
            {/* NOME */}
  
            <div className="sm:col-span-2">
  
              <p
                className="
                  text-xs
                  font-medium
                  text-gray-400
                "
              >
                Nome
              </p>
  
  
              <p
                className="
                  mt-1
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                {informacoes.nome}
              </p>
  
            </div>
  
  
            {/* DESCRIÇÃO */}
  
            <div className="sm:col-span-2">
  
              <p
                className="
                  text-xs
                  font-medium
                  text-gray-400
                "
              >
                Descrição
              </p>
  
  
              <p
                className="
                  mt-1
                  whitespace-pre-line
                  text-sm
                  leading-relaxed
                  text-gray-600
                "
              >
                {informacoes.descricao ||
                  'Nenhuma descrição informada.'}
              </p>
  
            </div>
  
  
            {/* DATA */}
  
            <div>
  
              <p
                className="
                  text-xs
                  font-medium
                  text-gray-400
                "
              >
                Data de criação
              </p>
  
  
              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                {informacoes.dataCriacao}
              </p>
  
            </div>
  
  
            {/* PROJETO PAI */}
  
            <div>
  
              <p
                className="
                  text-xs
                  font-medium
                  text-gray-400
                "
              >
                Projeto pai
              </p>
  
  
              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                {informacoes.projetoPai ||
                  'Projeto raiz'}
              </p>
  
            </div>
  
          </div>
  
        </section>
  
  
        {/* ======================================================
            ESTRUTURA
            ====================================================== */}
  
        <section
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
          "
        >
  
          <div
            className="
              mb-5
              flex
              items-center
              gap-2
            "
          >
  
            <Layers3
              className="
                h-5
                w-5
                text-institution-600
              "
            />
  
  
            <div>
  
              <h3
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                Estrutura do Projeto
              </h3>
  
  
              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                Tarefas e subtarefas que serão criadas.
              </p>
  
            </div>
  
          </div>
  
  
          <div className="space-y-3">
  
            {tarefas.map(
              (tarefa) => {
  
                const subtarefas =
                  tarefa.subtasks ?? [];
  
  
                return (
  
                  <div
                    key={tarefa.id}
  
                    className="
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-200
                    "
                  >
  
  
                    {/* TAREFA */}
  
                    <div
                      className="
                        flex
                        flex-col
                        gap-3
                        bg-white
                        px-4
                        py-4
                        sm:flex-row
                        sm:items-center
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
                          rounded-full
                          bg-institution-100
                          text-xs
                          font-bold
                          text-institution-700
                        "
                      >
                        {tarefa.order}
                      </div>
  
  
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
  
  
                          <span
                            className="
                              flex
                              items-center
                              gap-1
                            "
                          >
                            <ListChecks className="h-3.5 w-3.5" />
  
                            {subtarefas.length}{' '}
  
                            {subtarefas.length === 1
                              ? 'subtarefa'
                              : 'subtarefas'}
                          </span>
  
                        </div>
  
                      </div>
  
  
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
  
                    </div>
  
  
                    {/* SUBTAREFAS */}
  
                    {subtarefas.length > 0 && (
  
                      <div
                        className="
                          space-y-2
                          border-t
                          border-gray-100
                          bg-slate-50/60
                          px-5
                          py-4
                        "
                      >
  
                        {subtarefas.map(
                          (subtarefa) => (
  
                            <div
                              key={subtarefa.id}
  
                              className="
                                flex
                                flex-col
                                gap-2
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
                                  h-6
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
  
                            </div>
  
                          )
                        )}
  
                      </div>
  
                    )}
  
                  </div>
  
                );
  
              }
            )}
  
          </div>
  
        </section>
  
      </div>
  
    );
  }