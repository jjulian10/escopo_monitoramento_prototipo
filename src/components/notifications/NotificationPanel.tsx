import {
    useMemo,
    useState,
  } from 'react';
  
  import {
    AlertTriangle,
    Bell,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FolderKanban,
    ListChecks,
    Layers3,
    User,
    X,
  } from 'lucide-react';
  
  import type {
    AlertaPrazo,
    TipoAlertaPrazo,
  } from '@/utils/projectAlerts';
  
  
  /* ============================================================
     PROPRIEDADES
     ============================================================ */
  
  interface NotificationPanelProps {
    alertas: AlertaPrazo[];
  
    aoFechar: () => void;
  
    aoSelecionarAlerta?: (
      alerta: AlertaPrazo
    ) => void;
  }
  
  
  /* ============================================================
     FILTROS
     ============================================================ */
  
  type FiltroNotificacao =
    | 'todos'
    | 'atrasados'
    | 'prazo_proximo';
  
  
  /* ============================================================
     CONFIGURAÇÃO DO TIPO
     ============================================================ */
  
  const configuracaoTipo: Record<
    TipoAlertaPrazo,
    {
      titulo: string;
      fundo: string;
      borda: string;
      texto: string;
      ponto: string;
    }
  > = {
  
    atrasado: {
      titulo:
        'Atrasado',
  
      fundo:
        'bg-red-50',
  
      borda:
        'border-red-100',
  
      texto:
        'text-red-700',
  
      ponto:
        'bg-red-500',
    },
  
  
    prazo_proximo: {
      titulo:
        'Prazo próximo',
  
      fundo:
        'bg-amber-50',
  
      borda:
        'border-amber-100',
  
      texto:
        'text-amber-700',
  
      ponto:
        'bg-amber-500',
    },
  
  };
  
  
  /* ============================================================
     ÍCONE DO NÍVEL
     ============================================================ */
  
  function obterIconeDoNivel(
    nivel: AlertaPrazo['nivel']
  ) {
  
    if (
      nivel ===
      'projeto'
    ) {
      return FolderKanban;
    }
  
  
    if (
      nivel ===
      'tarefa'
    ) {
      return ListChecks;
    }
  
  
    return Layers3;
  
  }
  
  
  /* ============================================================
     RÓTULO DO NÍVEL
     ============================================================ */
  
  function obterRotuloDoNivel(
    nivel: AlertaPrazo['nivel']
  ) {
  
    if (
      nivel ===
      'projeto'
    ) {
      return 'Projeto';
    }
  
  
    if (
      nivel ===
      'tarefa'
    ) {
      return 'Tarefa';
    }
  
  
    return 'Subtarefa';
  
  }
  
  
  /* ============================================================
     COMPONENTE PRINCIPAL
     ============================================================ */
  
  export default function NotificationPanel({
    alertas,
    aoFechar,
    aoSelecionarAlerta,
  }: NotificationPanelProps) {
  
  
    /* ==========================================================
       FILTRO ATIVO
       ========================================================== */
  
    const [
      filtro,
      setFiltro,
    ] = useState<FiltroNotificacao>(
      'todos'
    );
  
  
    /* ==========================================================
       CONTADORES
       ========================================================== */
  
    const totalAtrasados =
      useMemo(
        () =>
          alertas.filter(
            (alerta) =>
              alerta.tipo ===
              'atrasado'
          ).length,
        [
          alertas,
        ]
      );
  
  
    const totalPrazoProximo =
      useMemo(
        () =>
          alertas.filter(
            (alerta) =>
              alerta.tipo ===
              'prazo_proximo'
          ).length,
        [
          alertas,
        ]
      );
  
  
    /* ==========================================================
       ALERTAS FILTRADOS
       ========================================================== */
  
    const alertasFiltrados =
      useMemo(
        () => {
  
          if (
            filtro ===
            'atrasados'
          ) {
  
            return alertas.filter(
              (alerta) =>
                alerta.tipo ===
                'atrasado'
            );
  
          }
  
  
          if (
            filtro ===
            'prazo_proximo'
          ) {
  
            return alertas.filter(
              (alerta) =>
                alerta.tipo ===
                'prazo_proximo'
            );
  
          }
  
  
          return alertas;
  
        },
        [
          alertas,
          filtro,
        ]
      );
  
  
    /* ==========================================================
       INTERFACE
       ========================================================== */
  
    return (
  
      <div
        className="
          absolute
          right-0
          top-[calc(100%+12px)]
          z-50
          w-[420px]
          max-w-[calc(100vw-32px)]
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-2xl
        "
      >
  
  
        {/* ======================================================
            CABEÇALHO
            ====================================================== */}
  
        <div
          className="
            flex
            items-start
            justify-between
            bg-institution-600
            px-5
            py-4
            text-white
          "
        >
  
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
  
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-white/10
              "
            >
  
              <Bell className="h-4.5 w-4.5" />
  
            </div>
  
  
            <div>
  
              <h2
                className="
                  text-sm
                  font-semibold
                "
              >
                Alertas de Prazo
              </h2>
  
  
              <p
                className="
                  mt-0.5
                  text-xs
                  text-white/70
                "
              >
                Acompanhe vencimentos de projetos, tarefas e subtarefas.
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
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-white/70
              transition-colors
              hover:bg-white/10
              hover:text-white
            "
  
            title="Fechar notificações"
          >
  
            <X className="h-4 w-4" />
  
          </button>
  
        </div>
  
  
        {/* ======================================================
            FILTROS
            ====================================================== */}
  
        <div
          className="
            border-b
            border-gray-100
            bg-slate-50/70
            p-3
          "
        >
  
          <div
            className="
              grid
              grid-cols-3
              gap-1
              rounded-xl
              border
              border-gray-200
              bg-white
              p-1
            "
          >
  
            {/* TODOS */}
  
            <button
              type="button"
  
              onClick={() =>
                setFiltro(
                  'todos'
                )
              }
  
              className={`
                rounded-lg
                px-3
                py-2
                text-xs
                font-medium
                transition-all
  
                ${
                  filtro ===
                  'todos'
  
                    ? `
                      bg-institution-50
                      text-institution-700
                      shadow-sm
                    `
  
                    : `
                      text-gray-500
                      hover:bg-gray-50
                      hover:text-gray-700
                    `
                }
              `}
            >
              Todos · {alertas.length}
            </button>
  
  
            {/* ATRASADOS */}
  
            <button
              type="button"
  
              onClick={() =>
                setFiltro(
                  'atrasados'
                )
              }
  
              className={`
                rounded-lg
                px-3
                py-2
                text-xs
                font-medium
                transition-all
  
                ${
                  filtro ===
                  'atrasados'
  
                    ? `
                      bg-red-50
                      text-red-700
                      shadow-sm
                    `
  
                    : `
                      text-gray-500
                      hover:bg-gray-50
                      hover:text-gray-700
                    `
                }
              `}
            >
              Atrasados · {totalAtrasados}
            </button>
  
  
            {/* PRAZO PRÓXIMO */}
  
            <button
              type="button"
  
              onClick={() =>
                setFiltro(
                  'prazo_proximo'
                )
              }
  
              className={`
                rounded-lg
                px-3
                py-2
                text-xs
                font-medium
                transition-all
  
                ${
                  filtro ===
                  'prazo_proximo'
  
                    ? `
                      bg-amber-50
                      text-amber-700
                      shadow-sm
                    `
  
                    : `
                      text-gray-500
                      hover:bg-gray-50
                      hover:text-gray-700
                    `
                }
              `}
            >
              Próximos · {totalPrazoProximo}
            </button>
  
          </div>
  
        </div>
  
  
        {/* ======================================================
            LISTA
            ====================================================== */}
  
        <div
          className="
            max-h-[500px]
            overflow-y-auto
          "
        >
  
          {alertasFiltrados.length > 0 ? (
  
            <div
              className="
                divide-y
                divide-gray-100
              "
            >
  
              {alertasFiltrados.map(
                (alerta) => {
  
  
                  const configuracao =
                    configuracaoTipo[
                      alerta.tipo
                    ];
  
  
                  const IconeNivel =
                    obterIconeDoNivel(
                      alerta.nivel
                    );
  
  
                  return (
  
                    <button
                      key={
                        alerta.id
                      }
  
                      type="button"
  
                      onClick={() =>
                        aoSelecionarAlerta?.(
                          alerta
                        )
                      }
  
                      className="
                        block
                        w-full
                        px-5
                        py-4
                        text-left
                        transition-colors
                        hover:bg-slate-50
                      "
                    >
  
                      {/* ==========================================
                          TOPO
                          ========================================== */}
  
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
  
                          <span
                            className={`
                              h-2
                              w-2
                              flex-shrink-0
                              rounded-full
  
                              ${configuracao.ponto}
                            `}
                          />
  
  
                          <span
                            className={`
                              rounded-md
                              border
                              px-2
                              py-0.5
                              text-[10px]
                              font-semibold
  
                              ${configuracao.fundo}
                              ${configuracao.borda}
                              ${configuracao.texto}
                            `}
                          >
                            {configuracao.titulo}
                          </span>
  
  
                          <span
                            className="
                              flex
                              items-center
                              gap-1
                              text-[10px]
                              font-medium
                              uppercase
                              tracking-wide
                              text-gray-400
                            "
                          >
  
                            <IconeNivel className="h-3 w-3" />
  
                            {obterRotuloDoNivel(
                              alerta.nivel
                            )}
  
                          </span>
  
                        </div>
  
  
                        {alerta.tipo ===
                          'atrasado' ? (
  
                          <AlertTriangle
                            className="
                              h-4
                              w-4
                              flex-shrink-0
                              text-red-500
                            "
                          />
  
                        ) : (
  
                          <Clock3
                            className="
                              h-4
                              w-4
                              flex-shrink-0
                              text-amber-500
                            "
                          />
  
                        )}
  
                      </div>
  
  
                      {/* ==========================================
                          PROJETO
                          ========================================== */}
  
                      <p
                        className="
                          mt-3
                          text-[11px]
                          font-semibold
                          text-institution-600
                        "
                      >
                        {alerta.projetoCodigo}
                      </p>
  
  
                      <p
                        className="
                          mt-0.5
                          line-clamp-1
                          text-xs
                          text-gray-500
                        "
                      >
                        {alerta.projetoTitulo}
                      </p>
  
  
                      {/* ==========================================
                          ITEM
                          ========================================== */}
  
                      {alerta.nivel ===
                        'tarefa' &&
                        alerta.tarefaTitulo && (
  
                          <p
                            className="
                              mt-2
                              text-sm
                              font-semibold
                              text-gray-800
                            "
                          >
                            {alerta.tarefaOrdem}.{' '}
                            {alerta.tarefaTitulo}
                          </p>
  
                        )}
  
  
                      {alerta.nivel ===
                        'subtarefa' &&
                        alerta.subtarefaTitulo && (
  
                          <div className="mt-2">
  
                            {alerta.tarefaTitulo && (
  
                              <p
                                className="
                                  text-[11px]
                                  text-gray-400
                                "
                              >
                                Tarefa {alerta.tarefaOrdem} — {alerta.tarefaTitulo}
                              </p>
  
                            )}
  
  
                            <p
                              className="
                                mt-0.5
                                text-sm
                                font-semibold
                                text-gray-800
                              "
                            >
                              {alerta.tarefaOrdem}.
                              {alerta.subtarefaOrdem}{' '}
  
                              {alerta.subtarefaTitulo}
                            </p>
  
                          </div>
  
                        )}
  
  
                      {alerta.nivel ===
                        'projeto' && (
  
                          <p
                            className="
                              mt-2
                              text-sm
                              font-semibold
                              text-gray-800
                            "
                          >
                            {alerta.titulo}
                          </p>
  
                        )}
  
  
                      {/* ==========================================
                          PRAZO
                          ========================================== */}
  
                      <div
                        className={`
                          mt-3
                          rounded-lg
                          border
                          px-3
                          py-2.5
  
                          ${configuracao.fundo}
                          ${configuracao.borda}
                        `}
                      >
  
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                          "
                        >
  
                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                            "
                          >
  
                            <CalendarDays
                              className={`
                                h-3.5
                                w-3.5
  
                                ${configuracao.texto}
                              `}
                            />
  
  
                            <span
                              className="
                                text-[11px]
                                text-gray-500
                              "
                            >
                              Prazo
                            </span>
  
  
                            <span
                              className="
                                text-[11px]
                                font-semibold
                                text-gray-700
                              "
                            >
                              {alerta.prazoFormatado}
                            </span>
  
                          </div>
  
  
                          <span
                            className={`
                              text-[11px]
                              font-semibold
  
                              ${configuracao.texto}
                            `}
                          >
                            {alerta.descricao}
                          </span>
  
                        </div>
  
                      </div>
  
  
                      {/* ==========================================
                          RESPONSÁVEL
                          ========================================== */}
  
                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          gap-1.5
                          text-[11px]
                          text-gray-400
                        "
                      >
  
                        <User className="h-3.5 w-3.5" />
  
                        <span>
                          Responsável:
                        </span>
  
  
                        <span
                          className="
                            font-medium
                            text-gray-600
                          "
                        >
                          {alerta.responsavel}
                        </span>
  
                      </div>
  
                    </button>
  
                  );
  
                }
              )}
  
            </div>
  
          ) : (
  
            /* ===================================================
               ESTADO VAZIO
               =================================================== */
  
            <div
              className="
                px-6
                py-14
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
                  bg-green-50
                "
              >
  
                <CheckCircle2
                  className="
                    h-5
                    w-5
                    text-green-600
                  "
                />
  
              </div>
  
  
              <p
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Nenhum alerta de prazo
              </p>
  
  
              <p
                className="
                  mx-auto
                  mt-1
                  max-w-[280px]
                  text-xs
                  leading-relaxed
                  text-gray-400
                "
              >
                Não existem projetos, tarefas ou subtarefas correspondentes a este filtro.
              </p>
  
            </div>
  
          )}
  
        </div>
  
  
        {/* ======================================================
            RODAPÉ
            ====================================================== */}
  
        <div
          className="
            flex
            items-center
            justify-between
            border-t
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
              text-[11px]
              text-gray-400
            "
          >
  
            <Bell className="h-3.5 w-3.5" />
  
            Monitoramento automático de prazos
  
          </div>
  
  
          <span
            className="
              text-[11px]
              font-semibold
              text-gray-500
            "
          >
            {alertas.length}{' '}
            {alertas.length === 1
              ? 'alerta'
              : 'alertas'}
          </span>
  
        </div>
  
      </div>
  
    );
  }