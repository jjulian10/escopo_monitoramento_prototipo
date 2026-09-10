import type {
    Project,
    ProjectTask,
    ProjectSubtask,
  } from '@/data/projects';
  
  
  /* ============================================================
     CONFIGURAÇÃO
     ============================================================ */
  
  /*
   * Quantidade de dias utilizada para considerar
   * um prazo como "próximo".
   *
   * Exemplo:
   *
   * hoje: 10/09
   * prazo: 16/09
   *
   * faltam 6 dias
   * → PRAZO PRÓXIMO
   */
  export const DIAS_PARA_PRAZO_PROXIMO = 7;
  
  
  /* ============================================================
     TIPOS DE ALERTA
     ============================================================ */
  
  export type TipoAlertaPrazo =
    | 'atrasado'
    | 'prazo_proximo';
  
  
  /* ============================================================
     ORIGEM DO ALERTA
     ============================================================ */
  
  export type NivelAlertaPrazo =
    | 'projeto'
    | 'tarefa'
    | 'subtarefa';
  
  
  /* ============================================================
     INTERFACE DO ALERTA
     ============================================================ */
  
  export interface AlertaPrazo {
    /*
     * Identificador único utilizado pela interface.
     */
    id: string;
  
    /*
     * atrasado
     * prazo_proximo
     */
    tipo: TipoAlertaPrazo;
  
    /*
     * projeto
     * tarefa
     * subtarefa
     */
    nivel: NivelAlertaPrazo;
  
    /*
     * Projeto ao qual o alerta pertence.
     */
    projetoId: string;
  
    projetoCodigo: string;
  
    projetoTitulo: string;
  
    /*
     * Informações opcionais da tarefa.
     */
    tarefaId?: string;
  
    tarefaOrdem?: number;
  
    tarefaTitulo?: string;
  
    /*
     * Informações opcionais da subtarefa.
     */
    subtarefaId?: string;
  
    subtarefaOrdem?: number;
  
    subtarefaTitulo?: string;
  
    /*
     * Título principal exibido na notificação.
     */
    titulo: string;
  
    /*
     * Texto complementar.
     */
    descricao: string;
  
    /*
     * Responsável pelo item.
     */
    responsavel: string;
  
    /*
     * Data original cadastrada.
     */
    prazo: string;
  
    /*
     * Data já convertida para exibição.
     */
    prazoFormatado: string;
  
    /*
     * Diferença entre hoje e o prazo.
     *
     * Exemplos:
     *
     * -3 → atrasado há 3 dias
     *  0 → vence hoje
     *  4 → vence em 4 dias
     */
    diasRestantes: number;
  }
  
  
  /* ============================================================
     NORMALIZAR DATA
     ============================================================
  
     O protótipo atualmente trabalha com dois formatos:
  
     dd/mm/aaaa
     Ex.: 30/09/2026
  
     aaaa-mm-dd
     Ex.: 2026-09-30
  
     Essa função entende os dois formatos.
     ============================================================ */
  
  function converterParaData(
    valor?: string
  ): Date | null {
  
    if (!valor) {
      return null;
    }
  
  
    const data =
      valor.trim();
  
  
    if (!data) {
      return null;
    }
  
  
    /* ==========================================================
       FORMATO: DD/MM/AAAA
       ========================================================== */
  
    if (
      data.includes('/')
    ) {
  
      const partes =
        data.split('/');
  
  
      if (
        partes.length !== 3
      ) {
        return null;
      }
  
  
      const [
        diaTexto,
        mesTexto,
        anoTexto,
      ] = partes;
  
  
      const dia =
        Number(
          diaTexto
        );
  
  
      const mes =
        Number(
          mesTexto
        );
  
  
      const ano =
        Number(
          anoTexto
        );
  
  
      if (
        !dia ||
        !mes ||
        !ano
      ) {
        return null;
      }
  
  
      const resultado =
        new Date(
          ano,
          mes - 1,
          dia
        );
  
  
      /*
       * Evita aceitar datas impossíveis como:
       *
       * 32/01/2026
       * 31/02/2026
       */
      if (
        resultado.getFullYear() !== ano ||
        resultado.getMonth() !== mes - 1 ||
        resultado.getDate() !== dia
      ) {
        return null;
      }
  
  
      return resultado;
  
    }
  
  
    /* ==========================================================
       FORMATO: AAAA-MM-DD
       ========================================================== */
  
    if (
      data.includes('-')
    ) {
  
      const partes =
        data.split('-');
  
  
      if (
        partes.length !== 3
      ) {
        return null;
      }
  
  
      const [
        anoTexto,
        mesTexto,
        diaTexto,
      ] = partes;
  
  
      const ano =
        Number(
          anoTexto
        );
  
  
      const mes =
        Number(
          mesTexto
        );
  
  
      const dia =
        Number(
          diaTexto
        );
  
  
      if (
        !dia ||
        !mes ||
        !ano
      ) {
        return null;
      }
  
  
      const resultado =
        new Date(
          ano,
          mes - 1,
          dia
        );
  
  
      if (
        resultado.getFullYear() !== ano ||
        resultado.getMonth() !== mes - 1 ||
        resultado.getDate() !== dia
      ) {
        return null;
      }
  
  
      return resultado;
  
    }
  
  
    return null;
  
  }
  
  
  /* ============================================================
     RETIRAR HORÁRIO DA DATA
     ============================================================ */
  
  function normalizarInicioDoDia(
    data: Date
  ) {
  
    return new Date(
      data.getFullYear(),
      data.getMonth(),
      data.getDate()
    );
  
  }
  
  
  /* ============================================================
     DIFERENÇA EM DIAS
     ============================================================ */
  
  function calcularDiasRestantes(
    prazo: Date,
    dataReferencia: Date
  ) {
  
    const prazoNormalizado =
      normalizarInicioDoDia(
        prazo
      );
  
  
    const referenciaNormalizada =
      normalizarInicioDoDia(
        dataReferencia
      );
  
  
    const diferenca =
      prazoNormalizado.getTime() -
      referenciaNormalizada.getTime();
  
  
    const umDia =
      1000 *
      60 *
      60 *
      24;
  
  
    return Math.round(
      diferenca /
      umDia
    );
  
  }
  
  
  /* ============================================================
     FORMATAR DATA
     ============================================================ */
  
  function formatarData(
    data: Date
  ) {
  
    return new Intl.DateTimeFormat(
      'pt-BR'
    ).format(
      data
    );
  
  }
  
  
  /* ============================================================
     CLASSIFICAR PRAZO
     ============================================================ */
  
  function classificarPrazo(
    prazo: Date,
    dataReferencia: Date
  ): {
    tipo: TipoAlertaPrazo;
    diasRestantes: number;
  } | null {
  
    const diasRestantes =
      calcularDiasRestantes(
        prazo,
        dataReferencia
      );
  
  
    /* ==========================================================
       ATRASADO
       ========================================================== */
  
    if (
      diasRestantes < 0
    ) {
  
      return {
        tipo:
          'atrasado',
  
        diasRestantes,
      };
  
    }
  
  
    /* ==========================================================
       PRAZO PRÓXIMO
       ========================================================== */
  
    if (
      diasRestantes <=
      DIAS_PARA_PRAZO_PROXIMO
    ) {
  
      return {
        tipo:
          'prazo_proximo',
  
        diasRestantes,
      };
  
    }
  
  
    /*
     * Fora da janela de alerta.
     */
    return null;
  
  }
  
  
  /* ============================================================
     TEXTO DO PRAZO
     ============================================================ */
  
  function criarDescricaoDoPrazo(
    diasRestantes: number
  ) {
  
    /* ATRASADO */
  
    if (
      diasRestantes < -1
    ) {
  
      return `Atrasado há ${Math.abs(
        diasRestantes
      )} dias.`;
  
    }
  
  
    if (
      diasRestantes === -1
    ) {
  
      return 'Atrasado há 1 dia.';
  
    }
  
  
    /* HOJE */
  
    if (
      diasRestantes === 0
    ) {
  
      return 'O prazo termina hoje.';
  
    }
  
  
    /* AMANHÃ */
  
    if (
      diasRestantes === 1
    ) {
  
      return 'O prazo termina amanhã.';
  
    }
  
  
    /* FUTURO */
  
    return `Faltam ${diasRestantes} dias para o prazo.`;
  
  }
  
  
  /* ============================================================
     BUSCAR PRAZO PRINCIPAL DO PROJETO
     ============================================================
  
     Ordem utilizada:
  
     1. data de entrega
     2. entrega estimada
     3. deliveryDate legado
  
     Isso permite continuar utilizando os projetos antigos
     enquanto evoluímos o modelo.
     ============================================================ */
  
  function obterPrazoDoProjeto(
    projeto: Project
  ) {
  
    return (
      projeto.actualDeliveryDate ||
      projeto.estimatedDeliveryDate ||
      projeto.deliveryDate
    );
  
  }
  
  
  /* ============================================================
     CRIAR ALERTA DE PROJETO
     ============================================================ */
  
  function criarAlertaDoProjeto(
    projeto: Project,
    dataReferencia: Date
  ): AlertaPrazo | null {
  
  
    /* ----------------------------------------------------------
       PROJETOS CONCLUÍDOS NÃO GERAM ALERTA
       ---------------------------------------------------------- */
  
    if (
      projeto.status ===
      'Concluído'
    ) {
  
      return null;
  
    }
  
  
    const prazoOriginal =
      obterPrazoDoProjeto(
        projeto
      );
  
  
    const prazo =
      converterParaData(
        prazoOriginal
      );
  
  
    if (!prazo) {
  
      return null;
  
    }
  
  
    const classificacao =
      classificarPrazo(
        prazo,
        dataReferencia
      );
  
  
    if (
      !classificacao
    ) {
  
      return null;
  
    }
  
  
    return {
  
      id:
        `alert-project-${projeto.id}`,
  
      tipo:
        classificacao.tipo,
  
      nivel:
        'projeto',
  
      projetoId:
        projeto.id,
  
      projetoCodigo:
        projeto.code,
  
      projetoTitulo:
        projeto.title,
  
      titulo:
        classificacao.tipo ===
        'atrasado'
  
          ? 'Projeto atrasado'
  
          : 'Projeto próximo do prazo',
  
      descricao:
        criarDescricaoDoPrazo(
          classificacao.diasRestantes
        ),
  
      responsavel:
        projeto.responsible,
  
      prazo:
        prazoOriginal,
  
      prazoFormatado:
        formatarData(
          prazo
        ),
  
      diasRestantes:
        classificacao.diasRestantes,
  
    };
  
  }
  
  
  /* ============================================================
     CRIAR ALERTA DE TAREFA
     ============================================================ */
  
  function criarAlertaDaTarefa(
    projeto: Project,
    tarefa: ProjectTask,
    dataReferencia: Date
  ): AlertaPrazo | null {
  
  
    /* ----------------------------------------------------------
       TAREFAS CONCLUÍDAS NÃO GERAM ALERTA
       ---------------------------------------------------------- */
  
    if (
      tarefa.status ===
      'Concluído'
    ) {
  
      return null;
  
    }
  
  
    const prazoOriginal =
      tarefa.deliveryDate;
  
  
    const prazo =
      converterParaData(
        prazoOriginal
      );
  
  
    if (
      !prazo ||
      !prazoOriginal
    ) {
  
      return null;
  
    }
  
  
    const classificacao =
      classificarPrazo(
        prazo,
        dataReferencia
      );
  
  
    if (
      !classificacao
    ) {
  
      return null;
  
    }
  
  
    return {
  
      id:
        `alert-task-${projeto.id}-${tarefa.id}`,
  
      tipo:
        classificacao.tipo,
  
      nivel:
        'tarefa',
  
      projetoId:
        projeto.id,
  
      projetoCodigo:
        projeto.code,
  
      projetoTitulo:
        projeto.title,
  
      tarefaId:
        tarefa.id,
  
      tarefaOrdem:
        tarefa.order,
  
      tarefaTitulo:
        tarefa.title,
  
      titulo:
        classificacao.tipo ===
        'atrasado'
  
          ? 'Tarefa atrasada'
  
          : 'Tarefa próxima do prazo',
  
      descricao:
        criarDescricaoDoPrazo(
          classificacao.diasRestantes
        ),
  
      responsavel:
        tarefa.responsible,
  
      prazo:
        prazoOriginal,
  
      prazoFormatado:
        formatarData(
          prazo
        ),
  
      diasRestantes:
        classificacao.diasRestantes,
  
    };
  
  }
  
  
  /* ============================================================
     CRIAR ALERTA DE SUBTAREFA
     ============================================================ */
  
  function criarAlertaDaSubtarefa(
    projeto: Project,
    tarefa: ProjectTask,
    subtarefa: ProjectSubtask,
    dataReferencia: Date
  ): AlertaPrazo | null {
  
  
    /* ----------------------------------------------------------
       SUBTAREFAS CONCLUÍDAS NÃO GERAM ALERTA
       ---------------------------------------------------------- */
  
    if (
      subtarefa.status ===
      'Concluído'
    ) {
  
      return null;
  
    }
  
  
    const prazoOriginal =
      subtarefa.deliveryDate;
  
  
    const prazo =
      converterParaData(
        prazoOriginal
      );
  
  
    if (
      !prazo ||
      !prazoOriginal
    ) {
  
      return null;
  
    }
  
  
    const classificacao =
      classificarPrazo(
        prazo,
        dataReferencia
      );
  
  
    if (
      !classificacao
    ) {
  
      return null;
  
    }
  
  
    return {
  
      id:
        `alert-subtask-${projeto.id}-${tarefa.id}-${subtarefa.id}`,
  
      tipo:
        classificacao.tipo,
  
      nivel:
        'subtarefa',
  
      projetoId:
        projeto.id,
  
      projetoCodigo:
        projeto.code,
  
      projetoTitulo:
        projeto.title,
  
      tarefaId:
        tarefa.id,
  
      tarefaOrdem:
        tarefa.order,
  
      tarefaTitulo:
        tarefa.title,
  
      subtarefaId:
        subtarefa.id,
  
      subtarefaOrdem:
        subtarefa.order,
  
      subtarefaTitulo:
        subtarefa.title,
  
      titulo:
        classificacao.tipo ===
        'atrasado'
  
          ? 'Subtarefa atrasada'
  
          : 'Subtarefa próxima do prazo',
  
      descricao:
        criarDescricaoDoPrazo(
          classificacao.diasRestantes
        ),
  
      responsavel:
        subtarefa.responsible,
  
      prazo:
        prazoOriginal,
  
      prazoFormatado:
        formatarData(
          prazo
        ),
  
      diasRestantes:
        classificacao.diasRestantes,
  
    };
  
  }
  
  
  /* ============================================================
     GERAR ALERTAS
     ============================================================
  
     Esta é a função principal que os componentes utilizarão.
  
     Exemplo:
  
     const alertas =
       gerarAlertasDePrazo(
         projetos
       );
     ============================================================ */
  
  export function gerarAlertasDePrazo(
    projetos: Project[],
    dataReferencia: Date = new Date()
  ): AlertaPrazo[] {
  
    const alertas:
      AlertaPrazo[] = [];
  
  
    projetos.forEach(
      (projeto) => {
  
  
        /* ======================================================
           PROJETO
           ====================================================== */
  
        const alertaProjeto =
          criarAlertaDoProjeto(
            projeto,
            dataReferencia
          );
  
  
        if (
          alertaProjeto
        ) {
  
          alertas.push(
            alertaProjeto
          );
  
        }
  
  
        /* ======================================================
           TAREFAS
           ====================================================== */
  
        (
          projeto.tasks ??
          []
        ).forEach(
          (tarefa) => {
  
  
            const alertaTarefa =
              criarAlertaDaTarefa(
                projeto,
                tarefa,
                dataReferencia
              );
  
  
            if (
              alertaTarefa
            ) {
  
              alertas.push(
                alertaTarefa
              );
  
            }
  
  
            /* ==================================================
               SUBTAREFAS
               ================================================== */
  
            (
              tarefa.subtasks ??
              []
            ).forEach(
              (subtarefa) => {
  
  
                const alertaSubtarefa =
                  criarAlertaDaSubtarefa(
                    projeto,
                    tarefa,
                    subtarefa,
                    dataReferencia
                  );
  
  
                if (
                  alertaSubtarefa
                ) {
  
                  alertas.push(
                    alertaSubtarefa
                  );
  
                }
  
              }
            );
  
          }
        );
  
      }
    );
  
  
    /* ==========================================================
       ORDENAÇÃO
       ==========================================================
  
       Prioridade:
  
       1. Mais atrasados
       2. Vencem hoje
       3. Mais próximos do vencimento
       ========================================================== */
  
    return alertas.sort(
      (
        alertaA,
        alertaB
      ) =>
  
        alertaA.diasRestantes -
        alertaB.diasRestantes
    );
  
  }
  
  
  /* ============================================================
     FILTRAR ATRASADOS
     ============================================================ */
  
  export function obterAlertasAtrasados(
    alertas: AlertaPrazo[]
  ) {
  
    return alertas.filter(
      (alerta) =>
        alerta.tipo ===
        'atrasado'
    );
  
  }
  
  
  /* ============================================================
     FILTRAR PRAZOS PRÓXIMOS
     ============================================================ */
  
  export function obterAlertasDePrazoProximo(
    alertas: AlertaPrazo[]
  ) {
  
    return alertas.filter(
      (alerta) =>
        alerta.tipo ===
        'prazo_proximo'
    );
  
  }
  
  
  /* ============================================================
     CONTADORES
     ============================================================ */
  
  export function obterResumoDosAlertas(
    alertas: AlertaPrazo[]
  ) {
  
    const atrasados =
      alertas.filter(
        (alerta) =>
          alerta.tipo ===
          'atrasado'
      ).length;
  
  
    const prazosProximos =
      alertas.filter(
        (alerta) =>
          alerta.tipo ===
          'prazo_proximo'
      ).length;
  
  
    return {
  
      total:
        alertas.length,
  
      atrasados,
  
      prazosProximos,
  
    };
  
  }