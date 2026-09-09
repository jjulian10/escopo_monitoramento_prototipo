import {
    useState,
  } from 'react';
  
  import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    FolderPlus,
    X,
  } from 'lucide-react';
  
  import type {
    Project,
    ProjectTask,
  } from '@/data/projects';
  
  import CreateProjectSteps from './CreateProjectSteps';
  
  import ProjectBasicInfoStep, {
    type InformacoesBasicasProjeto,
  } from './steps/ProjectBasicInfoStep';
  
  import ProjectStructureStep from './steps/ProjectStructureStep';
  
  import ProjectReviewStep from './steps/ProjectReviewStep';
  
  
  /* ============================================================
     PROPRIEDADES
     ============================================================ */
  
  interface CreateProjectModalProps {
    aoFechar: () => void;
  
    aoCriarProjeto: (
      projeto: Project
    ) => void;
  }
  
  
  /* ============================================================
     COMPONENTE PRINCIPAL
     ============================================================ */
  
  export default function CreateProjectModal({
    aoFechar,
    aoCriarProjeto,
  }: CreateProjectModalProps) {
  
  
    /* ==========================================================
       ETAPA ATUAL
       ==========================================================
  
       1 = Informações
       2 = Estrutura
       3 = Revisão
       ========================================================== */
  
    const [
      etapaAtual,
      setEtapaAtual,
    ] = useState(1);
  
  
    /* ==========================================================
       ETAPA 1 — INFORMAÇÕES DO PROJETO
       ========================================================== */
  
    const [
      informacoes,
      setInformacoes,
    ] = useState<InformacoesBasicasProjeto>({
  
      nome: '',
  
      descricao: '',
  
      origem: '',
  
      nivel: '',
  
      projetoPai: '',
  
      dataCriacao:
        new Date()
          .toISOString()
          .split('T')[0],
  
    });
  
  
    /* ==========================================================
       ETAPA 2 — ESTRUTURA DO PROJETO
       ==========================================================
  
       Aqui ficam armazenadas todas as tarefas e subtarefas
       criadas durante o cadastro.
  
       Esse mesmo array será enviado para o novo projeto.
       ========================================================== */
  
    const [
      tarefasDoProjeto,
      setTarefasDoProjeto,
    ] = useState<ProjectTask[]>([]);
  
  
    /* ==========================================================
       AVANÇAR
       ========================================================== */
  
    function avancar() {
  
  
      /* --------------------------------------------------------
         VALIDAÇÃO — ETAPA 1
         -------------------------------------------------------- */
  
      if (
        etapaAtual === 1 &&
        !informacoes.nome.trim()
      ) {
  
        window.alert(
          'Informe o nome do projeto antes de continuar.'
        );
  
        return;
      }
  
  
      /* --------------------------------------------------------
         VALIDAÇÃO — ETAPA 2
         -------------------------------------------------------- */
  
      if (
        etapaAtual === 2 &&
        tarefasDoProjeto.length === 0
      ) {
  
        window.alert(
          'Adicione pelo menos uma tarefa antes de continuar.'
        );
  
        return;
      }
  
  
      /* --------------------------------------------------------
         AVANÇA ATÉ A ETAPA 3
         -------------------------------------------------------- */
  
      if (
        etapaAtual < 3
      ) {
  
        setEtapaAtual(
          (atual) =>
            atual + 1
        );
  
      }
  
    }
  
  
    /* ==========================================================
       VOLTAR
       ========================================================== */
  
    function voltar() {
  
      if (
        etapaAtual > 1
      ) {
  
        setEtapaAtual(
          (atual) =>
            atual - 1
        );
  
      }
  
    }
  
  
    /* ==========================================================
       CRIAR PROJETO
       ==========================================================
  
       Neste momento estamos trabalhando somente no front-end.
  
       Portanto:
  
       - o ID é criado localmente;
       - o código é criado localmente;
       - o projeto é enviado para o App.tsx;
       - posteriormente poderemos substituir isso pela API.
       ========================================================== */
  
    function criarProjeto() {
  
  
      /* --------------------------------------------------------
         DATA/HORA UTILIZADA PARA GERAR IDENTIFICADORES
         -------------------------------------------------------- */
  
      const agora =
        Date.now();
  
  
      /* --------------------------------------------------------
         CÓDIGO TEMPORÁRIO
         --------------------------------------------------------
  
         Exemplo:
  
         PROJ-12345
  
         Quando tivermos backend, o ideal é que o código
         oficial seja gerado pelo servidor/banco.
         -------------------------------------------------------- */
  
      const codigoDoProjeto =
        `PROJ-${agora
          .toString()
          .slice(-5)}`;
  
  
      /* --------------------------------------------------------
         PROGRESSO MÉDIO DAS TAREFAS
         -------------------------------------------------------- */
  
      const totalDeTarefas =
        tarefasDoProjeto.length;
  
  
      const somaDosProgressos =
        tarefasDoProjeto.reduce(
          (
            total,
            tarefa
          ) =>
            total +
            (
              tarefa.progress ??
              0
            ),
          0
        );
  
  
      const progressoGeral =
        totalDeTarefas > 0
          ? Math.round(
              somaDosProgressos /
              totalDeTarefas
            )
          : 0;
  
  
      /* --------------------------------------------------------
         RESPONSÁVEL TEMPORÁRIO
         --------------------------------------------------------
  
         Como a Etapa 1 ainda não possui um campo específico
         para responsável geral do projeto, utilizamos o
         responsável da primeira tarefa.
  
         Depois podemos criar esse campo.
         -------------------------------------------------------- */
  
      const responsavelDoProjeto =
        tarefasDoProjeto[0]
          ?.responsible
          ?.trim() ||
        'Não definido';
  
  
      /* --------------------------------------------------------
         CRIA O OBJETO DO PROJETO
         -------------------------------------------------------- */
  
      const novoProjeto: Project = {
  
        id:
          `project-${agora}`,
  
        code:
          codigoDoProjeto,
  
        title:
          informacoes.nome.trim(),
  
        tags: [],
  
        status:
          'Em andamento',
  
        progress:
          progressoGeral,
  
        deliveryDate:
          informacoes.dataCriacao,
  
        responsible:
          responsavelDoProjeto,
  
        tasks:
          tarefasDoProjeto,
  
      };
  
  
      /* --------------------------------------------------------
         ENVIA O PROJETO PARA O COMPONENTE PAI
         -------------------------------------------------------- */
  
      aoCriarProjeto(
        novoProjeto
      );
  
    }
  
  
    /* ==========================================================
       RENDERIZAÇÃO DAS ETAPAS
       ========================================================== */
  
    function renderizarEtapa() {
  
  
      /* --------------------------------------------------------
         ETAPA 1 — INFORMAÇÕES
         -------------------------------------------------------- */
  
      if (
        etapaAtual === 1
      ) {
  
        return (
  
          <ProjectBasicInfoStep
            dados={
              informacoes
            }
  
            aoAlterar={
              setInformacoes
            }
          />
  
        );
  
      }
  
  
      /* --------------------------------------------------------
         ETAPA 2 — ESTRUTURA DO PROJETO
         -------------------------------------------------------- */
  
      if (
        etapaAtual === 2
      ) {
  
        return (
  
          <ProjectStructureStep
            tarefas={
              tarefasDoProjeto
            }
  
            aoAlterarTarefas={
              setTarefasDoProjeto
            }
          />
  
        );
  
      }
  
  
      /* --------------------------------------------------------
         ETAPA 3 — REVISÃO
         -------------------------------------------------------- */
  
      if (
        etapaAtual === 3
      ) {
  
        return (
  
          <ProjectReviewStep
            informacoes={
              informacoes
            }
  
            tarefas={
              tarefasDoProjeto
            }
          />
  
        );
  
      }
  
  
      /* --------------------------------------------------------
         FALLBACK DE SEGURANÇA
         -------------------------------------------------------- */
  
      return null;
  
    }
  
  
    /* ==========================================================
       INTERFACE
       ========================================================== */
  
    return (
  
      <div
        className="
          fixed
          inset-0
          z-[80]
          flex
          items-center
          justify-center
          bg-black/40
          p-4
          backdrop-blur-[2px]
        "
      >
  
  
        {/* ======================================================
            MODAL
            ====================================================== */}
  
        <div
          className="
            flex
            h-[94vh]
            w-full
            max-w-[1450px]
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
                items-center
                gap-2
              "
            >
  
              <FolderPlus className="h-5 w-5" />
  
  
              <div>
  
                <h1
                  className="
                    text-lg
                    font-semibold
                  "
                >
                  Cadastrar Projeto
                </h1>
  
  
                <p
                  className="
                    text-xs
                    text-white/70
                  "
                >
                  Crie e estruture um novo projeto institucional.
                </p>
  
              </div>
  
            </div>
  
  
            {/* --------------------------------------------------
                FECHAR
                -------------------------------------------------- */}
  
            <button
              onClick={
                aoFechar
              }
  
              className="
                flex
                h-9
                w-9
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
              INDICADOR DAS ETAPAS
              ==================================================== */}
  
          <CreateProjectSteps
            etapaAtual={
              etapaAtual
            }
          />
  
  
          {/* ====================================================
              CONTEÚDO
              ==================================================== */}
  
          <main
            className="
              min-h-0
              flex-1
              overflow-y-auto
              bg-slate-50/60
              p-6
              lg:p-8
            "
          >
  
            <div
              className="
                mx-auto
                max-w-6xl
              "
            >
  
              {renderizarEtapa()}
  
            </div>
  
          </main>
  
  
          {/* ====================================================
              RODAPÉ
              ==================================================== */}
  
          <footer
            className="
              flex
              items-center
              justify-between
              border-t
              border-gray-200
              bg-white
              px-6
              py-4
            "
          >
  
  
            {/* --------------------------------------------------
                CANCELAR
                -------------------------------------------------- */}
  
            <button
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
                text-gray-600
                transition-colors
                hover:bg-gray-50
              "
            >
              Cancelar
            </button>
  
  
            {/* ==================================================
                NAVEGAÇÃO
                ================================================== */}
  
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
  
  
              {/* ------------------------------------------------
                  VOLTAR
                  ------------------------------------------------ */}
  
              {etapaAtual > 1 && (
  
                <button
                  onClick={
                    voltar
                  }
  
                  className="
                    flex
                    items-center
                    gap-2
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
  
                  <ArrowLeft className="h-4 w-4" />
  
                  Voltar
  
                </button>
  
              )}
  
  
              {/* ------------------------------------------------
                  AVANÇAR
                  ------------------------------------------------ */}
  
              {etapaAtual < 3 ? (
  
                <button
                  onClick={
                    avancar
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
  
                  Avançar
  
                  <ArrowRight className="h-4 w-4" />
  
                </button>
  
              ) : (
  
                /* ===============================================
                   CRIAR PROJETO
                   =============================================== */
  
                <button
                  onClick={
                    criarProjeto
                  }
  
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-green-600
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    shadow-sm
                    transition-all
                    hover:bg-green-700
                    hover:shadow-md
                  "
                >
  
                  <CheckCircle2 className="h-4 w-4" />
  
                  Criar Projeto
  
                </button>
  
              )}
  
            </div>
  
          </footer>
  
        </div>
  
      </div>
  
    );
  }