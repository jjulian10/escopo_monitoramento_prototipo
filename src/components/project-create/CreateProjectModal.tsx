import {
  useEffect,
  useState,
} from 'react';

import {
  createPortal,
} from 'react-dom';

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
     BLOQUEIO DA ROLAGEM DA PÁGINA DE FUNDO

     O formulário mantém a própria rolagem, mas o documento não
     deve continuar se movendo quando o usuário chega aos limites
     superior ou inferior do conteúdo do modal.
     ========================================================== */

  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const previousRootOverflow = root.style.overflow;

    body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
      root.style.overflow = previousRootOverflow;
    };
  }, []);


  /* ==========================================================
     ETAPA ATUAL

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

    /* --------------------------------------------------------
       IDENTIFICAÇÃO
       -------------------------------------------------------- */

    nome: '',

    descricao: '',

    origem: '',


    /* --------------------------------------------------------
       CLASSIFICAÇÃO
       -------------------------------------------------------- */

    nivel: '',

    projetoPai: '',

    dataCriacao:
      new Date()
        .toISOString()
        .split('T')[0],


    /* --------------------------------------------------------
       GERENTE DO PROJETO
       -------------------------------------------------------- */

    gerenteUsuario: '',

    gerenteGrupo: '',


    /* --------------------------------------------------------
       PLANEJAMENTO
       -------------------------------------------------------- */

    entregaEstimada: '',

    dataInicio: '',

    dataEntrega: '',

  });


  /* ==========================================================
     ETAPA 2 — ESTRUTURA
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
       GERENTE DO PROJETO
       -------------------------------------------------------- */

    if (
      etapaAtual === 1 &&
      !informacoes.gerenteUsuario
    ) {

      window.alert(
        'Selecione o gerente do projeto antes de continuar.'
      );

      return;

    }


    /* --------------------------------------------------------
       GRUPO
       -------------------------------------------------------- */

    if (
      etapaAtual === 1 &&
      !informacoes.gerenteGrupo
    ) {

      window.alert(
        'Selecione o grupo responsável pelo projeto.'
      );

      return;

    }


    /* --------------------------------------------------------
       VALIDAÇÃO DAS DATAS
       -------------------------------------------------------- */

    if (
      etapaAtual === 1 &&
      informacoes.dataInicio &&
      informacoes.dataEntrega &&
      informacoes.dataEntrega <
        informacoes.dataInicio
    ) {

      window.alert(
        'A data de entrega não pode ser anterior à data de início.'
      );

      return;

    }


    /* --------------------------------------------------------
       ETAPA 2 — PRECISA TER TAREFA
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
       AVANÇA
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
     ========================================================== */

  function criarProjeto() {


    /* --------------------------------------------------------
       IDENTIFICADOR TEMPORÁRIO
       -------------------------------------------------------- */

    const agora =
      Date.now();


    const codigoDoProjeto =
      `PROJ-${agora
        .toString()
        .slice(-5)}`;


    /* ========================================================
       PROGRESSO INICIAL
       ========================================================

       Calculamos o progresso médio das tarefas.

       Futuramente isso será totalmente derivado de:

       Subtarefas
           ↓
       Tarefas
           ↓
       Projeto
       ======================================================== */

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


    /* ========================================================
       DEFINIR STATUS INICIAL
       ======================================================== */

    const todasConcluidas =

      tarefasDoProjeto.length > 0 &&

      tarefasDoProjeto.every(
        (tarefa) =>
          tarefa.status ===
          'Concluído'
      );


    const todasNaoIniciadas =

      tarefasDoProjeto.length === 0 ||

      tarefasDoProjeto.every(
        (tarefa) =>
          tarefa.status ===
          'Não iniciado'
      );


    const statusInicial: Project['status'] =

      todasConcluidas

        ? 'Concluído'

        : todasNaoIniciadas

        ? 'Em andamento'

        : 'Em andamento';


    /* ========================================================
       DATA PRINCIPAL DE ENTREGA
       ========================================================

       Para a listagem principal utilizamos:

       1. Data de entrega
       2. Entrega estimada
       3. Caso nenhuma exista, mostramos "Não definida"
       ======================================================== */

    const dataPrincipalDeEntrega =

      informacoes.dataEntrega ||

      informacoes.entregaEstimada ||

      'Não definida';


    /* ========================================================
       CRIAR PROJETO
       ======================================================== */

    const novoProjeto: Project = {

      /* ------------------------------------------------------
         IDENTIFICAÇÃO
         ------------------------------------------------------ */

      id:
        `project-${agora}`,

      code:
        codigoDoProjeto,

      title:
        informacoes.nome.trim(),

      description:
        informacoes.descricao.trim(),


      /* ------------------------------------------------------
         CLASSIFICAÇÃO
         ------------------------------------------------------ */

      origin:
        informacoes.origem,

      level:
        informacoes.nivel,

      parentProject:
        informacoes.projetoPai,

      createdAt:
        informacoes.dataCriacao,


      /* ------------------------------------------------------
         GERENTE
         ------------------------------------------------------ */

      managerUser:
        informacoes.gerenteUsuario,

      managerGroup:
        informacoes.gerenteGrupo,

      responsible:
        informacoes.gerenteUsuario,


      /* ------------------------------------------------------
         PLANEJAMENTO
         ------------------------------------------------------ */

      estimatedDeliveryDate:
        informacoes.entregaEstimada,

      startDate:
        informacoes.dataInicio,

      actualDeliveryDate:
        informacoes.dataEntrega,

      deliveryDate:
        dataPrincipalDeEntrega,


      /* ------------------------------------------------------
         SITUAÇÃO
         ------------------------------------------------------ */

      tags: [],

      status:
        statusInicial,

      progress:
        progressoGeral,


      /* ------------------------------------------------------
         ESTRUTURA
         ------------------------------------------------------ */

      tasks:
        tarefasDoProjeto,


      /* ------------------------------------------------------
         HISTÓRICO INICIAL
         ------------------------------------------------------ */

      history: [

        {
          id:
            `history-${agora}`,

          type:
            'project_created',

          title:
            'Projeto criado',

          description:
            `O projeto ${codigoDoProjeto} — ${informacoes.nome.trim()} foi criado.`,

          user:
            informacoes.gerenteUsuario,

          createdAt:
            new Date().toISOString(),
        },

      ],

    };


    /* ========================================================
       ENVIA PARA O APP
       ======================================================== */

    aoCriarProjeto(
      novoProjeto
    );

  }


  /* ==========================================================
     RENDERIZAR ETAPA
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
       ETAPA 2 — ESTRUTURA
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


    return null;

  }


  /* ==========================================================
     INTERFACE
     ========================================================== */

  return createPortal(

    <div
      className="
        scope-create-modal
        fixed
        inset-0
        z-[9999]
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
          scope-create-modal-panel
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
            min-h-16
            shrink-0
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


          <button
            type="button"

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
            ETAPAS
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
              text-gray-600
              transition-colors
              hover:bg-gray-50
            "
          >
            Cancelar
          </button>


          <div
            className="
              flex
              items-center
              gap-3
            "
          >


            {/* VOLTAR */}

            {etapaAtual > 1 && (

              <button
                type="button"

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


            {/* AVANÇAR */}

            {etapaAtual < 3 ? (

              <button
                type="button"

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

              <button
                type="button"

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

  , document.body);
}
