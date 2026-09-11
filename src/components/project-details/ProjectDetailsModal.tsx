import {
  useState,
} from 'react';

import {
  X,
  Info,
  Save,
} from 'lucide-react';

import type {
  Project,
  ProjectTask,
  ProjectHistoryItem,
  ProjectMember,
} from '@/data/projects';

import ProjectDetailsSidebar, {
  type SecaoDetalhesProjeto,
} from './ProjectDetailsSidebar';

import ProjectInformation from './ProjectInformation';

import ProjectKanban from './ProjectKanban';

import ProjectActions from './project-actions/ProjectActions';

import ProjectHistory from './ProjectHistory';

import ProjectIndicators from './ProjectIndicators';

import ProjectTeam from './ProjectTeam';


/* ============================================================
   PROPRIEDADES DO MODAL
   ============================================================ */

interface ModalDetalhesProjetoProps {
  projeto: Project;

  aoFechar: () => void;

  secaoInicial?: SecaoDetalhesProjeto;

  aoAtualizarProjeto?: (
    projeto: Project
  ) => void;
}


/* ============================================================
   TIPO PARA NOVO REGISTRO
   ============================================================ */

export type NovoRegistroHistorico =
  Omit<
    ProjectHistoryItem,
    'id' | 'createdAt'
  >;


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function ProjectDetailsModal({
  projeto,
  aoFechar,
  secaoInicial = 'informacoes',
  aoAtualizarProjeto,
}: ModalDetalhesProjetoProps) {


  /* ==========================================================
     SEÇÃO ATIVA
     ========================================================== */

  const [
    secaoAtiva,
    setSecaoAtiva,
  ] = useState<SecaoDetalhesProjeto>(
    secaoInicial
  );


  /* ==========================================================
     PROJETO LOCAL
     ========================================================== */

  const [
    projetoLocal,
    setProjetoLocal,
  ] = useState<Project>(
    projeto
  );


  /* ==========================================================
     TAREFAS COMPARTILHADAS
     ========================================================== */

  const [
    tarefasDoProjeto,
    setTarefasDoProjeto,
  ] = useState<ProjectTask[]>(
    projeto.tasks ?? []
  );


  /* ==========================================================
     ALTERAR TAREFAS
     ========================================================== */

  function alterarTarefas(
    novasTarefas: ProjectTask[]
  ) {

    setTarefasDoProjeto(
      novasTarefas
    );


    setProjetoLocal(
      (projetoAtual) => ({
        ...projetoAtual,

        tasks:
          novasTarefas,
      })
    );

  }


  /* ==========================================================
     REGISTRAR HISTÓRICO
     ========================================================== */

  function registrarHistorico(
    item: NovoRegistroHistorico
  ) {

    const agora =
      new Date();


    const novoRegistro:
      ProjectHistoryItem = {

      ...item,

      id:
        `history-${agora.getTime()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      createdAt:
        agora.toISOString(),

    };


    setProjetoLocal(
      (projetoAtual) => ({

        ...projetoAtual,

        history: [
          novoRegistro,

          ...(
            projetoAtual.history ??
            []
          ),
        ],

      })
    );

  }


  /* ==========================================================
     ADICIONAR MEMBRO À EQUIPE
     ========================================================== */

  function adicionarMembroEquipe(
    novoMembro: ProjectMember
  ) {

    const agora =
      new Date();


    /* --------------------------------------------------------
       EVITA DUPLICIDADE
       -------------------------------------------------------- */

    const membroJaExiste =
      (
        projetoLocal.team ??
        []
      ).some(
        (membro) =>
          membro.id ===
          novoMembro.id
      );


    if (
      membroJaExiste
    ) {

      return;

    }


    /* --------------------------------------------------------
       REGISTRO DO HISTÓRICO
       -------------------------------------------------------- */

    const novoRegistro:
      ProjectHistoryItem = {

      id:
        `history-team-added-${agora.getTime()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      type:
        'team_member_added',

      title:
        'Membro adicionado à equipe',

      description:
        `${novoMembro.name} foi adicionado ao projeto como ${novoMembro.projectRole}.`,

      /*
       * Temporário enquanto não existe autenticação real.
       *
       * Futuramente:
       * user = usuário atualmente logado.
       */
      user:
        projetoLocal.responsible,

      createdAt:
        agora.toISOString(),

      metadata: {

        memberId:
          novoMembro.id,

        memberName:
          novoMembro.name,

        newRole:
          novoMembro.projectRole,

        systemProfile:
          novoMembro.systemProfile,

      },

    };


    /* --------------------------------------------------------
       ATUALIZA EQUIPE + HISTÓRICO
       -------------------------------------------------------- */

    setProjetoLocal(
      (projetoAtual) => ({

        ...projetoAtual,

        team: [
          ...(
            projetoAtual.team ??
            []
          ),

          novoMembro,
        ],

        history: [
          novoRegistro,

          ...(
            projetoAtual.history ??
            []
          ),
        ],

      })
    );

  }


  /* ==========================================================
     REMOVER MEMBRO DA EQUIPE
     ========================================================== */

  function removerMembroEquipe(
    membroRemovido: ProjectMember
  ) {


    /* --------------------------------------------------------
       PROTEÇÃO EXTRA — GERENTE
       -------------------------------------------------------- */

    if (
      membroRemovido.projectRole ===
      'Gerente de projeto'
    ) {

      return;

    }


    const agora =
      new Date();


    /* --------------------------------------------------------
       REGISTRO DO HISTÓRICO
       -------------------------------------------------------- */

    const novoRegistro:
      ProjectHistoryItem = {

      id:
        `history-team-removed-${agora.getTime()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      type:
        'team_member_removed',

      title:
        'Membro removido da equipe',

      description:
        `${membroRemovido.name} foi removido da equipe do projeto.`,

      /*
       * Temporário enquanto não existe autenticação real.
       *
       * Futuramente:
       * user = usuário atualmente logado.
       */
      user:
        projetoLocal.responsible,

      createdAt:
        agora.toISOString(),

      metadata: {

        memberId:
          membroRemovido.id,

        memberName:
          membroRemovido.name,

        previousRole:
          membroRemovido.projectRole,

        systemProfile:
          membroRemovido.systemProfile,

      },

    };


    /* --------------------------------------------------------
       REMOVE MEMBRO + ATUALIZA HISTÓRICO
       -------------------------------------------------------- */

    setProjetoLocal(
      (projetoAtual) => ({

        ...projetoAtual,

        team: (
          projetoAtual.team ??
          []
        ).filter(
          (membro) =>
            membro.id !==
            membroRemovido.id
        ),

        history: [
          novoRegistro,

          ...(
            projetoAtual.history ??
            []
          ),
        ],

      })
    );

  }


  /* ==========================================================
     SALVAR ALTERAÇÕES
     ========================================================== */

  function salvarAlteracoes() {

    const projetoAtualizado:
      Project = {

      ...projetoLocal,

      tasks:
        tarefasDoProjeto,

    };


    setProjetoLocal(
      projetoAtualizado
    );


    aoAtualizarProjeto?.(
      projetoAtualizado
    );

  }


  /* ==========================================================
     RENDERIZAÇÃO
     ========================================================== */

  function renderizarConteudo() {


    /* --------------------------------------------------------
       INDICADORES
       -------------------------------------------------------- */

    if (
      secaoAtiva ===
      'indicadores'
    ) {

      return (

        <ProjectIndicators
          projeto={
            projetoLocal
          }
        />

      );

    }


    /* --------------------------------------------------------
       INFORMAÇÕES
       -------------------------------------------------------- */

    if (
      secaoAtiva ===
      'informacoes'
    ) {

      return (

        <ProjectInformation
          projeto={
            projetoLocal
          }
        />

      );

    }


    /* --------------------------------------------------------
       AÇÕES
       -------------------------------------------------------- */

    if (
      secaoAtiva ===
      'acoes'
    ) {

      return (

        <ProjectActions
          projeto={
            projetoLocal
          }

          tarefas={
            tarefasDoProjeto
          }

          aoAlterarTarefas={
            alterarTarefas
          }
        />

      );

    }


    /* --------------------------------------------------------
       KANBAN
       -------------------------------------------------------- */

    if (
      secaoAtiva ===
      'kanban'
    ) {

      return (

        <ProjectKanban
          projeto={
            projetoLocal
          }

          tarefas={
            tarefasDoProjeto
          }

          aoAlterarTarefas={
            alterarTarefas
          }

          aoRegistrarHistorico={
            registrarHistorico
          }
        />

      );

    }


    /* --------------------------------------------------------
       EQUIPE
       -------------------------------------------------------- */

    if (
      secaoAtiva ===
      'equipe'
    ) {

      return (

        <ProjectTeam
          projeto={
            projetoLocal
          }

          aoAdicionarMembro={
            adicionarMembroEquipe
          }

          aoRemoverMembro={
            removerMembroEquipe
          }
        />

      );

    }


    /* --------------------------------------------------------
       HISTÓRICO
       -------------------------------------------------------- */

    if (
      secaoAtiva ===
      'historico'
    ) {

      return (

        <ProjectHistory
          projeto={
            projetoLocal
          }
        />

      );

    }


    /* ========================================================
       PLACEHOLDERS
       ======================================================== */

    const titulos: Record<
      SecaoDetalhesProjeto,
      string
    > = {

      indicadores:
        'Indicadores',

      informacoes:
        'Informações',

      acoes:
        'Ações do Projeto',

      kanban:
        'Kanban',

      equipe:
        'Equipe',

      custos:
        'Custos',

      evidencias:
        'Evidências',

      documentos:
        'Documentos',

      historico:
        'Histórico',

    };


    return (

      <div
        className="
          flex
          min-h-[400px]
          items-center
          justify-center
          rounded-xl
          border
          border-dashed
          border-gray-300
          bg-gray-50
        "
      >

        <div className="text-center">

          <h2
            className="
              text-lg
              font-semibold
              text-gray-700
            "
          >
            {titulos[secaoAtiva]}
          </h2>


          <p
            className="
              mt-2
              text-sm
              text-gray-400
            "
          >
            Esta área será construída na próxima etapa do protótipo.
          </p>

        </div>

      </div>

    );

  }


  /* ==========================================================
     INTERFACE
     ========================================================== */

  return (

    <div
      className="
        fixed
        inset-0
        z-50
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
          flex
          h-[92vh]
          w-full
          max-w-[1500px]
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >


        {/* ====================================================
            CABEÇALHO
            ==================================================== */}

        <header
          className="
            flex
            items-center
            justify-between
            bg-institution-600
            px-6
            py-4
            text-white
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

            <Info
              className="
                h-5
                w-5
                flex-shrink-0
              "
            />


            <h1
              className="
                truncate
                text-lg
                font-semibold
              "
            >
              Detalhes do Projeto:{' '}

              {projetoLocal.code}

              {' — '}

              {projetoLocal.title}
            </h1>

          </div>


          <button
            type="button"

            onClick={
              aoFechar
            }

            className="
              flex
              h-9
              w-9
              flex-shrink-0
              items-center
              justify-center
              rounded-lg
              transition-colors
              hover:bg-white/10
            "

            title="Fechar"
          >

            <X className="h-5 w-5" />

          </button>

        </header>


        {/* ====================================================
            CONTEÚDO
            ==================================================== */}

        <div
          className="
            flex
            min-h-0
            flex-1
          "
        >

          <ProjectDetailsSidebar
            secaoAtiva={
              secaoAtiva
            }

            aoSelecionarSecao={
              setSecaoAtiva
            }
          />


          <main
            className="
              min-w-0
              flex-1
              overflow-y-auto
              bg-white
              p-6
              lg:p-8
            "
          >

            {renderizarConteudo()}

          </main>

        </div>


        {/* ====================================================
            RODAPÉ
            ==================================================== */}

        <footer
          className="
            flex
            items-center
            justify-end
            gap-3
            border-t
            border-gray-200
            bg-white
            px-6
            py-4
          "
        >

          <button
            type="button"

            onClick={
              salvarAlteracoes
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

            <Save className="h-4 w-4" />

            Salvar Alterações

          </button>


          <button
            type="button"

            onClick={
              aoFechar
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
              text-gray-700
              transition-colors
              hover:bg-gray-50
            "
          >
            Fechar
          </button>

        </footer>

      </div>

    </div>

  );
}