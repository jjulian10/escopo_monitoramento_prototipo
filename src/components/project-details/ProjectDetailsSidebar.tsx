import {
    BarChart3,
    Info,
    ListChecks,
    Columns3,
    Users,
    Coins,
    FolderOpen,
    FileText,
    History,
  } from 'lucide-react';
  
  
  /* ============================================================
     TIPOS
     ============================================================ */
  
  export type SecaoDetalhesProjeto =
    | 'indicadores'
    | 'informacoes'
    | 'acoes'
    | 'kanban'
    | 'equipe'
    | 'custos'
    | 'evidencias'
    | 'documentos'
    | 'historico';
  
  
  interface MenuDetalhesProjetoProps {
    secaoAtiva: SecaoDetalhesProjeto;
  
    aoSelecionarSecao: (
      secao: SecaoDetalhesProjeto
    ) => void;
  }
  
  
  /* ============================================================
     COMPONENTE PRINCIPAL
     ============================================================ */
  
  export default function ProjectDetailsSidebar({
    secaoAtiva,
    aoSelecionarSecao,
  }: MenuDetalhesProjetoProps) {
  
  
    /* ==========================================================
       FUNÇÃO PARA CRIAR ITEM DO MENU
       ========================================================== */
  
    function criarItemMenu(
      id: SecaoDetalhesProjeto,
      titulo: string,
      Icone: React.ElementType
    ) {
  
      const estaAtivo =
        secaoAtiva === id;
  
  
      return (
  
        <button
          onClick={() =>
            aoSelecionarSecao(id)
          }
          className={`
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            border-l-4
            px-4
            py-3
            text-left
            text-sm
            font-medium
            transition-all
  
            ${
              estaAtivo
                ? `
                  border-institution-600
                  bg-institution-50
                  text-institution-700
                `
                : `
                  border-transparent
                  text-gray-600
                  hover:bg-gray-50
                  hover:text-gray-900
                `
            }
          `}
        >
  
          <Icone className="h-4 w-4" />
  
          {titulo}
  
        </button>
  
      );
    }
  
  
    return (
  
      <aside
        className="
          w-64
          flex-shrink-0
          border-r
          border-gray-200
          bg-white
          p-4
        "
      >
  
  
        {/* ======================================================
            VISÃO GERAL
            ====================================================== */}
  
        <p
          className="
            mb-2
            px-3
            text-[11px]
            font-bold
            uppercase
            tracking-wide
            text-gray-400
          "
        >
          Visão Geral
        </p>
  
  
        <div className="space-y-1">
  
          {criarItemMenu(
            'indicadores',
            'Indicadores',
            BarChart3
          )}
  
          {criarItemMenu(
            'informacoes',
            'Informações',
            Info
          )}
  
        </div>
  
  
        {/* ======================================================
            EXECUÇÃO
            ====================================================== */}
  
        <p
          className="
            mb-2
            mt-6
            px-3
            text-[11px]
            font-bold
            uppercase
            tracking-wide
            text-gray-400
          "
        >
          Execução
        </p>
  
  
        <div className="space-y-1">
  
          {criarItemMenu(
            'acoes',
            'Ações do Projeto',
            ListChecks
          )}
  
          {criarItemMenu(
            'kanban',
            'Kanban',
            Columns3
          )}
  
          {criarItemMenu(
            'equipe',
            'Equipe',
            Users
          )}
  
        </div>
  
  
        {/* ======================================================
            REGISTROS
            ====================================================== */}
  
        <p
          className="
            mb-2
            mt-6
            px-3
            text-[11px]
            font-bold
            uppercase
            tracking-wide
            text-gray-400
          "
        >
          Registros
        </p>
  
  
        <div className="space-y-1">
  
          {criarItemMenu(
            'custos',
            'Custos',
            Coins
          )}
  
          {criarItemMenu(
            'evidencias',
            'Evidências',
            FolderOpen
          )}
  
          {criarItemMenu(
            'documentos',
            'Documentos',
            FileText
          )}
  
          {criarItemMenu(
            'historico',
            'Histórico',
            History
          )}
  
        </div>
  
      </aside>
    );
  }