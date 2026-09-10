import type {
    Project,
    ProjectTask,
    ProjectSubtask,
  } from '@/data/projects';
  
  
  /* ============================================================
     PROGRESSO DA SUBTAREFA
     ============================================================ */
  
  export function calcularProgressoDaSubtarefa(
    subtarefa: ProjectSubtask
  ) {
  
    if (
      subtarefa.status ===
      'Concluído'
    ) {
  
      return 100;
  
    }
  
  
    if (
      subtarefa.status ===
      'Não iniciado'
    ) {
  
      return 0;
  
    }
  
  
    return Math.min(
      Math.max(
        subtarefa.progress ?? 0,
        0
      ),
      100
    );
  
  }
  
  
  /* ============================================================
     PROGRESSO DA TAREFA
     ============================================================
  
     Regra:
  
     - se a tarefa possuir subtarefas, o progresso da tarefa
       será calculado com base nelas;
  
     - se não possuir subtarefas, usamos o progresso da própria
       tarefa;
  
     - tarefa concluída sempre retorna 100%.
     ============================================================ */
  
  export function calcularProgressoDaTarefa(
    tarefa: ProjectTask
  ) {
  
    if (
      tarefa.status ===
      'Concluído'
    ) {
  
      return 100;
  
    }
  
  
    const subtarefas =
      tarefa.subtasks ?? [];
  
  
    if (
      subtarefas.length === 0
    ) {
  
      if (
        tarefa.status ===
        'Não iniciado'
      ) {
  
        return 0;
  
      }
  
  
      return Math.min(
        Math.max(
          tarefa.progress ?? 0,
          0
        ),
        100
      );
  
    }
  
  
    const somaDosProgressos =
      subtarefas.reduce(
        (
          total,
          subtarefa
        ) => {
  
          return (
            total +
            calcularProgressoDaSubtarefa(
              subtarefa
            )
          );
  
        },
        0
      );
  
  
    return Math.round(
      somaDosProgressos /
      subtarefas.length
    );
  
  }
  
  
  /* ============================================================
     PROGRESSO DO PROJETO
     ============================================================
  
     O progresso geral do projeto é calculado a partir
     das tarefas.
  
     Portanto:
  
     subtarefas
          ↓
     tarefas
          ↓
     projeto
     ============================================================ */
  
  export function calcularProgressoDoProjeto(
    projeto: Project
  ) {
  
    const tarefas =
      projeto.tasks ?? [];
  
  
    if (
      tarefas.length === 0
    ) {
  
      return Math.min(
        Math.max(
          projeto.progress ?? 0,
          0
        ),
        100
      );
  
    }
  
  
    const somaDosProgressos =
      tarefas.reduce(
        (
          total,
          tarefa
        ) => {
  
          return (
            total +
            calcularProgressoDaTarefa(
              tarefa
            )
          );
  
        },
        0
      );
  
  
    return Math.round(
      somaDosProgressos /
      tarefas.length
    );
  
  }
  
  
  /* ============================================================
     VERIFICAR SE TODAS AS SUBTAREFAS ESTÃO CONCLUÍDAS
     ============================================================ */
  
  function subtarefasEstaoConcluidas(
    tarefa: ProjectTask
  ) {
  
    const subtarefas =
      tarefa.subtasks ?? [];
  
  
    if (
      subtarefas.length === 0
    ) {
  
      return true;
  
    }
  
  
    return subtarefas.every(
      (subtarefa) =>
        subtarefa.status ===
        'Concluído'
    );
  
  }
  
  
  /* ============================================================
     VERIFICAR SE TODAS AS TAREFAS ESTÃO CONCLUÍDAS
     ============================================================ */
  
  export function projetoEstaTotalmenteConcluido(
    projeto: Project
  ) {
  
    const tarefas =
      projeto.tasks ?? [];
  
  
    if (
      tarefas.length === 0
    ) {
  
      return false;
  
    }
  
  
    return tarefas.every(
      (tarefa) => {
  
        return (
          tarefa.status ===
            'Concluído' &&
  
          subtarefasEstaoConcluidas(
            tarefa
          )
        );
  
      }
    );
  
  }
  
  
  /* ============================================================
     SINCRONIZAR EXECUÇÃO DO PROJETO
     ============================================================
  
     Essa função recalcula:
  
     - progresso das tarefas;
     - progresso geral do projeto;
     - status final do projeto.
  
     Ela será utilizada pelo App.tsx para que toda alteração
     realizada no projeto passe por uma única regra.
     ============================================================ */
  
  export function sincronizarExecucaoDoProjeto(
    projeto: Project
  ): Project {
  
    const tarefasAtualizadas =
      (
        projeto.tasks ??
        []
      ).map(
        (tarefa) => {
  
          const progresso =
            calcularProgressoDaTarefa(
              tarefa
            );
  
  
          return {
  
            ...tarefa,
  
            progress:
              progresso,
  
          };
  
        }
      );
  
  
    const projetoComTarefasAtualizadas:
      Project = {
  
      ...projeto,
  
      tasks:
        tarefasAtualizadas,
  
    };
  
  
    const progressoDoProjeto =
      calcularProgressoDoProjeto(
        projetoComTarefasAtualizadas
      );
  
  
    const concluido =
      projetoEstaTotalmenteConcluido(
        projetoComTarefasAtualizadas
      );
  
  
    return {
  
      ...projetoComTarefasAtualizadas,
  
      progress:
        concluido
          ? 100
          : progressoDoProjeto,
  
      status:
        concluido
          ? 'Concluído'
          : projeto.status,
  
    };
  
  }