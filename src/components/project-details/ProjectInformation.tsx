import {
    Hash,
    Tag,
    BarChart3,
    CalendarDays,
    Network,
    Pencil,
    AlignLeft,
    User,
    Users,
  } from 'lucide-react';
  
  import type { Project } from '@/data/projects';
  
  
  interface InformacoesProjetoProps {
    projeto: Project;
  }
  
  
  /* ============================================================
     CLASSES PADRÃO
     ============================================================ */
  
  const classeLabel =
    'mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-institution-600';
  
  const classeCampo =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-institution-500 focus:outline-none focus:ring-2 focus:ring-institution-100';
  
  
  /* ============================================================
     COMPONENTE PRINCIPAL
     ============================================================ */
  
  export default function ProjectInformation({
    projeto,
  }: InformacoesProjetoProps) {
  
  
    return (
  
      <div className="space-y-6">
  
  
        {/* ======================================================
            CABEÇALHO
            ====================================================== */}
  
        <div
          className="
            flex
            flex-wrap
            items-start
            justify-between
            gap-4
            border-b
            border-gray-200
            pb-4
          "
        >
  
          <div>
  
            <h2
              className="
                text-lg
                font-semibold
                text-gray-800
              "
            >
              Informações
            </h2>
  
            <p className="mt-1 text-sm text-gray-500">
              Dados gerais de identificação do projeto.
            </p>
  
          </div>
  
  
          <p className="text-xs text-gray-400">
            Última atualização: 08/09/2026 às 12:30
          </p>
  
        </div>
  
  
        {/* ======================================================
            DADOS GERAIS
            ====================================================== */}
  
        <section
          className="
            rounded-xl
            border-l-4
            border-l-institution-600
            bg-slate-50
            p-6
          "
        >
  
          <h3
            className="
              mb-5
              text-sm
              font-bold
              uppercase
              tracking-wide
              text-gray-700
            "
          >
            Dados Gerais
          </h3>
  
  
          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >
  
  
            {/* IDENTIFICADOR */}
  
            <div>
  
              <label className={classeLabel}>
                <Hash className="h-4 w-4" />
                Identificador
              </label>
  
              <input
                value={projeto.code}
                readOnly
                className={`
                  ${classeCampo}
                  bg-gray-100
                `}
              />
  
            </div>
  
  
            {/* ORIGEM */}
  
            <div>
  
              <label className={classeLabel}>
                <Tag className="h-4 w-4" />
                Origem
              </label>
  
              <select className={classeCampo}>
                <option>Melhoria</option>
                <option>Origem</option>
                <option>Manutenção</option>
                <option>Reparo</option>
                <option>PDTIC</option>
                <option>PTD</option>
                <option>ABEP</option>
              </select>
  
            </div>
  
  
            {/* NÍVEL */}
  
            <div>
  
              <label className={classeLabel}>
                <BarChart3 className="h-4 w-4" />
                Nível
              </label>
  
              <select className={classeCampo}>
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
                <option>Crítica</option>
              </select>
  
            </div>
  
  
            {/* DATA DE CRIAÇÃO */}
  
            <div>
  
              <label className={classeLabel}>
                <CalendarDays className="h-4 w-4" />
                Data de Criação
              </label>
  
              <input
                value="05/01/2026"
                readOnly
                className={`
                  ${classeCampo}
                  bg-gray-100
                `}
              />
  
              <p className="mt-1 text-[11px] text-gray-400">
                Calculada automaticamente
              </p>
  
            </div>
  
  
            {/* PROJETO PAI */}
  
            <div className="md:col-span-2">
  
              <label className={classeLabel}>
                <Network className="h-4 w-4" />
                Filho de
              </label>
  
              <select className={classeCampo}>
                <option>Nenhum (projeto raiz)</option>
              </select>
  
            </div>
  
  
            {/* NOME */}
  
            <div className="md:col-span-2">
  
              <label className={classeLabel}>
                <Pencil className="h-4 w-4" />
                Nome
              </label>
  
              <input
                defaultValue={projeto.title}
                className={classeCampo}
              />
  
            </div>
  
  
            {/* DESCRIÇÃO */}
  
            <div className="md:col-span-2">
  
              <label className={classeLabel}>
                <AlignLeft className="h-4 w-4" />
                Descrição
              </label>
  
              <textarea
                rows={5}
                defaultValue={
                  'Descrição fictícia do projeto para fins de protótipo visual.'
                }
                className={`
                  ${classeCampo}
                  resize-none
                `}
              />
  
            </div>
  
          </div>
  
        </section>
  
  
        {/* ======================================================
            GERENTE DO PROJETO
            ====================================================== */}
  
        <section
          className="
            rounded-xl
            border-l-4
            border-l-green-500
            bg-slate-50
            p-6
          "
        >
  
          <h3
            className="
              mb-5
              text-sm
              font-bold
              uppercase
              tracking-wide
              text-gray-700
            "
          >
            Gerente do Projeto
          </h3>
  
  
          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >
  
  
            {/* USUÁRIO */}
  
            <div>
  
              <label className={classeLabel}>
                <User className="h-4 w-4" />
                Usuário
              </label>
  
              <select className={classeCampo}>
  
                <option>
                  {projeto.responsible}
                </option>
  
                <option>
                  Maria Fernanda Souza
                </option>
  
                <option>
                  Carlos Lima
                </option>
  
              </select>
  
            </div>
  
  
            {/* GRUPO */}
  
            <div>
  
              <label className={classeLabel}>
                <Users className="h-4 w-4" />
                Grupo
              </label>
  
              <select className={classeCampo}>
  
                <option>
                  Coordenação de Infraestrutura de TI
                </option>
  
                <option>
                  Coordenação de Desenvolvimento
                </option>
  
                <option>
                  Coordenação de Governança
                </option>
  
              </select>
  
            </div>
  
          </div>
  
        </section>
  
  
        {/* ======================================================
            PLANEJAMENTO
            ====================================================== */}
  
        <section
          className="
            rounded-xl
            border-l-4
            border-l-amber-400
            bg-slate-50
            p-6
          "
        >
  
          <h3
            className="
              mb-5
              text-sm
              font-bold
              uppercase
              tracking-wide
              text-gray-700
            "
          >
            Planejamento
          </h3>
  
  
          <div
            className="
              grid
              grid-cols-1
              gap-5
              lg:grid-cols-3
            "
          >
  
  
            {/* ENTREGA ESTIMADA */}
  
            <div>
  
              <label className={classeLabel}>
                <CalendarDays className="h-4 w-4" />
                Entrega Estimada
              </label>
  
              <input
                defaultValue={
                  projeto.deliveryDate
                }
                className={classeCampo}
              />
  
            </div>
  
  
            {/* DATA DE INÍCIO */}
  
            <div>
  
              <label className={classeLabel}>
                <CalendarDays className="h-4 w-4" />
                Data de Início
              </label>
  
              <input
                placeholder="dd/mm/aaaa"
                className={classeCampo}
              />
  
            </div>
  
  
            {/* DATA DE ENTREGA */}
  
            <div>
  
              <label className={classeLabel}>
                <CalendarDays className="h-4 w-4" />
                Data de Entrega
              </label>
  
              <input
                placeholder="dd/mm/aaaa"
                className={classeCampo}
              />
  
            </div>
  
          </div>
  
        </section>
  
      </div>
    );
  }