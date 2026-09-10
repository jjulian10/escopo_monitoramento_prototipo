import {
  useState,
} from 'react';

import {
  Plus,
} from 'lucide-react';


/* ============================================================
   COMPONENTES
   ============================================================ */

import Sidebar from '@/components/Sidebar';

import Header from '@/components/Header';

import TabCards from '@/components/TabCards';

import Filters from '@/components/Filters';

import SummaryCards from '@/components/SummaryCards';

import ProjectList from '@/components/ProjectList';

import StrategicView from '@/components/StrategicView';

import CreateProjectModal from '@/components/project-create/CreateProjectModal';

import ProjectDetailsModal from '@/components/project-details/ProjectDetailsModal';

import GlobalProjectKanban from '@/components/project-kanban/GlobalProjectKanban';


/* ============================================================
   TIPOS
   ============================================================ */

import type {
  DadosDosFiltros,
} from '@/components/Filters';

import type {
  Project,
} from '@/data/projects';

import type {
  AlertaPrazo,
} from '@/utils/projectAlerts';

import type {
  SecaoDetalhesProjeto,
} from '@/components/project-details/ProjectDetailsSidebar';

import type {
  PaginaPrincipal,
} from '@/components/Sidebar';


/* ============================================================
   DADOS DO PROTÓTIPO
   ============================================================ */

import {
  tabs,
  projects,
  sharedProjects,
  strategicAxes,
  summaryCardsByTab,
} from '@/data/projects';


/* ============================================================
   VALORES INICIAIS DOS FILTROS
   ============================================================ */

const filtrosIniciais: DadosDosFiltros = {

  projeto:
    'Todos os projetos',

  eixo:
    'Todos os eixos',

  etapa:
    'Todas as etapas',

  status:
    'Todos os status',

  nomeAcao: '',

  responsavel: '',

  dataInicio: '',

  dataFim: '',

};


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function App() {


  /* ==========================================================
     PÁGINA PRINCIPAL
     ========================================================== */

  const [
    paginaAtiva,
    setPaginaAtiva,
  ] = useState<PaginaPrincipal>(
    'monitoramento'
  );


  /* ==========================================================
     MODAL DE CRIAÇÃO
     ========================================================== */

  const [
    modalCriarProjetoAberto,
    setModalCriarProjetoAberto,
  ] = useState(false);


  /* ==========================================================
     PROJETOS DO USUÁRIO
     ========================================================== */

  const [
    meusProjetos,
    setMeusProjetos,
  ] = useState<Project[]>(
    projects
  );


  /* ==========================================================
     PROJETO ABERTO NO MODAL
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
  ] = useState<SecaoDetalhesProjeto>(
    'informacoes'
  );


  /* ==========================================================
     BARRA LATERAL
     ========================================================== */

  const [
    barraLateralRecolhida,
    setBarraLateralRecolhida,
  ] = useState(false);


  /* ==========================================================
     ABA ATIVA DO MONITORAMENTO
     ========================================================== */

  const [
    abaAtiva,
    setAbaAtiva,
  ] = useState('mine');


  /* ==========================================================
     FILTROS
     ========================================================== */

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<DadosDosFiltros>(
    filtrosIniciais
  );


  /* ==========================================================
     CONFIGURAÇÃO DA ABA ATUAL
     ========================================================== */

  const configuracaoDaAbaAtual =

    tabs.find(
      (aba) =>
        aba.id === abaAtiva
    ) ??

    tabs[0];


  /* ==========================================================
     CARDS DE RESUMO
     ========================================================== */

  const cardsDeResumo =

    summaryCardsByTab[
      abaAtiva
    ] ??

    summaryCardsByTab.mine;


  /* ==========================================================
     APLICAR FILTROS
     ========================================================== */

  function aplicarFiltros(
    filtros: DadosDosFiltros
  ) {

    setFiltrosAplicados(
      filtros
    );

  }


  /* ==========================================================
     LIMPAR FILTROS
     ========================================================== */

  function limparFiltros() {

    setFiltrosAplicados(
      filtrosIniciais
    );

  }


  /* ==========================================================
     ADICIONAR NOVO PROJETO
     ========================================================== */

  function adicionarNovoProjeto(
    novoProjeto: Project
  ) {

    setMeusProjetos(
      (projetosAtuais) => [

        novoProjeto,

        ...projetosAtuais,

      ]
    );


    /*
     * Após criar um projeto, retorna para
     * a página principal de Monitoramento.
     */

    setPaginaAtiva(
      'monitoramento'
    );


    setAbaAtiva(
      'mine'
    );


    setFiltrosAplicados(
      filtrosIniciais
    );


    setModalCriarProjetoAberto(
      false
    );

  }


  /* ==========================================================
     ATUALIZAR PROJETO
     ========================================================== */

  function atualizarProjeto(
    projetoAtualizado: Project
  ) {

    setMeusProjetos(
      (projetosAtuais) =>

        projetosAtuais.map(
          (projeto) =>

            projeto.id ===
            projetoAtualizado.id

              ? projetoAtualizado

              : projeto

        )
    );


    /*
     * Se o projeto atualizado estiver aberto
     * no modal, mantém o modal sincronizado.
     */

    setProjetoSelecionado(
      (projetoAtual) =>

        projetoAtual?.id ===
        projetoAtualizado.id

          ? projetoAtualizado

          : projetoAtual
    );

  }


  /* ==========================================================
     ABRIR PROJETO
     ========================================================== */

  function abrirProjeto(
    projeto: Project,
    secao: SecaoDetalhesProjeto =
      'informacoes'
  ) {

    setSecaoInicialDoModal(
      secao
    );


    setProjetoSelecionado(
      projeto
    );

  }


  /* ==========================================================
     ABRIR PROJETO PELO KANBAN GLOBAL
     ========================================================== */

  function abrirProjetoDoKanban(
    projeto: Project
  ) {

    abrirProjeto(
      projeto,
      'informacoes'
    );

  }


  /* ==========================================================
     ABRIR ALERTA
     ========================================================== */

  function abrirAlerta(
    alerta: AlertaPrazo
  ) {

    const projeto =

      meusProjetos.find(
        (item) =>
          item.id ===
          alerta.projetoId
      ) ??

      sharedProjects.find(
        (item) =>
          item.id ===
          alerta.projetoId
      );


    if (!projeto) {
      return;
    }


    /* --------------------------------------------------------
       RETORNA PARA MONITORAMENTO
       -------------------------------------------------------- */

    setPaginaAtiva(
      'monitoramento'
    );


    /* --------------------------------------------------------
       DEFINE A ABA
       -------------------------------------------------------- */

    const estaNosMeusProjetos =
      meusProjetos.some(
        (item) =>
          item.id ===
          projeto.id
      );


    setAbaAtiva(
      estaNosMeusProjetos
        ? 'mine'
        : 'shared'
    );


    /* --------------------------------------------------------
       LIMPA OS FILTROS
       -------------------------------------------------------- */

    setFiltrosAplicados(
      filtrosIniciais
    );


    /* --------------------------------------------------------
       DEFINE A SEÇÃO DO MODAL

       Projeto
       → Informações

       Tarefa
       → Ações

       Subtarefa
       → Kanban interno
       -------------------------------------------------------- */

    let secao:
      SecaoDetalhesProjeto =
        'informacoes';


    if (
      alerta.nivel ===
      'tarefa'
    ) {

      secao =
        'acoes';

    }


    if (
      alerta.nivel ===
      'subtarefa'
    ) {

      secao =
        'kanban';

    }


    abrirProjeto(
      projeto,
      secao
    );

  }


  /* ==========================================================
     FILTRAR PROJETOS
     ========================================================== */

  function filtrarProjetos<
    T extends {
      code: string;
      status: string;
      responsible: string;
    }
  >(
    listaDeProjetos: T[]
  ) {

    return listaDeProjetos.filter(
      (projeto) => {


        /* -----------------------------------------------------
           PROJETO
           ----------------------------------------------------- */

        const correspondeAoProjeto =

          filtrosAplicados.projeto ===
            'Todos os projetos' ||

          projeto.code ===
            filtrosAplicados.projeto;


        /* -----------------------------------------------------
           STATUS
           ----------------------------------------------------- */

        const correspondeAoStatus =

          filtrosAplicados.status ===
            'Todos os status' ||

          projeto.status ===
            filtrosAplicados.status;


        /* -----------------------------------------------------
           RESPONSÁVEL
           ----------------------------------------------------- */

        const nomeDoResponsavel =

          projeto.responsible
            .toLowerCase();


        const responsavelPesquisado =

          filtrosAplicados
            .responsavel
            .trim()
            .toLowerCase();


        const correspondeAoResponsavel =

          responsavelPesquisado === '' ||

          nomeDoResponsavel.includes(
            responsavelPesquisado
          );


        /* -----------------------------------------------------
           RESULTADO
           ----------------------------------------------------- */

        return (

          correspondeAoProjeto &&

          correspondeAoStatus &&

          correspondeAoResponsavel

        );

      }
    );

  }


  /* ==========================================================
     PROJETOS FILTRADOS
     ========================================================== */

  const meusProjetosFiltrados =

    filtrarProjetos(
      meusProjetos
    );


  const projetosCompartilhadosFiltrados =

    filtrarProjetos(
      sharedProjects
    );


  /* ==========================================================
     INTERFACE
     ========================================================== */

  return (

    <div
      className="
        min-h-screen
        bg-slate-50/80
      "
    >


      {/* ======================================================
          SIDEBAR
          ====================================================== */}

      <Sidebar
        collapsed={
          barraLateralRecolhida
        }

        onToggle={() =>
          setBarraLateralRecolhida(
            (estadoAtual) =>
              !estadoAtual
          )
        }

        paginaAtiva={
          paginaAtiva
        }

        aoSelecionarPagina={
          setPaginaAtiva
        }
      />


      {/* ======================================================
          ÁREA PRINCIPAL
          ====================================================== */}

      <div
        className={`
          flex
          min-h-screen
          flex-col
          transition-all
          duration-300
          ease-in-out

          ${
            barraLateralRecolhida
              ? 'ml-20'
              : 'ml-64'
          }
        `}
      >


        {/* ====================================================
            HEADER
            ==================================================== */}

        <Header
          projetos={[
            ...meusProjetos,
            ...sharedProjects,
          ]}

          aoSelecionarAlerta={
            abrirAlerta
          }
        />


        {/* ====================================================
            MONITORAMENTO
            ==================================================== */}

        {paginaAtiva ===
          'monitoramento' && (

          <main
            className="
              flex-1
              space-y-8
              p-6
              lg:p-8
            "
          >


            {/* ================================================
                TÍTULO
                ================================================ */}

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

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <div
                    className="
                      h-8
                      w-1.5
                      rounded-full
                      bg-institution-600
                    "
                  />


                  <h1
                    className="
                      text-2xl
                      font-bold
                      tracking-tight
                      text-gray-900
                    "
                  >
                    Monitoramento de Projetos
                  </h1>

                </div>


                <p
                  className="
                    mt-2
                    pl-4.5
                    text-sm
                    text-gray-500
                  "
                >
                  Acompanhe seus projetos, etapas, ações e indicadores.
                </p>

              </div>


              {/* ==============================================
                  CRIAR PROJETO
                  ============================================== */}

              <button
                type="button"

                onClick={() =>
                  setModalCriarProjetoAberto(
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

                Criar Novo Projeto

              </button>

            </div>


            {/* ================================================
                MODAL DE CRIAÇÃO
                ================================================ */}

            {modalCriarProjetoAberto && (

              <CreateProjectModal
                aoFechar={() =>
                  setModalCriarProjetoAberto(
                    false
                  )
                }

                aoCriarProjeto={
                  adicionarNovoProjeto
                }
              />

            )}


            {/* ================================================
                ABAS
                ================================================ */}

            <TabCards
              tabs={
                tabs
              }

              activeTab={
                abaAtiva
              }

              onTabChange={
                setAbaAtiva
              }
            />


            {/* ================================================
                FILTROS
                ================================================ */}

            <Filters
              aoFiltrar={
                aplicarFiltros
              }

              aoLimpar={
                limparFiltros
              }
            />


            {/* ================================================
                RESUMO
                ================================================ */}

            <SummaryCards
              cards={
                cardsDeResumo
              }
            />


            {/* ================================================
                MEUS PROJETOS
                ================================================ */}

            {abaAtiva ===
              'mine' && (

              <ProjectList
                projects={
                  meusProjetosFiltrados
                }

                title={
                  configuracaoDaAbaAtual.title
                }

                badge={
                  meusProjetosFiltrados.length
                }

                aoAtualizarProjeto={
                  atualizarProjeto
                }

                aoAbrirProjeto={
                  abrirProjeto
                }
              />

            )}


            {/* ================================================
                COMPARTILHADOS
                ================================================ */}

            {abaAtiva ===
              'shared' && (

              <ProjectList
                projects={
                  projetosCompartilhadosFiltrados
                }

                title={
                  configuracaoDaAbaAtual.title
                }

                badge={
                  projetosCompartilhadosFiltrados.length
                }

                showAccess

                aoAbrirProjeto={
                  abrirProjeto
                }
              />

            )}


            {/* ================================================
                PLANEJAMENTO ESTRATÉGICO
                ================================================ */}

            {abaAtiva ===
              'strategic' && (

              <StrategicView
                axes={
                  strategicAxes
                }
              />

            )}

          </main>

        )}


        {/* ====================================================
            KANBAN GLOBAL DE PROJETOS
            ==================================================== */}

        {paginaAtiva ===
          'kanban-projetos' && (

          <main
            className="
              flex-1
              p-6
              lg:p-8
            "
          >

<GlobalProjectKanban
  projetos={
    meusProjetos
  }

  aoAbrirProjeto={
    abrirProjetoDoKanban
  }

  aoAtualizarProjeto={
    atualizarProjeto
  }
/>

          </main>

        )}


        {/* ====================================================
            OUTRAS PÁGINAS
            ==================================================== */}

        {paginaAtiva !==
          'monitoramento' &&
          paginaAtiva !==
          'kanban-projetos' && (

          <main
            className="
              flex
              flex-1
              items-center
              justify-center
              p-8
            "
          >

            <div
              className="
                rounded-xl
                border
                border-dashed
                border-gray-300
                bg-white
                px-10
                py-14
                text-center
              "
            >

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-600
                "
              >
                Área em construção
              </p>


              <p
                className="
                  mt-1
                  text-xs
                  text-gray-400
                "
              >
                Esta funcionalidade será implementada posteriormente.
              </p>

            </div>

          </main>

        )}

      </div>


      {/* ======================================================
          MODAL GLOBAL DO PROJETO
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

    </div>

  );
}