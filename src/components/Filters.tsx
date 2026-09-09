import { useState } from 'react';
import {
  BarChart3,
  Download,
  RotateCcw,
  Filter,
} from 'lucide-react';


/* ============================================================
   TIPOS DOS FILTROS
   ============================================================

   Aqui definimos quais informações serão enviadas para o App.tsx
   quando o usuário clicar no botão "Filtrar".
   ============================================================ */

export interface DadosDosFiltros {
  projeto: string;
  eixo: string;
  etapa: string;
  status: string;
  nomeAcao: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
}


/* ============================================================
   PROPRIEDADES RECEBIDAS PELO COMPONENTE
   ============================================================ */

interface FiltrosProps {

  // Função executada quando o usuário clicar em "Filtrar"
  aoFiltrar?: (filtros: DadosDosFiltros) => void;

  // Função executada quando o usuário clicar em "Limpar"
  aoLimpar?: () => void;
}


/* ============================================================
   VALORES PADRÃO DOS FILTROS
   ============================================================

   Centralizamos os valores iniciais aqui para facilitar futuras
   alterações.
   ============================================================ */

const FILTRO_TODOS_PROJETOS = 'Todos os projetos';
const FILTRO_TODOS_EIXOS = 'Todos os eixos';
const FILTRO_TODAS_ETAPAS = 'Todas as etapas';
const FILTRO_TODOS_STATUS = 'Todos os status';


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function Filters({
  aoFiltrar,
  aoLimpar,
}: FiltrosProps) {


  /* ==========================================================
     ESTADOS DOS FILTROS DE PROJETOS
     ========================================================== */

  const [projetoSelecionado, setProjetoSelecionado] =
    useState(FILTRO_TODOS_PROJETOS);

  const [eixoSelecionado, setEixoSelecionado] =
    useState(FILTRO_TODOS_EIXOS);

  const [etapaSelecionada, setEtapaSelecionada] =
    useState(FILTRO_TODAS_ETAPAS);

  const [statusSelecionado, setStatusSelecionado] =
    useState(FILTRO_TODOS_STATUS);


  /* ==========================================================
     ESTADOS DOS FILTROS DE AÇÕES
     ========================================================== */

  const [nomeDaAcao, setNomeDaAcao] = useState('');

  const [responsavel, setResponsavel] = useState('');

  const [dataInicio, setDataInicio] = useState('');

  const [dataFim, setDataFim] = useState('');


  /* ==========================================================
     FUNÇÃO: FILTRAR
     ==========================================================

     Monta um objeto com todos os filtros preenchidos e envia
     essas informações para o componente App.tsx.
     ========================================================== */

  function aplicarFiltros() {

    const filtros: DadosDosFiltros = {
      projeto: projetoSelecionado,
      eixo: eixoSelecionado,
      etapa: etapaSelecionada,
      status: statusSelecionado,
      nomeAcao: nomeDaAcao,
      responsavel: responsavel,
      dataInicio: dataInicio,
      dataFim: dataFim,
    };

    // Envia os filtros para o componente pai
    aoFiltrar?.(filtros);
  }


  /* ==========================================================
     FUNÇÃO: LIMPAR FILTROS
     ========================================================== */

  function limparFiltros() {

    // Volta os selects para as opções iniciais
    setProjetoSelecionado(FILTRO_TODOS_PROJETOS);
    setEixoSelecionado(FILTRO_TODOS_EIXOS);
    setEtapaSelecionada(FILTRO_TODAS_ETAPAS);
    setStatusSelecionado(FILTRO_TODOS_STATUS);

    // Limpa os campos de texto
    setNomeDaAcao('');
    setResponsavel('');
    setDataInicio('');
    setDataFim('');

    // Avisa o App.tsx que os filtros foram limpos
    aoLimpar?.();
  }


  /* ==========================================================
     CLASSES VISUAIS
     ============================================================

     Essas constantes evitam repetir as mesmas classes Tailwind
     várias vezes no código.
     ========================================================== */

  const classeCampo =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:border-institution-500 focus:outline-none focus:ring-2 focus:ring-institution-100';

  const classeLabel =
    'mb-1.5 block text-xs font-semibold text-gray-600';

  const classeTituloSecao =
    'text-base font-semibold text-gray-800';


  return (

    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">


      {/* ======================================================
          FILTROS DE PROJETOS
          ====================================================== */}

      <h2 className={classeTituloSecao}>
        Filtros de Projetos
      </h2>


      <div
        className="
          mt-4
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >


        {/* ----------------------------------------------------
            FILTRO: PROJETO
            ---------------------------------------------------- */}

        <div>

          <label className={classeLabel}>
            Projeto
          </label>

          <select
            value={projetoSelecionado}
            onChange={(evento) =>
              setProjetoSelecionado(evento.target.value)
            }
            className={classeCampo}
          >

            <option>Todos os projetos</option>
            <option>PROJ-01</option>
            <option>PROJ-02</option>
            <option>PROJ-03</option>
            <option>PROJ-04</option>
            <option>PROJ-05</option>
            <option>PROJ-06</option>
            <option>PROJ-07</option>

          </select>

        </div>


        {/* ----------------------------------------------------
            FILTRO: EIXO
            ---------------------------------------------------- */}

        <div>

          <label className={classeLabel}>
            Eixo
          </label>

          <select
            value={eixoSelecionado}
            onChange={(evento) =>
              setEixoSelecionado(evento.target.value)
            }
            className={classeCampo}
          >

            <option>Todos os eixos</option>
            <option>Administração e Finanças</option>
            <option>Gestão de Dados e Automação</option>
            <option>Planejamento Estratégico e Governança</option>
            <option>Infraestrutura e Serviços</option>
            <option>Soluções Digitais</option>
            <option>Segurança da Informação</option>

          </select>

        </div>


        {/* ----------------------------------------------------
            FILTRO: ETAPA
            ---------------------------------------------------- */}

        <div>

          <label className={classeLabel}>
            Etapa
          </label>

          <select
            value={etapaSelecionada}
            onChange={(evento) =>
              setEtapaSelecionada(evento.target.value)
            }
            className={classeCampo}
          >

            <option>Todas as etapas</option>
            <option>Planejamento</option>
            <option>Execução</option>
            <option>Monitoramento</option>
            <option>Encerramento</option>

          </select>

        </div>


        {/* ----------------------------------------------------
            FILTRO: STATUS
            ---------------------------------------------------- */}

        <div>

          <label className={classeLabel}>
            Status
          </label>

          <select
            value={statusSelecionado}
            onChange={(evento) =>
              setStatusSelecionado(evento.target.value)
            }
            className={classeCampo}
          >

<option>Todos os status</option>
<option>Concluído</option>
<option>Em andamento</option>
<option>Atrasado</option>
<option>Pausado</option>

          </select>

        </div>

      </div>


      {/* ======================================================
          SEPARADOR
          ====================================================== */}

      <div className="mb-4 mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
      </div>


      {/* ======================================================
          FILTROS DE AÇÕES
          ====================================================== */}

      <h2 className={classeTituloSecao}>
        Filtros de Ações
      </h2>


      <div
        className="
          mt-4
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >


        {/* ----------------------------------------------------
            NOME DA AÇÃO
            ---------------------------------------------------- */}

        <div>

          <label className={classeLabel}>
            Nome da Ação
          </label>

          <input
            type="text"
            value={nomeDaAcao}
            onChange={(evento) =>
              setNomeDaAcao(evento.target.value)
            }
            placeholder="Buscar por nome da ação..."
            className={classeCampo}
          />

        </div>


        {/* ----------------------------------------------------
            RESPONSÁVEL
            ---------------------------------------------------- */}

        <div>

          <label className={classeLabel}>
            Responsável
          </label>

          <input
            type="text"
            value={responsavel}
            onChange={(evento) =>
              setResponsavel(evento.target.value)
            }
            placeholder="Filtrar por responsável..."
            className={classeCampo}
          />

        </div>


        {/* ----------------------------------------------------
            DATA DE INÍCIO
            ---------------------------------------------------- */}

        <div>

          <label className={classeLabel}>
            Data início
          </label>

          <input
            type="text"
            value={dataInicio}
            onChange={(evento) =>
              setDataInicio(evento.target.value)
            }
            placeholder="dd/mm/aaaa"
            className={classeCampo}
          />

        </div>


        {/* ----------------------------------------------------
            DATA FINAL
            ---------------------------------------------------- */}

        <div>

          <label className={classeLabel}>
            Data fim
          </label>

          <input
            type="text"
            value={dataFim}
            onChange={(evento) =>
              setDataFim(evento.target.value)
            }
            placeholder="dd/mm/aaaa"
            className={classeCampo}
          />

        </div>

      </div>


      {/* ======================================================
          BOTÕES
          ====================================================== */}

      <div
        className="
          mt-8
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >


        {/* ----------------------------------------------------
            BOTÃO: VISÃO GRÁFICA
            ---------------------------------------------------- */}

        <button
          className="
            flex
            items-center
            justify-center
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

          <BarChart3 className="h-4 w-4" />

          Visão Gráfica

        </button>


        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
          "
        >


          {/* --------------------------------------------------
              BOTÃO: LIMPAR
              -------------------------------------------------- */}

          <button
            onClick={limparFiltros}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-gray-300
              bg-gray-100
              px-4
              py-2.5
              text-sm
              font-medium
              text-gray-700
              transition-colors
              hover:bg-gray-200
            "
          >

            <RotateCcw className="h-4 w-4" />

            Limpar

          </button>


          {/* --------------------------------------------------
              BOTÃO: EXPORTAR CSV
              -------------------------------------------------- */}

          <button
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-green-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-green-700
            "
          >

            <Download className="h-4 w-4" />

            Exportar CSV

          </button>


          {/* --------------------------------------------------
              BOTÃO: FILTRAR
              -------------------------------------------------- */}

          <button
            onClick={aplicarFiltros}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-institution-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-institution-700
            "
          >

            <Filter className="h-4 w-4" />

            Filtrar

          </button>

        </div>

      </div>

    </div>
  );
}