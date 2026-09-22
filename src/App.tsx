import {
  lazy,
  Suspense,
  useCallback,
  useMemo,
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

import ProjectSuccessModal from '@/components/ProjectSuccessModal';

import {
  sincronizarExecucaoDoProjeto,
} from '@/utils/projectProgress';


/* ============================================================
   COMPONENTES CARREGADOS SOMENTE QUANDO FOREM UTILIZADOS
   ============================================================ */

const carregarStrategicView = () =>
  import('@/components/StrategicView');

const carregarCreateProjectModal = () =>
  import('@/components/project-create/CreateProjectModal');

const carregarProjectDetailsModal = () =>
  import('@/components/project-details/ProjectDetailsModal');

const carregarGlobalProjectKanban = () =>
  import('@/components/project-kanban/GlobalProjectKanban');

const StrategicView = lazy(carregarStrategicView);
const CreateProjectModal = lazy(carregarCreateProjectModal);
const ProjectDetailsModal = lazy(carregarProjectDetailsModal);
const GlobalProjectKanban = lazy(carregarGlobalProjectKanban);


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

import type {
  ProjectSuccessType,
} from '@/components/ProjectSuccessModal';


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
   FILTRAGEM PURA

   Mantida fora do componente para não ser recriada a cada
   renderização da tela principal.
   ============================================================ */

function filtrarProjetos<
  T extends {
    code: string;
    status: string;
    responsible: string;
  }
>(
  listaDeProjetos: T[],
  filtrosAplicados: DadosDosFiltros
) {
  const responsavelPesquisado =
    filtrosAplicados.responsavel.trim().toLowerCase();

  return listaDeProjetos.filter((projeto) => {
    const correspondeAoProjeto =
      filtrosAplicados.projeto === 'Todos os projetos' ||
      projeto.code === filtrosAplicados.projeto;

    const correspondeAoStatus =
      filtrosAplicados.status === 'Todos os status' ||
      projeto.status === filtrosAplicados.status;

    const correspondeAoResponsavel =
      responsavelPesquisado === '' ||
      projeto.responsible.toLowerCase().includes(responsavelPesquisado);

    return (
      correspondeAoProjeto &&
      correspondeAoStatus &&
      correspondeAoResponsavel
    );
  });
}


function CarregamentoDaSecao() {
  return (
    <div
      className="min-h-40 rounded-xl border border-gray-200 bg-white"
      aria-label="Carregando conteúdo"
    />
  );
}


function CarregamentoDoModal() {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-[2px]"
      aria-label="Carregando janela"
    />
  );
}


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
     FEEDBACK DE SUCESSO DO PROJETO
     ========================================================== */

  const [
    feedbackProjeto,
    setFeedbackProjeto,
  ] = useState<{
    tipo: ProjectSuccessType;
    projeto: Project;
  } | null>(
    null
  );


  /* ==========================================================
     PROJETOS DO USUÁRIO
     ========================================================== */

     const [
      meusProjetos,
      setMeusProjetos,
    ] = useState<Project[]>(
      () =>
        projects.map(
          (projeto) =>
            sincronizarExecucaoDoProjeto(
              projeto
            )
        )
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

  const aplicarFiltros = useCallback((
    filtros: DadosDosFiltros
  ) => {

    setFiltrosAplicados(
      filtros
    );

  }, []);


  /* ==========================================================
     LIMPAR FILTROS
     ========================================================== */

  const limparFiltros = useCallback(() => {

    setFiltrosAplicados(
      filtrosIniciais
    );

  }, []);


  /* ==========================================================
     ADICIONAR NOVO PROJETO
     ========================================================== */

  const adicionarNovoProjeto = useCallback((
    novoProjeto: Project
  ) => {

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


    setFeedbackProjeto({
      tipo:
        'created',

      projeto:
        novoProjeto,
    });

  }, []);


  /* ==========================================================
     ATUALIZAR PROJETO
     ========================================================== */

     const atualizarProjeto = useCallback((
      projetoAtualizado: Project
    ) => {
    
    
      /* ========================================================
         SINCRONIZA PROGRESSO E CONCLUSÃO
         ======================================================== */
    
      const projetoSincronizado =
        sincronizarExecucaoDoProjeto(
          projetoAtualizado
        );


      /* ========================================================
         DETECTA CONCLUSÃO DO PROJETO
         ======================================================== */

      const projetoAnterior =
        meusProjetos.find(
          (projeto) =>
            projeto.id ===
            projetoSincronizado.id
        );


      const acabouDeSerConcluido =
        projetoAnterior !==
          undefined &&

        projetoAnterior.status !==
          'Concluído' &&

        projetoSincronizado.status ===
          'Concluído';


      if (
        acabouDeSerConcluido
      ) {

        setFeedbackProjeto({
          tipo:
            'completed',

          projeto:
            projetoSincronizado,
        });

      }
    
    
      /* ========================================================
         ATUALIZA LISTA PRINCIPAL
         ======================================================== */
    
      setMeusProjetos(
        (projetosAtuais) =>
    
          projetosAtuais.map(
            (projeto) =>
    
              projeto.id ===
              projetoSincronizado.id
    
                ? projetoSincronizado
    
                : projeto
    
          )
      );
    
    
      /* ========================================================
         ATUALIZA MODAL ABERTO
         ======================================================== */
    
      setProjetoSelecionado(
        (projetoAtual) =>
    
          projetoAtual?.id ===
          projetoSincronizado.id
    
            ? projetoSincronizado
    
            : projetoAtual
      );
    
    }, [
      meusProjetos,
    ]);


  /* ==========================================================
     ABRIR PROJETO
     ========================================================== */

  const abrirProjeto = useCallback((
    projeto: Project,
    secao: SecaoDetalhesProjeto =
      'informacoes'
  ) => {

    void carregarProjectDetailsModal();

    setSecaoInicialDoModal(
      secao
    );


    setProjetoSelecionado(
      projeto
    );

  }, []);


  /* ==========================================================
     ABRIR PROJETO PELO KANBAN GLOBAL
     ========================================================== */

  const abrirProjetoDoKanban = useCallback((
    projeto: Project
  ) => {

    abrirProjeto(
      projeto,
      'informacoes'
    );

  }, [abrirProjeto]);


  /* ==========================================================
     ABRIR ALERTA
     ========================================================== */

  const abrirAlerta = useCallback((
    alerta: AlertaPrazo
  ) => {

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

  }, [
    abrirProjeto,
    meusProjetos,
  ]);


  /* ==========================================================
     PROJETOS FILTRADOS
     ========================================================== */

  const meusProjetosFiltrados =

    useMemo(
      () => filtrarProjetos(
        meusProjetos,
        filtrosAplicados
      ),
      [
        meusProjetos,
        filtrosAplicados,
      ]
    );


  const projetosCompartilhadosFiltrados =

    useMemo(
      () => filtrarProjetos(
        sharedProjects,
        filtrosAplicados
      ),
      [
        filtrosAplicados,
      ]
    );


  const todosOsProjetos =
    useMemo(
      () => [
        ...meusProjetos,
        ...sharedProjects,
      ],
      [
        meusProjetos,
      ]
    );


  const alternarBarraLateral = useCallback(() => {
    setBarraLateralRecolhida(
      (estadoAtual) => !estadoAtual
    );
  }, []);


  const fecharFeedbackProjeto = useCallback(() => {

    setFeedbackProjeto(
      null
    );

  }, []);


  const prepararDetalhesDoProjeto = useCallback(() => {
    void carregarProjectDetailsModal();
  }, []);


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

        onToggle={
          alternarBarraLateral
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
          transition-[margin]
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
          projetos={
            todosOsProjetos
          }

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

                onMouseEnter={() => {
                  void carregarCreateProjectModal();
                }}

                onFocus={() => {
                  void carregarCreateProjectModal();
                }}

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
                  transition-[background-color,box-shadow]
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

              <Suspense fallback={<CarregamentoDoModal />}>
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
              </Suspense>

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

                showStatusFilter

                aoAtualizarProjeto={
                  atualizarProjeto
                }

                aoAbrirProjeto={
                  abrirProjeto
                }

                aoPrepararProjeto={
                  prepararDetalhesDoProjeto
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

                aoPrepararProjeto={
                  prepararDetalhesDoProjeto
                }
              />

            )}


            {/* ================================================
                PLANEJAMENTO ESTRATÉGICO
                ================================================ */}

            {abaAtiva ===
              'strategic' && (

              <Suspense fallback={<CarregamentoDaSecao />}>
                <StrategicView
                  axes={
                    strategicAxes
                  }
                />
              </Suspense>

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

            <Suspense fallback={<CarregamentoDaSecao />}>
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
            </Suspense>

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

        <Suspense fallback={<CarregamentoDoModal />}>
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
        </Suspense>

      )}


      {/* ======================================================
          FEEDBACK DE SUCESSO
          ====================================================== */}

      {feedbackProjeto && (

        <ProjectSuccessModal
          tipo={
            feedbackProjeto.tipo
          }

          projeto={
            feedbackProjeto.projeto
          }

          aoFechar={
            fecharFeedbackProjeto
          }
        />

      )}

    </div>

  );
}
