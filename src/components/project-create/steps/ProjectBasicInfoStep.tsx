import {
  CalendarDays,
  FileText,
  Layers3,
  Tag,
  Type,
  User,
  Users,
} from 'lucide-react';


/* ============================================================
   TIPO DOS DADOS DA ETAPA
   ============================================================ */

export interface InformacoesBasicasProjeto {
  nome: string;

  descricao: string;

  origem: string;

  nivel: string;

  projetoPai: string;

  dataCriacao: string;

  /* ----------------------------------------------------------
     GERENTE DO PROJETO
     ---------------------------------------------------------- */

  gerenteUsuario: string;

  gerenteGrupo: string;

  /* ----------------------------------------------------------
     PLANEJAMENTO
     ---------------------------------------------------------- */

  entregaEstimada: string;

  dataInicio: string;

  dataEntrega: string;
}


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface ProjectBasicInfoStepProps {

  dados: InformacoesBasicasProjeto;

  aoAlterar: (
    novosDados: InformacoesBasicasProjeto
  ) => void;
}


/* ============================================================
   CLASSES PADRÃO
   ============================================================ */

const classeLabel =
  'mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-600';

const classeCampo =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-institution-500 focus:ring-2 focus:ring-institution-100';

const classeCampoBloqueado =
  'w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500';


/* ============================================================
   COMPONENTE
   ============================================================ */

export default function ProjectBasicInfoStep({
  dados,
  aoAlterar,
}: ProjectBasicInfoStepProps) {


  /* ==========================================================
     ATUALIZAR CAMPO
     ========================================================== */

  function atualizarCampo(
    campo: keyof InformacoesBasicasProjeto,
    valor: string
  ) {

    aoAlterar({
      ...dados,
      [campo]: valor,
    });

  }


  return (

    <div className="space-y-6">


      {/* ======================================================
          CABEÇALHO
          ====================================================== */}

      <div>

        <h2
          className="
            text-lg
            font-semibold
            text-gray-800
          "
        >
          Informações do Projeto
        </h2>


        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          Informe os dados principais para identificação,
          classificação e planejamento do projeto.
        </p>

      </div>


      {/* ======================================================
          CARD: IDENTIFICAÇÃO
          ====================================================== */}

      <section
        className="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
        "
      >

        <div
          className="
            mb-5
            flex
            items-center
            gap-2
          "
        >

          <FileText
            className="
              h-5
              w-5
              text-institution-600
            "
          />


          <div>

            <h3
              className="
                text-sm
                font-semibold
                text-gray-800
              "
            >
              Identificação
            </h3>


            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Informações principais do projeto.
            </p>

          </div>

        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-2
          "
        >


          {/* ==================================================
              IDENTIFICADOR
              ================================================== */}

          <div>

            <label className={classeLabel}>
              Identificador
            </label>


            <input
              disabled

              value="Gerado automaticamente após criar o projeto"

              className={classeCampoBloqueado}
            />

          </div>


          {/* ==================================================
              ORIGEM
              ================================================== */}

          <div>

            <label className={classeLabel}>

              <Tag className="h-3.5 w-3.5" />

              Origem

            </label>


            <select
              value={
                dados.origem
              }

              onChange={(evento) =>
                atualizarCampo(
                  'origem',
                  evento.target.value
                )
              }

              className={classeCampo}
            >

              <option value="">
                Selecione a origem
              </option>

              <option value="demanda">
                Demanda
              </option>

              <option value="melhoria">
                Melhoria
              </option>

              <option value="manutencao">
                Manutenção
              </option>

              <option value="reparo">
                Reparo
              </option>

              <option value="pdtic">
                PDTIC
              </option>

              <option value="ptd">
                PTD
              </option>

              <option value="abep">
                ABEP
              </option>

            </select>

          </div>


          {/* ==================================================
              NOME
              ================================================== */}

          <div className="lg:col-span-2">

            <label className={classeLabel}>

              <Type className="h-3.5 w-3.5" />

              Nome do projeto *

            </label>


            <input
              value={
                dados.nome
              }

              onChange={(evento) =>
                atualizarCampo(
                  'nome',
                  evento.target.value
                )
              }

              placeholder="Digite o nome do projeto"

              className={classeCampo}
            />

          </div>


          {/* ==================================================
              DESCRIÇÃO
              ================================================== */}

          <div className="lg:col-span-2">

            <label className={classeLabel}>
              Descrição
            </label>


            <textarea
              value={
                dados.descricao
              }

              onChange={(evento) =>
                atualizarCampo(
                  'descricao',
                  evento.target.value
                )
              }

              rows={5}

              placeholder="Descreva o objetivo, escopo e finalidade do projeto"

              className={`
                ${classeCampo}
                resize-none
              `}
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          CARD: CLASSIFICAÇÃO
          ====================================================== */}

      <section
        className="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
        "
      >

        <div
          className="
            mb-5
            flex
            items-center
            gap-2
          "
        >

          <Layers3
            className="
              h-5
              w-5
              text-institution-600
            "
          />


          <div>

            <h3
              className="
                text-sm
                font-semibold
                text-gray-800
              "
            >
              Classificação
            </h3>


            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Defina o nível, relacionamento e data de criação.
            </p>

          </div>

        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-2
          "
        >


          {/* ==================================================
              NÍVEL
              ================================================== */}

          <div>

            <label className={classeLabel}>
              Nível
            </label>


            <select
              value={
                dados.nivel
              }

              onChange={(evento) =>
                atualizarCampo(
                  'nivel',
                  evento.target.value
                )
              }

              className={classeCampo}
            >

              <option value="">
                Selecione o nível
              </option>

              <option value="baixo">
                Baixo
              </option>

              <option value="medio">
                Médio
              </option>

              <option value="alto">
                Alto
              </option>

              <option value="estrategico">
                Estratégico
              </option>

            </select>

          </div>


          {/* ==================================================
              DATA DE CRIAÇÃO
              ================================================== */}

          <div>

            <label className={classeLabel}>

              <CalendarDays className="h-3.5 w-3.5" />

              Data de criação

            </label>


            <input
              type="date"

              value={
                dados.dataCriacao
              }

              readOnly

              tabIndex={-1}

              className={classeCampoBloqueado}
            />


            <p
              className="
                mt-1.5
                text-[11px]
                text-gray-400
              "
            >
              Definida automaticamente pelo sistema.
            </p>

          </div>


          {/* ==================================================
              PROJETO PAI
              ================================================== */}

          <div className="lg:col-span-2">

            <label className={classeLabel}>
              Projeto pai
            </label>


            <select
              value={
                dados.projetoPai
              }

              onChange={(evento) =>
                atualizarCampo(
                  'projetoPai',
                  evento.target.value
                )
              }

              className={classeCampo}
            >

              <option value="">
                Nenhum — projeto raiz
              </option>

              <option value="proj-01">
                PROJ-01 — Modernização da Infraestrutura
              </option>

              <option value="proj-02">
                PROJ-02 — Renovação do Parque de TI
              </option>

            </select>

          </div>

        </div>

      </section>


      {/* ======================================================
          CARD: GERENTE DO PROJETO
          ====================================================== */}

      <section
        className="
          rounded-xl
          border
          border-gray-200
          border-l-4
          border-l-green-500
          bg-white
          p-6
          shadow-sm
        "
      >

        <div
          className="
            mb-5
            flex
            items-center
            gap-2
          "
        >

          <User
            className="
              h-5
              w-5
              text-green-600
            "
          />


          <div>

            <h3
              className="
                text-sm
                font-semibold
                text-gray-800
              "
            >
              Gerente do Projeto
            </h3>


            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Defina o responsável principal e o grupo vinculado ao projeto.
            </p>

          </div>

        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >


          {/* ==================================================
              USUÁRIO
              ================================================== */}

          <div>

            <label className={classeLabel}>

              <User className="h-3.5 w-3.5" />

              Usuário

            </label>


            <select
              value={
                dados.gerenteUsuario
              }

              onChange={(evento) =>
                atualizarCampo(
                  'gerenteUsuario',
                  evento.target.value
                )
              }

              className={classeCampo}
            >

              <option value="">
                Selecione o usuário
              </option>

              <option value="João Silva">
                João Silva
              </option>

              <option value="Maria Souza">
                Maria Souza
              </option>

              <option value="Carlos Lima">
                Carlos Lima
              </option>

              <option value="Ana Costa">
                Ana Costa
              </option>

              <option value="Fernanda Costa">
                Fernanda Costa
              </option>

              <option value="Rafael Oliveira">
                Rafael Oliveira
              </option>

            </select>

          </div>


          {/* ==================================================
              GRUPO
              ================================================== */}

          <div>

            <label className={classeLabel}>

              <Users className="h-3.5 w-3.5" />

              Grupo

            </label>


            <select
              value={
                dados.gerenteGrupo
              }

              onChange={(evento) =>
                atualizarCampo(
                  'gerenteGrupo',
                  evento.target.value
                )
              }

              className={classeCampo}
            >

              <option value="">
                Selecione o grupo
              </option>

              <option value="infraestrutura">
                Infraestrutura e Serviços
              </option>

              <option value="desenvolvimento">
                Desenvolvimento de Sistemas
              </option>

              <option value="governanca">
                Governança e Planejamento
              </option>

              <option value="seguranca">
                Segurança da Informação
              </option>

              <option value="dados">
                Dados e Automação
              </option>

            </select>

          </div>

        </div>

      </section>


      {/* ======================================================
          CARD: PLANEJAMENTO
          ====================================================== */}

      <section
        className="
          rounded-xl
          border
          border-gray-200
          border-l-4
          border-l-amber-400
          bg-white
          p-6
          shadow-sm
        "
      >

        <div
          className="
            mb-5
            flex
            items-center
            gap-2
          "
        >

          <CalendarDays
            className="
              h-5
              w-5
              text-amber-500
            "
          />


          <div>

            <h3
              className="
                text-sm
                font-semibold
                text-gray-800
              "
            >
              Planejamento
            </h3>


            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Defina as datas previstas para execução e entrega do projeto.
            </p>

          </div>

        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-3
          "
        >


          {/* ==================================================
              ENTREGA ESTIMADA
              ================================================== */}

          <div>

            <label className={classeLabel}>

              <CalendarDays className="h-3.5 w-3.5" />

              Entrega estimada

            </label>


            <input
              type="date"

              value={
                dados.entregaEstimada
              }

              onChange={(evento) =>
                atualizarCampo(
                  'entregaEstimada',
                  evento.target.value
                )
              }

              className={classeCampo}
            />

          </div>


          {/* ==================================================
              DATA DE INÍCIO
              ================================================== */}

          <div>

            <label className={classeLabel}>

              <CalendarDays className="h-3.5 w-3.5" />

              Data de início

            </label>


            <input
              type="date"

              value={
                dados.dataInicio
              }

              onChange={(evento) =>
                atualizarCampo(
                  'dataInicio',
                  evento.target.value
                )
              }

              className={classeCampo}
            />

          </div>


          {/* ==================================================
              DATA DE ENTREGA
              ================================================== */}

          <div>

            <label className={classeLabel}>

              <CalendarDays className="h-3.5 w-3.5" />

              Data de entrega

            </label>


            <input
              type="date"

              value={
                dados.dataEntrega
              }

              onChange={(evento) =>
                atualizarCampo(
                  'dataEntrega',
                  evento.target.value
                )
              }

              className={classeCampo}
            />

          </div>

        </div>

      </section>

    </div>

  );
}