import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Layers3,
  ListChecks,
  User,
  Users,
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
   FUNÇÃO AUXILIAR: FORMATAR DATA
   ============================================================ */

function formatarData(
  data?: string
) {

  if (!data) {
    return 'Não informado';
  }


  const partes =
    data.split('-');


  if (
    partes.length !== 3
  ) {
    return data;
  }


  const [
    ano,
    mes,
    dia,
  ] = partes;


  return `${dia}/${mes}/${ano}`;
}


/* ============================================================
   FUNÇÃO AUXILIAR: FORMATAR TEXTO
   ============================================================ */

function formatarTexto(
  valor?: string
) {

  if (!valor) {
    return 'Não informado';
  }


  const mapa: Record<
    string,
    string
  > = {

    demanda:
      'Demanda',

    melhoria:
      'Melhoria',

    manutencao:
      'Manutenção',

    reparo:
      'Reparo',

    pdtic:
      'PDTIC',

    ptd:
      'PTD',

    abep:
      'ABEP',

    baixo:
      'Baixo',

    medio:
      'Médio',

    alto:
      'Alto',

    estrategico:
      'Estratégico',

    infraestrutura:
      'Infraestrutura e Serviços',

    desenvolvimento:
      'Desenvolvimento de Sistemas',

    governanca:
      'Governança e Planejamento',

    seguranca:
      'Segurança da Informação',

    dados:
      'Dados e Automação',

    'proj-01':
      'PROJ-01 — Modernização da Infraestrutura',

    'proj-02':
      'PROJ-02 — Renovação do Parque de TI',

  };


  return (
    mapa[valor] ??
    valor
  );
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
     INTERFACE
     ========================================================== */

  return (

    <div className="space-y-6">


      {/* ======================================================
          CABEÇALHO
          ====================================================== */}

      <div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

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
          Revise todas as informações antes de criar o projeto.
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
            {formatarTexto(
              informacoes.origem
            )}
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
            {formatarTexto(
              informacoes.nivel
            )}
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


          <div>

            <h3
              className="
                text-sm
                font-semibold
                text-gray-800
              "
            >
              Informações do Projeto
            </h3>


            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Dados gerais e de classificação.
            </p>

          </div>

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


          {/* DATA DE CRIAÇÃO */}

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


            <div
              className="
                mt-1
                flex
                items-center
                gap-1.5
                text-sm
                font-medium
                text-gray-700
              "
            >

              <CalendarDays
                className="
                  h-4
                  w-4
                  text-gray-400
                "
              />

              {formatarData(
                informacoes.dataCriacao
              )}

            </div>

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
              {informacoes.projetoPai
                ? formatarTexto(
                    informacoes.projetoPai
                  )
                : 'Projeto raiz'}
            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          GERENTE DO PROJETO
          ====================================================== */}

      <section
        className="
          rounded-xl
          border
          border-gray-200
          border-l-4
          border-l-green-500
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

          <User
            className="
              h-5
              w-5
              text-green-600
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
              Gerente do Projeto
            </h3>


            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Responsável principal e grupo vinculado.
            </p>

          </div>

        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >

          {/* USUÁRIO */}

          <div>

            <p
              className="
                text-xs
                font-medium
                text-gray-400
              "
            >
              Usuário
            </p>


            <div
              className="
                mt-1
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-gray-700
              "
            >

              <User
                className="
                  h-4
                  w-4
                  text-green-500
                "
              />

              {informacoes.gerenteUsuario ||
                'Não informado'}

            </div>

          </div>


          {/* GRUPO */}

          <div>

            <p
              className="
                text-xs
                font-medium
                text-gray-400
              "
            >
              Grupo
            </p>


            <div
              className="
                mt-1
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-gray-700
              "
            >

              <Users
                className="
                  h-4
                  w-4
                  text-green-500
                "
              />

              {formatarTexto(
                informacoes.gerenteGrupo
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          PLANEJAMENTO
          ====================================================== */}

      <section
        className="
          rounded-xl
          border
          border-gray-200
          border-l-4
          border-l-amber-400
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

          <CalendarDays
            className="
              h-5
              w-5
              text-amber-500
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
              Planejamento
            </h3>


            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Datas previstas para execução e entrega.
            </p>

          </div>

        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-3
          "
        >

          {/* ENTREGA ESTIMADA */}

          <div>

            <p
              className="
                text-xs
                font-medium
                text-gray-400
              "
            >
              Entrega estimada
            </p>


            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-gray-700
              "
            >
              {formatarData(
                informacoes.entregaEstimada
              )}
            </p>

          </div>


          {/* DATA DE INÍCIO */}

          <div>

            <p
              className="
                text-xs
                font-medium
                text-gray-400
              "
            >
              Data de início
            </p>


            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-gray-700
              "
            >
              {formatarData(
                informacoes.dataInicio
              )}
            </p>

          </div>


          {/* DATA DE ENTREGA */}

          <div>

            <p
              className="
                text-xs
                font-medium
                text-gray-400
              "
            >
              Data de entrega
            </p>


            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-gray-700
              "
            >
              {formatarData(
                informacoes.dataEntrega
              )}
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
                tarefa.subtasks ??
                [];


              return (

                <div
                  key={
                    tarefa.id
                  }

                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-gray-200
                  "
                >

                  {/* =================================================
                      TAREFA
                      ================================================= */}

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


                  {/* =================================================
                      SUBTAREFAS
                      ================================================= */}

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
                            key={
                              subtarefa.id
                            }

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