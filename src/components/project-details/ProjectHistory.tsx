import {
  useMemo,
  useState,
} from 'react';

import type {
  ElementType,
} from 'react';

import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CirclePlus,
  Filter,
  History,
  ListChecks,
  Search,
  Tag,
  UserRound,
  X,
  ArrowRightLeft,
  Pencil,
  Trash2,
  UserCog,
  UserPlus,
  UserMinus,
  Users,
} from 'lucide-react';

import type {
  Project,
  ProjectHistoryItem,
  ProjectHistoryType,
} from '@/data/projects';


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface ProjectHistoryProps {
  projeto: Project;
}


/* ============================================================
   CONFIGURAÇÃO VISUAL DOS TIPOS
   ============================================================ */

interface ConfiguracaoTipoHistorico {
  label: string;

  Icone: ElementType;

  fundoIcone: string;

  corIcone: string;

  fundoBadge: string;

  corBadge: string;
}


const configuracaoDosTipos: Record<
  ProjectHistoryType,
  ConfiguracaoTipoHistorico
> = {


  /* ----------------------------------------------------------
     PROJETO
     ---------------------------------------------------------- */

  project_created: {
    label:
      'Projeto',

    Icone:
      CirclePlus,

    fundoIcone:
      'bg-blue-50',

    corIcone:
      'text-blue-600',

    fundoBadge:
      'bg-blue-50',

    corBadge:
      'text-blue-700',
  },


  project_updated: {
    label:
      'Alteração',

    Icone:
      Pencil,

    fundoIcone:
      'bg-violet-50',

    corIcone:
      'text-violet-600',

    fundoBadge:
      'bg-violet-50',

    corBadge:
      'text-violet-700',
  },


  /* ----------------------------------------------------------
     TAREFAS
     ---------------------------------------------------------- */

  task_created: {
    label:
      'Tarefa',

    Icone:
      ListChecks,

    fundoIcone:
      'bg-emerald-50',

    corIcone:
      'text-emerald-600',

    fundoBadge:
      'bg-emerald-50',

    corBadge:
      'text-emerald-700',
  },


  task_updated: {
    label:
      'Tarefa',

    Icone:
      Pencil,

    fundoIcone:
      'bg-amber-50',

    corIcone:
      'text-amber-600',

    fundoBadge:
      'bg-amber-50',

    corBadge:
      'text-amber-700',
  },


  task_deleted: {
    label:
      'Exclusão',

    Icone:
      Trash2,

    fundoIcone:
      'bg-red-50',

    corIcone:
      'text-red-600',

    fundoBadge:
      'bg-red-50',

    corBadge:
      'text-red-700',
  },


  /* ----------------------------------------------------------
     SUBTAREFAS
     ---------------------------------------------------------- */

  subtask_created: {
    label:
      'Subtarefa',

    Icone:
      ListChecks,

    fundoIcone:
      'bg-teal-50',

    corIcone:
      'text-teal-600',

    fundoBadge:
      'bg-teal-50',

    corBadge:
      'text-teal-700',
  },


  subtask_updated: {
    label:
      'Subtarefa',

    Icone:
      Pencil,

    fundoIcone:
      'bg-orange-50',

    corIcone:
      'text-orange-600',

    fundoBadge:
      'bg-orange-50',

    corBadge:
      'text-orange-700',
  },


  subtask_deleted: {
    label:
      'Exclusão',

    Icone:
      Trash2,

    fundoIcone:
      'bg-red-50',

    corIcone:
      'text-red-600',

    fundoBadge:
      'bg-red-50',

    corBadge:
      'text-red-700',
  },


  /* ----------------------------------------------------------
     STATUS
     ---------------------------------------------------------- */

  status_changed: {
    label:
      'Kanban',

    Icone:
      ArrowRightLeft,

    fundoIcone:
      'bg-cyan-50',

    corIcone:
      'text-cyan-600',

    fundoBadge:
      'bg-cyan-50',

    corBadge:
      'text-cyan-700',
  },


  /* ----------------------------------------------------------
     PROGRESSO
     ---------------------------------------------------------- */

  progress_changed: {
    label:
      'Progresso',

    Icone:
      CheckCircle2,

    fundoIcone:
      'bg-green-50',

    corIcone:
      'text-green-600',

    fundoBadge:
      'bg-green-50',

    corBadge:
      'text-green-700',
  },


  /* ----------------------------------------------------------
     RESPONSÁVEL
     ---------------------------------------------------------- */

  responsible_changed: {
    label:
      'Responsável',

    Icone:
      UserCog,

    fundoIcone:
      'bg-sky-50',

    corIcone:
      'text-sky-600',

    fundoBadge:
      'bg-sky-50',

    corBadge:
      'text-sky-700',
  },


  /* ----------------------------------------------------------
     ETIQUETAS
     ---------------------------------------------------------- */

  tag_added: {
    label:
      'Etiqueta',

    Icone:
      Tag,

    fundoIcone:
      'bg-purple-50',

    corIcone:
      'text-purple-600',

    fundoBadge:
      'bg-purple-50',

    corBadge:
      'text-purple-700',
  },


  tag_removed: {
    label:
      'Etiqueta',

    Icone:
      Tag,

    fundoIcone:
      'bg-slate-100',

    corIcone:
      'text-slate-600',

    fundoBadge:
      'bg-slate-100',

    corBadge:
      'text-slate-700',
  },


  /* ----------------------------------------------------------
     EQUIPE
     ---------------------------------------------------------- */

  team_member_added: {
    label:
      'Equipe',

    Icone:
      UserPlus,

    fundoIcone:
      'bg-emerald-50',

    corIcone:
      'text-emerald-600',

    fundoBadge:
      'bg-emerald-50',

    corBadge:
      'text-emerald-700',
  },


  team_member_updated: {
    label:
      'Equipe',

    Icone:
      UserCog,

    fundoIcone:
      'bg-blue-50',

    corIcone:
      'text-blue-600',

    fundoBadge:
      'bg-blue-50',

    corBadge:
      'text-blue-700',
  },


  team_member_removed: {
    label:
      'Equipe',

    Icone:
      UserMinus,

    fundoIcone:
      'bg-red-50',

    corIcone:
      'text-red-600',

    fundoBadge:
      'bg-red-50',

    corBadge:
      'text-red-700',
  },

};


/* ============================================================
   FILTROS
   ============================================================ */

type FiltroHistorico =
  | 'todos'
  | 'projeto'
  | 'tarefas'
  | 'kanban'
  | 'etiquetas'
  | 'equipe';


/* ============================================================
   FORMATAR DATA
   ============================================================ */

function formatarData(
  createdAt: string
) {

  const data =
    new Date(
      createdAt
    );


  if (
    Number.isNaN(
      data.getTime()
    )
  ) {

    return createdAt;

  }


  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      day:
        '2-digit',

      month:
        '2-digit',

      year:
        'numeric',
    }
  ).format(
    data
  );

}


/* ============================================================
   FORMATAR HORÁRIO
   ============================================================ */

function formatarHorario(
  createdAt: string
) {

  const data =
    new Date(
      createdAt
    );


  if (
    Number.isNaN(
      data.getTime()
    )
  ) {

    return '';

  }


  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      hour:
        '2-digit',

      minute:
        '2-digit',
    }
  ).format(
    data
  );

}


/* ============================================================
   OBTER ENTIDADE RELACIONADA
   ============================================================ */

function obterEntidade(
  item: ProjectHistoryItem
) {

  return (
    item.metadata?.subtaskTitle ??
    item.metadata?.taskTitle ??
    item.metadata?.memberName ??
    null
  );

}


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function ProjectHistory({
  projeto,
}: ProjectHistoryProps) {


  /* ==========================================================
     PESQUISA
     ========================================================== */

  const [
    pesquisa,
    setPesquisa,
  ] = useState('');


  /* ==========================================================
     FILTRO
     ========================================================== */

  const [
    filtro,
    setFiltro,
  ] = useState<FiltroHistorico>(
    'todos'
  );


  /* ==========================================================
     HISTÓRICO ORDENADO
     ========================================================== */

  const historico =
    useMemo(
      () => {

        return [
          ...(projeto.history ?? []),
        ].sort(
          (
            primeiro,
            segundo
          ) =>

            new Date(
              segundo.createdAt
            ).getTime() -

            new Date(
              primeiro.createdAt
            ).getTime()
        );

      },
      [
        projeto.history,
      ]
    );


  /* ==========================================================
     FILTRAGEM
     ========================================================== */

  const historicoFiltrado =
    useMemo(
      () => {

        const termo =
          pesquisa
            .trim()
            .toLowerCase();


        return historico.filter(
          (item) => {

            const entidade =
              obterEntidade(
                item
              );


            const valorAnterior =
              item.metadata
                ?.previousValue ??
              '';


            const novoValor =
              item.metadata
                ?.newValue ??
              '';


            const membro =
              item.metadata
                ?.memberName ??
              '';


            const papelAnterior =
              item.metadata
                ?.previousRole ??
              '';


            const novoPapel =
              item.metadata
                ?.newRole ??
              '';


            const perfilSistema =
              item.metadata
                ?.systemProfile ??
              '';


            /* --------------------------------------------------
               PESQUISA
               -------------------------------------------------- */

            const correspondePesquisa =
              termo === '' ||

              item.title
                .toLowerCase()
                .includes(
                  termo
                ) ||

              item.description
                .toLowerCase()
                .includes(
                  termo
                ) ||

              item.user
                .toLowerCase()
                .includes(
                  termo
                ) ||

              entidade
                ?.toLowerCase()
                .includes(
                  termo
                ) ||

              valorAnterior
                .toLowerCase()
                .includes(
                  termo
                ) ||

              novoValor
                .toLowerCase()
                .includes(
                  termo
                ) ||

              membro
                .toLowerCase()
                .includes(
                  termo
                ) ||

              papelAnterior
                .toLowerCase()
                .includes(
                  termo
                ) ||

              novoPapel
                .toLowerCase()
                .includes(
                  termo
                ) ||

              perfilSistema
                .toLowerCase()
                .includes(
                  termo
                );


            /* --------------------------------------------------
               FILTRO
               -------------------------------------------------- */

            let correspondeFiltro =
              true;


            /* PROJETO */

            if (
              filtro ===
              'projeto'
            ) {

              correspondeFiltro =
                item.type ===
                  'project_created' ||

                item.type ===
                  'project_updated';

            }


            /* TAREFAS */

            if (
              filtro ===
              'tarefas'
            ) {

              correspondeFiltro =
                item.type ===
                  'task_created' ||

                item.type ===
                  'task_updated' ||

                item.type ===
                  'task_deleted' ||

                item.type ===
                  'subtask_created' ||

                item.type ===
                  'subtask_updated' ||

                item.type ===
                  'subtask_deleted' ||

                item.type ===
                  'progress_changed' ||

                item.type ===
                  'responsible_changed';

            }


            /* KANBAN */

            if (
              filtro ===
              'kanban'
            ) {

              correspondeFiltro =
                item.type ===
                'status_changed';

            }


            /* ETIQUETAS */

            if (
              filtro ===
              'etiquetas'
            ) {

              correspondeFiltro =
                item.type ===
                  'tag_added' ||

                item.type ===
                  'tag_removed';

            }


            /* EQUIPE */

            if (
              filtro ===
              'equipe'
            ) {

              correspondeFiltro =
                item.type ===
                  'team_member_added' ||

                item.type ===
                  'team_member_updated' ||

                item.type ===
                  'team_member_removed';

            }


            return (
              correspondePesquisa &&
              correspondeFiltro
            );

          }
        );

      },
      [
        historico,
        pesquisa,
        filtro,
      ]
    );


  /* ==========================================================
     RESUMO
     ========================================================== */

  const totalMovimentacoes =
    historico.length;


  const movimentacoesKanban =
    historico.filter(
      (item) =>
        item.type ===
        'status_changed'
    ).length;


  const alteracoesDeTarefa =
    historico.filter(
      (item) =>

        item.type ===
          'task_created' ||

        item.type ===
          'task_updated' ||

        item.type ===
          'task_deleted' ||

        item.type ===
          'subtask_created' ||

        item.type ===
          'subtask_updated' ||

        item.type ===
          'subtask_deleted' ||

        item.type ===
          'progress_changed' ||

        item.type ===
          'responsible_changed'

    ).length;


  const alteracoesDeEquipe =
    historico.filter(
      (item) =>

        item.type ===
          'team_member_added' ||

        item.type ===
          'team_member_updated' ||

        item.type ===
          'team_member_removed'

    ).length;


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

            <History
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
              Histórico do Projeto
            </h2>

          </div>


          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Acompanhe as alterações e movimentações realizadas em{' '}

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
            RESUMO
            ==================================================== */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-5
            rounded-xl
            border
            border-gray-200
            bg-white
            px-5
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
              Registros
            </p>

            <p
              className="
                mt-0.5
                text-lg
                font-bold
                text-gray-700
              "
            >
              {totalMovimentacoes}
            </p>

          </div>


          <div className="h-8 w-px bg-gray-200" />


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
              Kanban
            </p>

            <p
              className="
                mt-0.5
                text-lg
                font-bold
                text-cyan-600
              "
            >
              {movimentacoesKanban}
            </p>

          </div>


          <div className="h-8 w-px bg-gray-200" />


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
              Tarefas
            </p>

            <p
              className="
                mt-0.5
                text-lg
                font-bold
                text-institution-600
              "
            >
              {alteracoesDeTarefa}
            </p>

          </div>


          <div className="h-8 w-px bg-gray-200" />


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
              Equipe
            </p>

            <p
              className="
                mt-0.5
                text-lg
                font-bold
                text-emerald-600
              "
            >
              {alteracoesDeEquipe}
            </p>

          </div>

        </div>

      </div>


      {/* ======================================================
          FILTROS
          ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-3
          rounded-xl
          border
          border-gray-200
          bg-white
          p-4
          shadow-sm
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* PESQUISA */}

        <div
          className="
            relative
            w-full
            lg:max-w-md
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

            onChange={(
              evento
            ) =>
              setPesquisa(
                evento.target.value
              )
            }

            placeholder="Pesquisar no histórico..."

            className="
              w-full
              rounded-lg
              border
              border-gray-200
              bg-gray-50
              py-2.5
              pl-10
              pr-10
              text-sm
              text-gray-700
              outline-none
              transition-all
              placeholder:text-gray-400
              focus:border-institution-300
              focus:bg-white
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
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                hover:text-gray-600
              "
            >

              <X className="h-4 w-4" />

            </button>

          )}

        </div>


        {/* ====================================================
            TIPOS
            ==================================================== */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >

          <Filter
            className="
              mr-1
              h-4
              w-4
              text-gray-400
            "
          />


          {([
            [
              'todos',
              'Todos',
            ],

            [
              'projeto',
              'Projeto',
            ],

            [
              'tarefas',
              'Tarefas',
            ],

            [
              'kanban',
              'Kanban',
            ],

            [
              'etiquetas',
              'Etiquetas',
            ],

            [
              'equipe',
              'Equipe',
            ],
          ] as Array<
            [
              FiltroHistorico,
              string
            ]
          >).map(
            ([
              valor,
              label,
            ]) => (

              <button
                key={
                  valor
                }

                type="button"

                onClick={() =>
                  setFiltro(
                    valor
                  )
                }

                className={`
                  rounded-lg
                  border
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  transition-all

                  ${
                    filtro === valor
                      ? `
                        border-institution-200
                        bg-institution-50
                        text-institution-700
                      `
                      : `
                        border-gray-200
                        bg-white
                        text-gray-500
                        hover:bg-gray-50
                        hover:text-gray-700
                      `
                  }
                `}
              >
                {label}
              </button>

            )
          )}

        </div>

      </div>


      {/* ======================================================
          RESULTADOS
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
            flex
            items-center
            justify-between
            border-b
            border-gray-100
            bg-slate-50/70
            px-5
            py-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <Activity
              className="
                h-4
                w-4
                text-gray-400
              "
            />

            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              Linha do tempo
            </span>

          </div>


          <span
            className="
              rounded-full
              bg-white
              px-2.5
              py-1
              text-[11px]
              font-semibold
              text-gray-500
              shadow-sm
            "
          >
            {historicoFiltrado.length}{' '}

            {historicoFiltrado.length === 1
              ? 'registro'
              : 'registros'}
          </span>

        </div>


        {historicoFiltrado.length === 0 ? (

          <div
            className="
              px-6
              py-16
              text-center
            "
          >

            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-gray-100
              "
            >

              <History
                className="
                  h-5
                  w-5
                  text-gray-400
                "
              />

            </div>


            <p
              className="
                mt-4
                text-sm
                font-semibold
                text-gray-600
              "
            >
              Nenhum registro encontrado
            </p>


            <p
              className="
                mx-auto
                mt-1
                max-w-sm
                text-xs
                leading-relaxed
                text-gray-400
              "
            >
              Não existem movimentações correspondentes aos filtros selecionados.
            </p>

          </div>

        ) : (

          <div className="px-5">

            {historicoFiltrado.map(
              (
                item,
                indice
              ) => (

                <ItemDoHistorico
                  key={
                    item.id
                  }

                  item={
                    item
                  }

                  ultimo={
                    indice ===
                    historicoFiltrado.length -
                      1
                  }
                />

              )
            )}

          </div>

        )}

      </div>

    </div>

  );
}


/* ============================================================
   ITEM DA TIMELINE
   ============================================================ */

function ItemDoHistorico({
  item,
  ultimo,
}: {
  item: ProjectHistoryItem;
  ultimo: boolean;
}) {


  /* ==========================================================
     CONFIGURAÇÃO
     ========================================================== */

  const configuracao =
    configuracaoDosTipos[
      item.type
    ];


  /*
   * Fallback de segurança.
   *
   * Caso futuramente seja criado um novo tipo de histórico e
   * alguém esqueça de adicioná-lo na configuração visual,
   * a tela não ficará branca.
   */

  if (!configuracao) {

    return null;

  }


  const Icone =
    configuracao.Icone;


  /* ==========================================================
     METADADOS
     ========================================================== */

  const valorAnterior =
    item.metadata
      ?.previousValue;


  const novoValor =
    item.metadata
      ?.newValue;


  const papelAnterior =
    item.metadata
      ?.previousRole;


  const novoPapel =
    item.metadata
      ?.newRole;


  const entidade =
    obterEntidade(
      item
    );


  /* ==========================================================
     DATA
     ========================================================== */

  const data =
    formatarData(
      item.createdAt
    );


  const horario =
    formatarHorario(
      item.createdAt
    );


  return (

    <div
      className="
        relative
        flex
        gap-4
        py-5
      "
    >


      {!ultimo && (

        <div
          className="
            absolute
            bottom-0
            left-[19px]
            top-[52px]
            w-px
            bg-gray-200
          "
        />

      )}


      {/* ======================================================
          ÍCONE
          ====================================================== */}

      <div
        className={`
          relative
          z-10
          flex
          h-10
          w-10
          flex-shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-white
          shadow-sm

          ${configuracao.fundoIcone}
        `}
      >

        <Icone
          className={`
            h-4
            w-4

            ${configuracao.corIcone}
          `}
        />

      </div>


      {/* ======================================================
          CONTEÚDO
          ====================================================== */}

      <div
        className="
          min-w-0
          flex-1
          border-b
          border-gray-100
          pb-5
        "
      >

        <div
          className="
            flex
            flex-col
            gap-2
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >

          <div className="min-w-0">

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              <h3
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                {item.title}
              </h3>


              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-[10px]
                  font-semibold

                  ${configuracao.fundoBadge}
                  ${configuracao.corBadge}
                `}
              >
                {configuracao.label}
              </span>

            </div>


            <p
              className="
                mt-1.5
                text-sm
                leading-relaxed
                text-gray-500
              "
            >
              {item.description}
            </p>

          </div>


          <div
            className="
              flex
              flex-shrink-0
              items-center
              gap-1.5
              text-[11px]
              text-gray-400
            "
          >

            <CalendarDays className="h-3.5 w-3.5" />

            <span>
              {data}
            </span>


            {horario && (

              <>

                <span>
                  •
                </span>

                <span>
                  {horario}
                </span>

              </>

            )}

          </div>

        </div>


        {/* ====================================================
            ALTERAÇÃO NORMAL
            ==================================================== */}

        {(
          valorAnterior ||
          novoValor
        ) && (

          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-2
              rounded-lg
              border
              border-gray-100
              bg-slate-50
              px-3
              py-2.5
            "
          >

            {valorAnterior && (

              <span
                className="
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-gray-500
                "
              >
                {valorAnterior}
              </span>

            )}


            {valorAnterior &&
              novoValor && (

                <ArrowRight
                  className="
                    h-4
                    w-4
                    text-gray-300
                  "
                />

              )}


            {novoValor && (

              <span
                className="
                  rounded-md
                  border
                  border-institution-100
                  bg-institution-50
                  px-2.5
                  py-1
                  text-xs
                  font-semibold
                  text-institution-700
                "
              >
                {novoValor}
              </span>

            )}

          </div>

        )}


        {/* ====================================================
            ALTERAÇÃO DE PAPEL DA EQUIPE
            ==================================================== */}

        {(
          papelAnterior ||
          novoPapel
        ) && (

          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-2
              rounded-lg
              border
              border-gray-100
              bg-slate-50
              px-3
              py-2.5
            "
          >

            {papelAnterior && (

              <span
                className="
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-gray-500
                "
              >
                {papelAnterior}
              </span>

            )}


            {papelAnterior &&
              novoPapel && (

                <ArrowRight
                  className="
                    h-4
                    w-4
                    text-gray-300
                  "
                />

              )}


            {novoPapel && (

              <span
                className="
                  rounded-md
                  border
                  border-emerald-100
                  bg-emerald-50
                  px-2.5
                  py-1
                  text-xs
                  font-semibold
                  text-emerald-700
                "
              >
                {novoPapel}
              </span>

            )}

          </div>

        )}


        {/* ====================================================
            RODAPÉ
            ==================================================== */}

        <div
          className="
            mt-3
            flex
            flex-wrap
            items-center
            gap-x-4
            gap-y-2
          "
        >

          <div
            className="
              flex
              items-center
              gap-1.5
              text-xs
              text-gray-400
            "
          >

            <UserRound className="h-3.5 w-3.5" />

            <span>
              Por
            </span>

            <span
              className="
                font-medium
                text-gray-600
              "
            >
              {item.user}
            </span>

          </div>


          {entidade && (

            <div
              className="
                flex
                min-w-0
                items-center
                gap-1.5
                text-xs
                text-gray-400
              "
            >

              {item.type.startsWith(
                'team_member_'
              ) ? (

                <Users className="h-3.5 w-3.5 flex-shrink-0" />

              ) : (

                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />

              )}


              <span className="truncate">
                {entidade}
              </span>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}