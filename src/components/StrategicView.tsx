import { useState } from 'react';
import {
  Plus,
  Minus,
  BarChart2,
  FolderKanban,
} from 'lucide-react';

import type { StrategicAxis } from '@/data/projects';


/* ============================================================
   TIPAGEM DAS PROPRIEDADES DO COMPONENTE
   ============================================================

   Este componente recebe a lista de eixos estratégicos
   que está cadastrada no arquivo:

   src/data/projects.ts
   ============================================================ */

interface StrategicViewProps {
  axes: StrategicAxis[];
}


/* ============================================================
   CORES DOS STATUS
   ============================================================

   Define a cor da bolinha exibida ao lado do status
   de cada projeto.
   ============================================================ */

const corDoStatus: Record<string, string> = {
  Ativo: 'bg-green-500',
  Paralisado: 'bg-gray-400',
  Concluído: 'bg-blue-500',
};


/* ============================================================
   COR DA BARRA DE PROGRESSO
   ============================================================

   Retorna uma cor de acordo com o status e o progresso
   do projeto.
   ============================================================ */

function definirCorDoProgresso(
  progresso: number,
  status: string
) {
  // Projeto concluído
  if (status === 'Concluído') {
    return 'bg-green-500';
  }

  // Projeto paralisado
  if (status === 'Paralisado') {
    return 'bg-gray-400';
  }

  // Projeto com menos de 50% de progresso
  if (progresso < 50) {
    return 'bg-amber-500';
  }

  // Demais projetos
  return 'bg-institution-600';
}


/* ============================================================
   COMPONENTE: LINHA DO EIXO ESTRATÉGICO
   ============================================================

   Cada eixo estratégico da lista é representado por este
   componente.

   Exemplo:

   1  Administração e Finanças
      PAF
      3 projetos
      Ver indicadores
      [+]

   Ao clicar no botão [+], os projetos daquele eixo aparecem.
   ============================================================ */

function LinhaDoEixo({
  eixo,
  indice,
}: {
  eixo: StrategicAxis;
  indice: number;
}) {

  /* ----------------------------------------------------------
     CONTROLE DE EXPANSÃO

     false = projetos escondidos
     true  = projetos exibidos
     ---------------------------------------------------------- */

  const [estaExpandido, setEstaExpandido] = useState(false);


  /* ----------------------------------------------------------
     FUNÇÃO PARA ABRIR / FECHAR O EIXO
     ---------------------------------------------------------- */

  function alternarExpansao() {
    setEstaExpandido((estadoAtual) => !estadoAtual);
  }


  return (
    <div
      className="
        animate-fade-in-up
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-card
        transition-[border-color,box-shadow]
        hover:border-institution-200
        hover:shadow-card-hover
      "
      style={{
        animationDelay: `${indice * 60}ms`,
      }}
    >

      {/* ======================================================
          CABEÇALHO DO EIXO
          ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          p-5
          lg:flex-row
          lg:items-center
          lg:gap-6
        "
      >

        {/* ----------------------------------------------------
            NÚMERO DO EIXO
            ---------------------------------------------------- */}

        <div className="flex-shrink-0">

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-institution-200
              bg-institution-50
              text-sm
              font-bold
              text-institution-700
            "
          >
            {eixo.number}
          </div>

        </div>


        {/* ----------------------------------------------------
            NOME E SIGLA DO EIXO
            ---------------------------------------------------- */}

        <div className="min-w-0 flex-1">

          <h3
            className="
              text-sm
              font-semibold
              leading-snug
              text-gray-800
            "
          >
            {eixo.name}
          </h3>

          <p className="mt-0.5 text-xs text-gray-400">
            Sigla:{' '}

            <span className="font-semibold text-gray-600">
              {eixo.acronym}
            </span>
          </p>

        </div>


        {/* ----------------------------------------------------
            QUANTIDADE DE PROJETOS DO EIXO
            ---------------------------------------------------- */}

        <div className="flex-shrink-0 lg:w-32">

          <div className="flex items-center gap-2">

            <FolderKanban
              className="
                h-4
                w-4
                flex-shrink-0
                text-gray-400
              "
            />

            <div>

              <p className="text-sm font-bold text-gray-700">
                {eixo.projectCount}
              </p>

              <p className="text-[11px] text-gray-400">
                projetos
              </p>

            </div>

          </div>

        </div>


        {/* ----------------------------------------------------
            BOTÃO VER INDICADORES
            ---------------------------------------------------- */}

        <div className="flex-shrink-0 lg:w-36">

          <button
            className="
              flex
              items-center
              gap-1.5
              whitespace-nowrap
              text-sm
              font-medium
              text-institution-600
              transition-colors
              hover:text-institution-800
            "
          >
            <BarChart2 className="h-4 w-4" />

            Ver indicadores
          </button>

        </div>


        {/* ----------------------------------------------------
            BOTÃO EXPANDIR / RECOLHER
            ---------------------------------------------------- */}

        <div className="flex-shrink-0 lg:ml-auto">

          <button
            onClick={alternarExpansao}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              border
              border-gray-200
              text-gray-500
              transition-colors
              hover:border-institution-200
              hover:bg-institution-50
              hover:text-institution-600
            "
            title={
              estaExpandido
                ? 'Recolher'
                : 'Expandir'
            }
          >

            {estaExpandido ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}

          </button>

        </div>

      </div>


      {/* ======================================================
          PROJETOS DO EIXO

          Esta parte somente aparece quando o eixo estiver
          expandido.
          ====================================================== */}

      {estaExpandido && (

        <div
          className="
            border-t
            border-gray-100
            px-5
            py-4
          "
        >

          {/* Verifica se existem projetos no eixo */}

          {eixo.projects.length > 0 ? (

            <div className="space-y-2.5">

              {/* Percorre todos os projetos do eixo */}

              {eixo.projects.map((projeto) => (

                <div
                  key={projeto.code}
                  className="
                    flex
                    flex-col
                    gap-3
                    rounded-lg
                    bg-gray-50/80
                    p-3
                    sm:flex-row
                    sm:items-center
                    sm:gap-4
                  "
                >

                  {/* ------------------------------------------
                      CÓDIGO E NOME DO PROJETO
                      ------------------------------------------ */}

                  <div className="min-w-0 flex-1">

                    <p
                      className="
                        text-sm
                        font-medium
                        text-gray-700
                      "
                    >

                      <span
                        className="
                          font-semibold
                          text-institution-700
                        "
                      >
                        {projeto.code}
                      </span>

                      {' — '}

                      {projeto.title}

                    </p>

                  </div>


                  {/* ------------------------------------------
                      STATUS DO PROJETO
                      ------------------------------------------ */}

                  <div className="flex-shrink-0 sm:w-24">

                    <div className="flex items-center gap-1.5">

                      {/* Bolinha colorida */}

                      <span
                        className={`
                          h-2
                          w-2
                          flex-shrink-0
                          rounded-full
                          ${corDoStatus[projeto.status]}
                        `}
                      />

                      {/* Nome do status */}

                      <span
                        className="
                          text-xs
                          font-medium
                          text-gray-600
                        "
                      >
                        {projeto.status}
                      </span>

                    </div>

                  </div>


                  {/* ------------------------------------------
                      PROGRESSO DO PROJETO
                      ------------------------------------------ */}

                  <div className="flex-shrink-0 sm:w-32">

                    <div
                      className="
                        mb-1
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <span className="text-[10px] text-gray-400">
                        Progresso
                      </span>

                      <span
                        className="
                          text-[10px]
                          font-bold
                          text-gray-600
                        "
                      >
                        {projeto.progress}%
                      </span>

                    </div>


                    {/* Barra de fundo */}

                    <div
                      className="
                        h-1
                        w-full
                        overflow-hidden
                        rounded-full
                        bg-gray-200
                      "
                    >

                      {/* Barra de progresso */}

                      <div
                        className={`
                          h-full
                          rounded-full
                          ${definirCorDoProgresso(
                            projeto.progress,
                            projeto.status
                          )}
                        `}
                        style={{
                          width: `${projeto.progress}%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* ------------------------------------------
                      RESPONSÁVEL PELO PROJETO
                      ------------------------------------------ */}

                  <div className="flex-shrink-0 sm:w-28">

                    <p className="text-[10px] text-gray-400">
                      Responsável
                    </p>

                    <p
                      className="
                        text-xs
                        font-medium
                        text-gray-600
                      "
                    >
                      {projeto.responsible}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            /* Caso o eixo não possua projetos */

            <p
              className="
                py-4
                text-center
                text-sm
                text-gray-400
              "
            >
              Nenhum projeto vinculado a este eixo.
            </p>

          )}

        </div>

      )}

    </div>
  );
}


/* ============================================================
   COMPONENTE PRINCIPAL: PLANEJAMENTO ESTRATÉGICO
   ============================================================ */

export default function StrategicView({
  axes: eixos,
}: StrategicViewProps) {


  /* ==========================================================
     CÁLCULOS AUTOMÁTICOS
     ========================================================== */


  /* ----------------------------------------------------------
     TOTAL DE EIXOS

     Conta automaticamente quantos eixos existem.
     ---------------------------------------------------------- */

  const totalDeEixos = eixos.length;


  /* ----------------------------------------------------------
     TOTAL DE PROJETOS

     Soma a quantidade de projetos de todos os eixos.

     Exemplo:

     3 + 7 + 8 + 6 + 8 + 0 = 32
     ---------------------------------------------------------- */

  const totalDeProjetos = eixos.reduce(
    (total, eixo) => total + eixo.projectCount,
    0
  );


  return (

    <section>


      {/* ======================================================
          CABEÇALHO DA SEÇÃO
          ====================================================== */}

      <div
        className="
          mb-4
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
        "
      >

        {/* Título */}

        <div className="flex items-center gap-3">

          <h2
            className="
              text-lg
              font-semibold
              text-gray-800
            "
          >
            Planejamento Estratégico
          </h2>

        </div>


        {/* ----------------------------------------------------
            SELETOR DE PLANO
            ---------------------------------------------------- */}

        <div className="flex items-center gap-2">

          <label className="text-sm text-gray-500">
            Plano:
          </label>

          <select
            className="
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2
              text-sm
              text-gray-700
              transition-colors
              hover:border-gray-400
              focus:border-institution-500
              focus:outline-none
              focus:ring-2
              focus:ring-institution-100
            "
          >

            <option>
              Plano Diretor de Tecnologia da Informação
            </option>

            <option>
              Plano de Gestão Administrativa
            </option>

            <option>
              Plano de Modernização Institucional
            </option>

          </select>

        </div>

      </div>


      {/* ======================================================
          RESUMO DO PLANEJAMENTO

          Estes números agora são calculados automaticamente.
          ====================================================== */}

      <div
        className="
          mb-4
          flex
          items-center
          gap-4
          rounded-lg
          bg-institution-50/60
          px-4
          py-3
        "
      >


        {/* ----------------------------------------------------
            TOTAL DE EIXOS
            ---------------------------------------------------- */}

        <div className="flex items-center gap-2">

          <span
            className="
              text-xl
              font-bold
              text-institution-700
            "
          >
            {totalDeEixos}
          </span>

          <span className="text-sm text-gray-600">
            Eixos
          </span>

        </div>


        {/* Separador */}

        <div className="h-4 w-px bg-institution-200" />


        {/* ----------------------------------------------------
            TOTAL DE PROJETOS
            ---------------------------------------------------- */}

        <div className="flex items-center gap-2">

          <span
            className="
              text-xl
              font-bold
              text-institution-700
            "
          >
            {totalDeProjetos}
          </span>

          <span className="text-sm text-gray-600">
            Projetos
          </span>

        </div>

      </div>


      {/* ======================================================
          LISTAGEM DOS EIXOS ESTRATÉGICOS
          ====================================================== */}

      <div className="space-y-3">

        {eixos.map((eixo, indice) => (

          <LinhaDoEixo
            key={eixo.id}
            eixo={eixo}
            indice={indice}
          />

        ))}

      </div>

    </section>
  );
}
