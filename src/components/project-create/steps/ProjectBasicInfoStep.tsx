import {
    CalendarDays,
    FileText,
    Layers3,
    Tag,
    Type,
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
     COMPONENTE
     ============================================================ */
  
  export default function ProjectBasicInfoStep({
    dados,
    aoAlterar,
  }: ProjectBasicInfoStepProps) {
  
  
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
            Informe os dados principais para identificação e classificação do projeto.
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
  
  
            {/* IDENTIFICADOR */}
  
            <div>
  
              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-semibold
                  text-gray-600
                "
              >
                Identificador
              </label>
  
  
              <input
                disabled
  
                value="Gerado automaticamente após criar o projeto"
  
                className="
                  w-full
                  cursor-not-allowed
                  rounded-lg
                  border
                  border-gray-200
                  bg-gray-50
                  px-3
                  py-2.5
                  text-sm
                  text-gray-400
                "
              />
  
            </div>
  
  
            {/* ORIGEM */}
  
            <div>
  
              <label
                className="
                  mb-1.5
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-semibold
                  text-gray-600
                "
              >
  
                <Tag className="h-3.5 w-3.5" />
  
                Origem
  
              </label>
  
  
              <select
                value={dados.origem}
  
                onChange={(evento) =>
                  atualizarCampo(
                    'origem',
                    evento.target.value
                  )
                }
  
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-gray-700
                  outline-none
                  focus:border-institution-500
                  focus:ring-2
                  focus:ring-institution-100
                "
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
  
  
            {/* NOME */}
  
            <div className="lg:col-span-2">
  
              <label
                className="
                  mb-1.5
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-semibold
                  text-gray-600
                "
              >
  
                <Type className="h-3.5 w-3.5" />
  
                Nome do projeto *
  
              </label>
  
  
              <input
                value={dados.nome}
  
                onChange={(evento) =>
                  atualizarCampo(
                    'nome',
                    evento.target.value
                  )
                }
  
                placeholder="Digite o nome do projeto"
  
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2.5
                  text-sm
                  text-gray-700
                  outline-none
                  focus:border-institution-500
                  focus:ring-2
                  focus:ring-institution-100
                "
              />
  
            </div>
  
  
            {/* DESCRIÇÃO */}
  
            <div className="lg:col-span-2">
  
              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-semibold
                  text-gray-600
                "
              >
                Descrição
              </label>
  
  
              <textarea
                value={dados.descricao}
  
                onChange={(evento) =>
                  atualizarCampo(
                    'descricao',
                    evento.target.value
                  )
                }
  
                rows={5}
  
                placeholder="Descreva o objetivo, escopo e finalidade do projeto"
  
                className="
                  w-full
                  resize-none
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2.5
                  text-sm
                  text-gray-700
                  outline-none
                  focus:border-institution-500
                  focus:ring-2
                  focus:ring-institution-100
                "
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
  
  
            {/* NÍVEL */}
  
            <div>
  
              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-semibold
                  text-gray-600
                "
              >
                Nível
              </label>
  
  
              <select
                value={dados.nivel}
  
                onChange={(evento) =>
                  atualizarCampo(
                    'nivel',
                    evento.target.value
                  )
                }
  
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-gray-700
                "
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
  
  
            {/* DATA */}
  
            <div>
  
              <label
                className="
                  mb-1.5
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-semibold
                  text-gray-600
                "
              >
  
                <CalendarDays className="h-3.5 w-3.5" />
  
                Data de criação
  
              </label>
  
  
              <input
                type="date"
  
                value={dados.dataCriacao}
  
                onChange={(evento) =>
                  atualizarCampo(
                    'dataCriacao',
                    evento.target.value
                  )
                }
  
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2.5
                  text-sm
                  text-gray-700
                "
              />
  
            </div>
  
  
            {/* PROJETO PAI */}
  
            <div className="lg:col-span-2">
  
              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-semibold
                  text-gray-600
                "
              >
                Projeto pai
              </label>
  
  
              <select
                value={dados.projetoPai}
  
                onChange={(evento) =>
                  atualizarCampo(
                    'projetoPai',
                    evento.target.value
                  )
                }
  
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-gray-700
                "
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
  
      </div>
  
    );
  }