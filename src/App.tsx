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
     ABA ATIVA
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


    /* --------------------------------------------------------
       SE O PROJETO ESTIVER ABERTO, ATUALIZA TAMBÉM O MODAL
       -------------------------------------------------------- */

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
     ABRIR ALERTA
     ========================================================== */

  function abrirAlerta(
    alerta: AlertaPrazo
  ) {


    /* --------------------------------------------------------
       PROCURA PRIMEIRO NOS MEUS PROJETOS
       -------------------------------------------------------- */

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
       DEFINE A ABA DA TELA PRINCIPAL
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
       LIMPA FILTROS
       -------------------------------------------------------- */

    setFiltrosAplicados(
      filtrosIniciais
    );


    /* --------------------------------------------------------
       DEFINE QUAL ÁREA DO MODAL ABRIR
       --------------------------------------------------------

       Projeto
       → Informações

       Tarefa
       → Ações do Projeto

       Subtarefa
       → Kanban
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


        const correspondeAoProjeto =

          filtrosAplicados.projeto ===
            'Todos os projetos' ||

          projeto.code ===
            filtrosAplicados.projeto;


        const correspondeAoStatus =

          filtrosAplicados.status ===
            'Todos os status' ||

          projeto.status ===
            filtrosAplicados.status;


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
            CONTEÚDO
            ==================================================== */}

        <main
          className="
            flex-1
            space-y-8
            p-6
            lg:p-8
          "
        >


          {/* ==================================================
              TÍTULO
              ================================================== */}

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


            <button
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


          {/* ==================================================
              MODAL DE CRIAÇÃO
              ================================================== */}

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


          {/* ==================================================
              ABAS
              ================================================== */}

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


          {/* ==================================================
              FILTROS
              ================================================== */}

          <Filters
            aoFiltrar={
              aplicarFiltros
            }

            aoLimpar={
              limparFiltros
            }
          />


          {/* ==================================================
              RESUMO
              ================================================== */}

          <SummaryCards
            cards={
              cardsDeResumo
            }
          />


          {/* ==================================================
              MEUS PROJETOS
              ================================================== */}

          {abaAtiva === 'mine' && (

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


          {/* ==================================================
              COMPARTILHADOS
              ================================================== */}

          {abaAtiva === 'shared' && (

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


          {/* ==================================================
              PLANEJAMENTO ESTRATÉGICO
              ================================================== */}

          {abaAtiva ===
            'strategic' && (

            <StrategicView
              axes={
                strategicAxes
              }
            />

          )}

        </main>

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