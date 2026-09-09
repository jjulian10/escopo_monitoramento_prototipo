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


/* ============================================================
   TIPOS
   ============================================================ */

import type {
  DadosDosFiltros,
} from '@/components/Filters';

import type {
  Project,
} from '@/data/projects';


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
     ==========================================================

     O arquivo projects.ts fornece apenas os dados iniciais.

     A partir daqui, a aplicação trabalha com este estado.

     Isso permite:

     - criar projetos;
     - editar projetos;
     - alterar tarefas;
     - alterar subtarefas;
     - movimentar Kanban;
     - atualizar histórico;
     - refletir mudanças imediatamente na interface.
     ========================================================== */

  const [
    meusProjetos,
    setMeusProjetos,
  ] = useState<Project[]>(
    projects
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
     ==========================================================

     Recebe o projeto criado pelo CreateProjectModal.
     ========================================================== */

  function adicionarNovoProjeto(
    novoProjeto: Project
  ) {


    /* --------------------------------------------------------
       ADICIONA NO TOPO DA LISTA
       -------------------------------------------------------- */

    setMeusProjetos(
      (projetosAtuais) => [

        novoProjeto,

        ...projetosAtuais,

      ]
    );


    /* --------------------------------------------------------
       VOLTA PARA MEUS PROJETOS
       -------------------------------------------------------- */

    setAbaAtiva(
      'mine'
    );


    /* --------------------------------------------------------
       LIMPA FILTROS

       Evita que o projeto recém-criado fique escondido.
       -------------------------------------------------------- */

    setFiltrosAplicados(
      filtrosIniciais
    );


    /* --------------------------------------------------------
       FECHA O MODAL
       -------------------------------------------------------- */

    setModalCriarProjetoAberto(
      false
    );

  }


  /* ==========================================================
     ATUALIZAR PROJETO
     ==========================================================

     Esta função será a porta central para todas as alterações
     realizadas dentro de um projeto.

     Exemplos:

     - mudança no Kanban;
     - criação de tarefa;
     - exclusão de tarefa;
     - criação de subtarefa;
     - alteração de etiquetas;
     - alteração de progresso;
     - atualização do histórico.
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
           FILTRO POR PROJETO
           ----------------------------------------------------- */

        const correspondeAoProjeto =

          filtrosAplicados.projeto ===
            'Todos os projetos' ||

          projeto.code ===
            filtrosAplicados.projeto;


        /* -----------------------------------------------------
           FILTRO POR STATUS
           ----------------------------------------------------- */

        const correspondeAoStatus =

          filtrosAplicados.status ===
            'Todos os status' ||

          projeto.status ===
            filtrosAplicados.status;


        /* -----------------------------------------------------
           FILTRO POR RESPONSÁVEL
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
     MEUS PROJETOS FILTRADOS
     ========================================================== */

  const meusProjetosFiltrados =

    filtrarProjetos(
      meusProjetos
    );


  /* ==========================================================
     COMPARTILHADOS FILTRADOS
     ========================================================== */

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

        <Header />


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


            {/* =================================================
                CRIAR NOVO PROJETO
                ================================================= */}

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

    </div>

  );
}