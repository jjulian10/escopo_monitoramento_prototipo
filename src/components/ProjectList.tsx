import { useState } from 'react';

import {
  Calendar,
  User,
  ArrowRight,
  KeyRound,
  Plus,
  Minus,
  ListChecks,
  Columns3,
} from 'lucide-react';

import type {
  Project,
  StatusType,
  AccessLevel,
  TaskStatusType,
} from '@/data/projects';

import ProjectTags from '@/components/project-tags/ProjectTags';

import ProjectDetailsModal from '@/components/project-details/ProjectDetailsModal';


/* ============================================================
   PROPRIEDADES DA LISTA DE PROJETOS
   ============================================================ */

interface ListaDeProjetosProps {
  projects: Project[];

  title: string;

  badge: number;

  showAccess?: boolean;

  /*
   * Recebe do App.tsx a função responsável por atualizar
   * o projeto no estado principal da aplicação.
   */
  aoAtualizarProjeto?: (
    projeto: Project
  ) => void;
}


/* ============================================================
   CONFIGURAÇÃO DOS STATUS DOS PROJETOS
   ============================================================ */

const configuracaoDosStatus: Record<
  StatusType,
  {
    corDoPonto: string;
    corDoTexto: string;
  }
> = {
  'Em andamento': {
    corDoPonto: 'bg-blue-500',
    corDoTexto: 'text-blue-700',
  },

  Atrasado: {
    corDoPonto: 'bg-red-500',
    corDoTexto: 'text-red-700',
  },

  Pausado: {
    corDoPonto: 'bg-gray-400',
    corDoTexto: 'text-gray-600',
  },

  Concluído: {
    corDoPonto: 'bg-green-500',
    corDoTexto: 'text-green-700',
  },
};


/* ============================================================
   CONFIGURAÇÃO DOS STATUS DAS TAREFAS
   ============================================================ */

const configuracaoStatusTarefa: Record<
  TaskStatusType,
  {
    ponto: string;
    texto: string;
    fundo: string;
  }
> = {
  'Não iniciado': {
    ponto: 'bg-gray-400',
    texto: 'text-gray-600',
    fundo: 'bg-gray-50',
  },

  'Em andamento': {
    ponto: 'bg-blue-500',
    texto: 'text-blue-700',
    fundo: 'bg-blue-50/40',
  },

  Homologação: {
    ponto: 'bg-amber-500',
    texto: 'text-amber-700',
    fundo: 'bg-amber-50/40',
  },

  Concluído: {
    ponto: 'bg-green-500',
    texto: 'text-green-700',
    fundo: 'bg-green-50/40',
  },
};


/* ============================================================
   NÍVEIS DE ACESSO
   ============================================================ */

const estilosDeAcesso: Record<
  AccessLevel,
  string
> = {
  Colaborador:
    'bg-blue-50 text-blue-600',

  Editor:
    'bg-violet-50 text-violet-600',

  Visualizador:
    'bg-gray-100 text-gray-500',
};


/* ============================================================
   COR DO PROGRESSO DO PROJETO
   ============================================================ */

function definirCorDoProgresso(
  progresso: number,
  status: StatusType
) {
  if (status === 'Concluído') {
    return 'bg-green-500';
  }

  if (status === 'Atrasado') {
    return 'bg-red-500';
  }

  if (status === 'Pausado') {
    return 'bg-gray-400';
  }

  if (progresso < 50) {
    return 'bg-amber-500';
  }

  return 'bg-institution-600';
}


/* ============================================================
   COR DO PROGRESSO DA TAREFA
   ============================================================ */

function definirCorProgressoTarefa(
  status: TaskStatusType
) {
  if (status === 'Concluído') {
    return 'bg-green-500';
  }

  if (status === 'Homologação') {
    return 'bg-amber-500';
  }

  if (status === 'Não iniciado') {
    return 'bg-gray-400';
  }

  return 'bg-blue-500';
}


/* ============================================================
   PROPRIEDADES DA LINHA DO PROJETO
   ============================================================ */

interface LinhaDoProjetoProps {
  projeto: Project;

  indice: number;

  mostrarAcesso?: boolean;

  aoAbrirDetalhes: (
    projeto: Project
  ) => void;

  aoAbrirKanban: (
    projeto: Project
  ) => void;
}


/* ============================================================
   COMPONENTE: LINHA DO PROJETO
   ============================================================ */

function LinhaDoProjeto({
  projeto,
  indice,
  mostrarAcesso,
  aoAbrirDetalhes,
  aoAbrirKanban,
}: LinhaDoProjetoProps) {


  /* ==========================================================
     CONTROLE DAS TAREFAS EXPANDIDAS
     ========================================================== */

  const [
    estaExpandido,
    setEstaExpandido,
  ] = useState(false);


  /* ==========================================================
     CONFIGURAÇÃO DO STATUS
     ========================================================== */

  const configuracaoStatus =
    configuracaoDosStatus[
      projeto.status
    ];


  /* ==========================================================
     ABRIR / FECHAR TAREFAS
     ========================================================== */

  function alternarTarefas() {
    setEstaExpandido(
      (estadoAtual) => !estadoAtual
    );
  }


  return (

    <div
      className="
        animate-fade-in-up
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-card
        transition-all
        hover:border-institution-200
        hover:shadow-card-hover
      "
      style={{
        animationDelay: `${indice * 60}ms`,
      }}
    >


      {/* ======================================================
          LINHA PRINCIPAL
          ====================================================== */}

      <div className="p-5">

        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:gap-6
          "
        >


          {/* ==================================================
              NÚMERO
              ================================================== */}

          <div className="flex-shrink-0">

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-institution-200
                bg-institution-50
                text-sm
                font-bold
                text-institution-700
              "
            >
              {indice + 1}
            </div>

          </div>


          {/* ==================================================
              NOME + ETIQUETAS
              ================================================== */}

          <div className="min-w-0 flex-1 lg:max-w-[320px]">

            <h3
              className="
                text-sm
                font-semibold
                leading-snug
                text-gray-800
              "
            >

              <span className="text-institution-700">
                {projeto.code}
              </span>

              {' — '}

              {projeto.title}

            </h3>


            <ProjectTags
              etiquetasIniciais={
                projeto.tags
              }
            />


            {/* ==================================================
                NÍVEL DE ACESSO
                ================================================== */}

            {mostrarAcesso &&
              projeto.accessLevel && (

                <div className="mt-1.5">

                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-1
                      rounded-md
                      px-2
                      py-0.5
                      text-[11px]
                      font-medium

                      ${
                        estilosDeAcesso[
                          projeto.accessLevel
                        ]
                      }
                    `}
                  >

                    <KeyRound className="h-3 w-3" />

                    {projeto.accessLevel}

                  </span>

                </div>

              )}

          </div>


          {/* ==================================================
              STATUS
              ================================================== */}

          <div className="flex-shrink-0 lg:w-28">

            <div className="flex items-center gap-2">

              <span
                className={`
                  h-2
                  w-2
                  rounded-full

                  ${configuracaoStatus.corDoPonto}
                `}
              />

              <span
                className={`
                  whitespace-nowrap
                  text-sm
                  font-medium

                  ${configuracaoStatus.corDoTexto}
                `}
              >
                {projeto.status}
              </span>

            </div>

          </div>


          {/* ==================================================
              PROGRESSO
              ================================================== */}

          <div className="flex-shrink-0 lg:w-36">

            <div
              className="
                mb-1
                flex
                items-center
                justify-between
              "
            >

              <span className="text-xs text-gray-500">
                Progresso
              </span>

              <span className="text-xs font-bold text-gray-700">
                {projeto.progress}%
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

                  ${definirCorDoProgresso(
                    projeto.progress,
                    projeto.status
                  )}
                `}
                style={{
                  width:
                    `${projeto.progress}%`,
                }}
              />

            </div>

          </div>


          {/* ==================================================
              ENTREGA ESTIMADA
              ================================================== */}

          <div className="flex-shrink-0 lg:w-28">

            <div className="flex items-center gap-1.5">

              <Calendar
                className="
                  h-3.5
                  w-3.5
                  text-gray-400
                "
              />

              <span className="text-[11px] text-gray-400">
                Entrega estimada
              </span>

            </div>


            <p className="mt-0.5 text-sm font-medium text-gray-700">
              {projeto.deliveryDate}
            </p>

          </div>


          {/* ==================================================
              RESPONSÁVEL
              ================================================== */}

          <div className="flex-shrink-0 lg:w-28">

            <div className="flex items-center gap-1.5">

              <User
                className="
                  h-3.5
                  w-3.5
                  text-gray-400
                "
              />

              <span className="text-[11px] text-gray-400">
                Responsável
              </span>

            </div>


            <p className="mt-0.5 text-sm font-medium text-gray-700">
              {projeto.responsible}
            </p>

          </div>


          {/* ==================================================
              AÇÕES
              ================================================== */}

          <div
            className="
              flex
              flex-shrink-0
              items-center
              gap-2
              lg:ml-auto
            "
          >


            {/* VER DETALHES */}

            <button
              onClick={() =>
                aoAbrirDetalhes(
                  projeto
                )
              }
              className="
                flex
                items-center
                gap-1
                whitespace-nowrap
                rounded-lg
                border
                border-gray-200
                px-3
                py-2
                text-sm
                font-medium
                text-institution-600
                transition-all
                hover:border-institution-200
                hover:bg-institution-50
              "
            >

              Ver detalhes

              <ArrowRight className="h-4 w-4" />

            </button>


            {/* KANBAN */}

            <button
              onClick={() =>
                aoAbrirKanban(
                  projeto
                )
              }
              className="
                flex
                items-center
                gap-1.5
                whitespace-nowrap
                rounded-lg
                border
                border-gray-200
                px-3
                py-2
                text-sm
                font-medium
                text-institution-600
                transition-all
                hover:border-institution-200
                hover:bg-institution-50
              "
              title="Abrir Kanban deste projeto"
            >

              <Columns3 className="h-4 w-4" />

              Kanban

            </button>


            {/* EXPANDIR TAREFAS */}

            <button
              onClick={
                alternarTarefas
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                text-institution-600
                transition-all
                hover:border-institution-200
                hover:bg-institution-50
              "
              title={
                estaExpandido
                  ? 'Recolher tarefas'
                  : 'Visualizar tarefas'
              }
            >

              {estaExpandido ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}

            </button>

          </div>

        </div>

      </div>


      {/* ======================================================
          ÁREA EXPANDIDA — TAREFAS
          ====================================================== */}

      {estaExpandido && (

        <div
          className="
            border-t
            border-gray-100
            bg-slate-50/60
            px-5
            py-5
          "
        >


          {/* CABEÇALHO */}

          <div
            className="
              mb-4
              flex
              items-center
              justify-between
            "
          >

            <div className="flex items-center gap-2">

              <ListChecks
                className="
                  h-4
                  w-4
                  text-institution-600
                "
              />

              <h4
                className="
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Tarefas do Projeto
              </h4>

            </div>


            <span className="text-xs text-gray-400">

              {projeto.tasks?.length ?? 0}{' '}

              {projeto.tasks?.length === 1
                ? 'tarefa'
                : 'tarefas'}

            </span>

          </div>


          {/* TAREFAS */}

          {projeto.tasks &&
          projeto.tasks.length > 0 ? (

            <div className="space-y-2.5">

              {projeto.tasks.map(
                (tarefa) => {


                  const statusTarefa =
                    configuracaoStatusTarefa[
                      tarefa.status
                    ];


                  return (

                    <div
                      key={
                        tarefa.id
                      }
                      className={`
                        rounded-lg
                        border
                        border-gray-200
                        p-4
                        transition-all
                        hover:border-institution-200

                        ${statusTarefa.fundo}
                      `}
                    >

                      <div
                        className="
                          flex
                          flex-col
                          gap-4
                          md:flex-row
                          md:items-center
                        "
                      >


                        {/* NÚMERO */}

                        <div
                          className="
                            flex
                            h-7
                            w-7
                            flex-shrink-0
                            items-center
                            justify-center
                            rounded-md
                            bg-gray-700
                            text-xs
                            font-bold
                            text-white
                          "
                        >
                          {tarefa.order}
                        </div>


                        {/* NOME */}

                        <div className="min-w-0 flex-1">

                          <p className="text-sm font-medium text-gray-700">
                            {tarefa.title}
                          </p>

                        </div>


                        {/* STATUS */}

                        <div className="flex-shrink-0 md:w-32">

                          <div className="flex items-center gap-1.5">

                            <span
                              className={`
                                h-2
                                w-2
                                rounded-full

                                ${statusTarefa.ponto}
                              `}
                            />

                            <span
                              className={`
                                whitespace-nowrap
                                text-xs
                                font-medium

                                ${statusTarefa.texto}
                              `}
                            >
                              {tarefa.status}
                            </span>

                          </div>

                        </div>


                        {/* PROGRESSO */}

                        <div className="flex-shrink-0 md:w-32">

                          <div
                            className="
                              mb-1
                              flex
                              justify-between
                            "
                          >

                            <span className="text-[10px] text-gray-400">
                              Progresso
                            </span>

                            <span className="text-[10px] font-bold text-gray-600">
                              {tarefa.progress}%
                            </span>

                          </div>


                          <div
                            className="
                              h-1
                              overflow-hidden
                              rounded-full
                              bg-gray-200
                            "
                          >

                            <div
                              className={`
                                h-full
                                rounded-full

                                ${definirCorProgressoTarefa(
                                  tarefa.status
                                )}
                              `}
                              style={{
                                width:
                                  `${tarefa.progress}%`,
                              }}
                            />

                          </div>

                        </div>


                        {/* RESPONSÁVEL */}

                        <div className="flex-shrink-0 md:w-32">

                          <p className="text-[10px] text-gray-400">
                            Responsável
                          </p>

                          <p className="text-xs font-medium text-gray-600">
                            {tarefa.responsible}
                          </p>

                        </div>


                        {/* DETALHES */}

                        <div className="flex-shrink-0">

                          <button
                            onClick={() =>
                              aoAbrirDetalhes(
                                projeto
                              )
                            }
                            className="
                              flex
                              items-center
                              gap-1
                              whitespace-nowrap
                              text-xs
                              font-medium
                              text-institution-600
                              transition-colors
                              hover:text-institution-800
                            "
                          >

                            Ver detalhes

                            <ArrowRight className="h-3.5 w-3.5" />

                          </button>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          ) : (

            /* =================================================
               SEM TAREFAS
               ================================================= */

            <div
              className="
                rounded-lg
                border
                border-dashed
                border-gray-300
                bg-white
                px-4
                py-8
                text-center
              "
            >

              <ListChecks
                className="
                  mx-auto
                  mb-2
                  h-6
                  w-6
                  text-gray-300
                "
              />

              <p className="text-sm font-medium text-gray-500">
                Nenhuma tarefa cadastrada.
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Este projeto ainda não possui tarefas vinculadas.
              </p>

            </div>

          )}

        </div>

      )}

    </div>
  );
}


/* ============================================================
   COMPONENTE PRINCIPAL: LISTA DE PROJETOS
   ============================================================ */

export default function ProjectList({
  projects: projetos,
  title: titulo,
  badge: quantidade,
  showAccess: mostrarAcesso,
  aoAtualizarProjeto,
}: ListaDeProjetosProps) {


  /* ==========================================================
     PROJETO SELECIONADO
     ========================================================== */

  const [
    projetoSelecionado,
    setProjetoSelecionado,
  ] = useState<Project | null>(
    null
  );


  /* ==========================================================
     SEÇÃO INICIAL DO MODAL
     ========================================================== */

  const [
    secaoInicialDoModal,
    setSecaoInicialDoModal,
  ] = useState<
    'informacoes' | 'kanban'
  >('informacoes');


  /* ==========================================================
     ABRIR DETALHES
     ========================================================== */

  function abrirDetalhes(
    projeto: Project
  ) {

    setSecaoInicialDoModal(
      'informacoes'
    );

    setProjetoSelecionado(
      projeto
    );

  }


  /* ==========================================================
     ABRIR KANBAN
     ========================================================== */

  function abrirKanban(
    projeto: Project
  ) {

    setSecaoInicialDoModal(
      'kanban'
    );

    setProjetoSelecionado(
      projeto
    );

  }


  /* ==========================================================
     ATUALIZAR PROJETO
     ==========================================================

     O modal altera o projeto e envia o novo objeto para cá.

     Atualizamos também o projetoSelecionado para que o modal
     reflita imediatamente a alteração sem precisar ser fechado.

     Depois repassamos a alteração para o App.tsx.
     ========================================================== */

  function atualizarProjeto(
    projetoAtualizado: Project
  ) {

    setProjetoSelecionado(
      projetoAtualizado
    );


    aoAtualizarProjeto?.(
      projetoAtualizado
    );

  }


  /* ==========================================================
     INTERFACE
     ========================================================== */

  return (

    <section>


      {/* ======================================================
          CABEÇALHO DA LISTA
          ====================================================== */}

      <div
        className="
          mb-4
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
        "
      >

        <div className="flex items-center gap-3">

          <h2 className="text-lg font-semibold text-gray-800">
            {titulo}
          </h2>


          <span
            className="
              flex
              h-6
              min-w-[24px]
              items-center
              justify-center
              rounded-full
              bg-institution-100
              px-2
              text-xs
              font-bold
              text-institution-700
            "
          >
            {quantidade}
          </span>

        </div>


        {/* ====================================================
            ORDENAÇÃO
            ==================================================== */}

        <div className="flex items-center gap-2">

          <label className="text-sm text-gray-500">
            Ordenar por:
          </label>


          <select
            className="
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2
              text-sm
              text-gray-700
            "
          >

            <option>
              Mais recentes
            </option>

            <option>
              Mais antigos
            </option>

            <option>
              Maior progresso
            </option>

            <option>
              Menor progresso
            </option>

            <option>
              Data de entrega
            </option>

          </select>

        </div>

      </div>


      {/* ======================================================
          LISTA DOS PROJETOS
          ====================================================== */}

      <div className="space-y-3">

        {projetos.length > 0 ? (

          projetos.map(
            (
              projeto,
              indice
            ) => (

              <LinhaDoProjeto

                key={
                  projeto.id
                }

                projeto={
                  projeto
                }

                indice={
                  indice
                }

                mostrarAcesso={
                  mostrarAcesso
                }

                aoAbrirDetalhes={
                  abrirDetalhes
                }

                aoAbrirKanban={
                  abrirKanban
                }

              />

            )
          )

        ) : (

          <div
            className="
              rounded-xl
              border
              border-dashed
              border-gray-300
              bg-white
              p-10
              text-center
            "
          >

            <p className="text-sm font-medium text-gray-600">
              Nenhum projeto encontrado.
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Altere ou limpe os filtros para visualizar outros projetos.
            </p>

          </div>

        )}

      </div>


      {/* ======================================================
          MODAL DE DETALHES / KANBAN
          ====================================================== */}

      {projetoSelecionado && (

        <ProjectDetailsModal

          projeto={
            projetoSelecionado
          }

          secaoInicial={
            secaoInicialDoModal
          }

          aoFechar={() =>
            setProjetoSelecionado(
              null
            )
          }

          aoAtualizarProjeto={
            atualizarProjeto
          }

        />

      )}

    </section>
  );
}