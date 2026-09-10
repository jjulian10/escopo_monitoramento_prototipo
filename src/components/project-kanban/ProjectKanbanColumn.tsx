import type {
  ElementType,
} from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  PauseCircle,
} from 'lucide-react';

import {
  useDroppable,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import type {
  Project,
  StatusType,
} from '@/data/projects';

import ProjectKanbanCard from './ProjectKanbanCard';


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface ProjectKanbanColumnProps {
  status: StatusType;

  projetos: Project[];

  aoAbrirProjeto: (
    projeto: Project
  ) => void;
}


/* ============================================================
   CONFIGURAÇÃO VISUAL DAS COLUNAS
   ============================================================ */

const configuracaoDasColunas: Record<
  StatusType,
  {
    titulo: string;
    descricao: string;
    Icone: ElementType;
    fundoCabecalho: string;
    bordaCabecalho: string;
    corIcone: string;
    corContador: string;
  }
> = {

  'Em andamento': {
    titulo:
      'Em andamento',

    descricao:
      'Projetos atualmente em execução.',

    Icone:
      Clock3,

    fundoCabecalho:
      'bg-blue-50',

    bordaCabecalho:
      'border-blue-200',

    corIcone:
      'text-blue-600',

    corContador:
      'text-blue-700',
  },


  Atrasado: {
    titulo:
      'Atrasado',

    descricao:
      'Projetos com prazo vencido.',

    Icone:
      AlertTriangle,

    fundoCabecalho:
      'bg-red-50',

    bordaCabecalho:
      'border-red-200',

    corIcone:
      'text-red-600',

    corContador:
      'text-red-700',
  },


  Pausado: {
    titulo:
      'Pausado',

    descricao:
      'Projetos temporariamente interrompidos.',

    Icone:
      PauseCircle,

    fundoCabecalho:
      'bg-slate-50',

    bordaCabecalho:
      'border-slate-200',

    corIcone:
      'text-slate-500',

    corContador:
      'text-slate-700',
  },


  Concluído: {
    titulo:
      'Concluído',

    descricao:
      'Entrada automática após concluir toda a estrutura.',

    Icone:
      CheckCircle2,

    fundoCabecalho:
      'bg-green-50',

    bordaCabecalho:
      'border-green-200',

    corIcone:
      'text-green-600',

    corContador:
      'text-green-700',
  },

};


/* ============================================================
   COMPONENTE
   ============================================================ */

export default function ProjectKanbanColumn({
  status,
  projetos,
  aoAbrirProjeto,
}: ProjectKanbanColumnProps) {


  /* ==========================================================
     COLUNA PROTEGIDA
     ========================================================== */

  const colunaConcluida =
    status ===
    'Concluído';


  /* ==========================================================
     DROPPABLE
     ========================================================== */

  const {
    setNodeRef,
    isOver,
  } = useDroppable({

    id:
      status,

    /*
     * Apesar da coluna Concluído possuir uma área droppable,
     * a regra final será bloqueada no GlobalProjectKanban.
     *
     * Isso permite detectar a tentativa de conclusão e,
     * posteriormente, abrir o modal informando as pendências.
     */
    data: {
      tipo:
        'coluna-projeto',

      status,

      bloqueada:
        colunaConcluida,
    },

  });


  /* ==========================================================
     CONFIGURAÇÃO
     ========================================================== */

  const configuracao =
    configuracaoDasColunas[
      status
    ];


  const Icone =
    configuracao.Icone;


  /* ==========================================================
     IDs DOS PROJETOS
     ========================================================== */

  const idsDosProjetos =
    projetos.map(
      (projeto) =>
        projeto.id
    );


  /* ==========================================================
     INTERFACE
     ========================================================== */

  return (

    <section
      ref={
        setNodeRef
      }

      className={`
        min-w-0
        rounded-2xl
        border
        p-3
        transition-all
        duration-200

        ${
          colunaConcluida
            ? `
              border-green-200
              bg-green-50/20
            `
            : isOver
            ? `
              border-institution-300
              bg-institution-50/40
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


      {/* ======================================================
          CABEÇALHO
          ====================================================== */}

      <div
        className={`
          rounded-xl
          border
          p-4

          ${configuracao.fundoCabecalho}

          ${configuracao.bordaCabecalho}
        `}
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
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

            <div
              className="
                flex
                h-8
                w-8
                flex-shrink-0
                items-center
                justify-center
                rounded-lg
                bg-white
                shadow-sm
              "
            >

              <Icone
                className={`
                  h-4
                  w-4

                  ${configuracao.corIcone}
                `}
              />

            </div>


            <div
              className="
                min-w-0
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >

                <h2
                  className="
                    truncate
                    text-sm
                    font-bold
                    text-gray-800
                  "
                >
                  {configuracao.titulo}
                </h2>


                {colunaConcluida && (

                  <LockKeyhole
                    className="
                      h-3.5
                      w-3.5
                      flex-shrink-0
                      text-green-600
                    "
                  />

                )}

              </div>


              <p
                className="
                  mt-0.5
                  text-[11px]
                  leading-snug
                  text-gray-500
                "
              >
                {configuracao.descricao}
              </p>

            </div>

          </div>


          {/* ==================================================
              CONTADOR
              ================================================== */}

          <span
            className={`
              flex
              h-7
              min-w-[28px]
              flex-shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              px-2
              text-xs
              font-bold
              shadow-sm

              ${configuracao.corContador}
            `}
          >
            {projetos.length}
          </span>

        </div>

      </div>


      {/* ======================================================
          AVISO — CONCLUÍDO
          ====================================================== */}

      {colunaConcluida && (

        <div
          className="
            mt-3
            flex
            items-start
            gap-2
            rounded-lg
            border
            border-green-100
            bg-green-50/70
            px-3
            py-2.5
          "
        >

          <LockKeyhole
            className="
              mt-0.5
              h-3.5
              w-3.5
              flex-shrink-0
              text-green-600
            "
          />


          <p
            className="
              text-[10px]
              leading-relaxed
              text-green-700
            "
          >
            A conclusão é automática após todas as tarefas e subtarefas serem finalizadas.
          </p>

        </div>

      )}


      {/* ======================================================
          PROJETOS
          ====================================================== */}

      <SortableContext
        items={
          idsDosProjetos
        }

        strategy={
          verticalListSortingStrategy
        }
      >

        <div
          className="
            mt-3
            min-h-[250px]
            space-y-3
          "
        >

          {projetos.length > 0 ? (

            projetos.map(
              (projeto) => (

                <ProjectKanbanCard
                  key={
                    projeto.id
                  }

                  projeto={
                    projeto
                  }

                  aoAbrirProjeto={
                    aoAbrirProjeto
                  }

                  permitirArrastar={
                    !colunaConcluida
                  }
                />

              )
            )

          ) : (

            /* =================================================
               COLUNA VAZIA
               ================================================= */

            <div
              className={`
                flex
                min-h-[220px]
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                px-4
                text-center
                transition-all

                ${
                  colunaConcluida
                    ? `
                      border-green-200
                      bg-green-50/30
                    `
                    : isOver
                    ? `
                      border-institution-300
                      bg-institution-50
                    `
                    : `
                      border-gray-300
                      bg-white/60
                    `
                }
              `}
            >

              <div>

                {colunaConcluida ? (

                  <LockKeyhole
                    className="
                      mx-auto
                      h-6
                      w-6
                      text-green-300
                    "
                  />

                ) : (

                  <Icone
                    className="
                      mx-auto
                      h-6
                      w-6
                      text-gray-300
                    "
                  />

                )}


                <p
                  className={`
                    mt-2
                    text-xs
                    font-medium

                    ${
                      colunaConcluida
                        ? 'text-green-500'
                        : 'text-gray-400'
                    }
                  `}
                >

                  {colunaConcluida
                    ? 'Conclusão automática'
                    : isOver
                    ? 'Solte o projeto aqui'
                    : 'Nenhum projeto'}

                </p>


                <p
                  className={`
                    mt-1
                    text-[10px]

                    ${
                      colunaConcluida
                        ? 'text-green-400'
                        : 'text-gray-300'
                    }
                  `}
                >

                  {colunaConcluida
                    ? 'Projetos concluídos aparecerão aqui automaticamente.'
                    : isOver
                    ? `Alterar status para ${status}`
                    : 'Não existem projetos com este status.'}

                </p>

              </div>

            </div>

          )}

        </div>

      </SortableContext>

    </section>

  );
}