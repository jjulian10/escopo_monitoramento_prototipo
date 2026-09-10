import {
  CalendarDays,
  User,
  ArrowRight,
  GripVertical,
  Tags,
} from 'lucide-react';

import {
  useSortable,
} from '@dnd-kit/sortable';

import {
  CSS,
} from '@dnd-kit/utilities';

import type {
  Project,
} from '@/data/projects';


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface ProjectKanbanCardProps {
  projeto: Project;

  aoAbrirProjeto: (
    projeto: Project
  ) => void;

  permitirArrastar?: boolean;
}


/* ============================================================
   FORMATAR DATA
   ============================================================ */

function formatarData(
  data?: string
) {

  if (!data) {
    return 'Não definida';
  }


  if (
    data.includes('-')
  ) {

    const partes =
      data.split('-');


    if (
      partes.length === 3
    ) {

      const [
        ano,
        mes,
        dia,
      ] = partes;


      return `${dia}/${mes}/${ano}`;

    }

  }


  return data;

}


/* ============================================================
   COR DO PROGRESSO
   ============================================================ */

function definirCorDoProgresso(
  projeto: Project
) {

  if (
    projeto.status ===
    'Concluído'
  ) {

    return 'bg-green-500';

  }


  if (
    projeto.status ===
    'Atrasado'
  ) {

    return 'bg-red-500';

  }


  if (
    projeto.status ===
    'Pausado'
  ) {

    return 'bg-gray-400';

  }


  if (
    projeto.progress < 50
  ) {

    return 'bg-amber-500';

  }


  return 'bg-institution-600';

}


/* ============================================================
   ESTILO DAS ETIQUETAS
   ============================================================ */

function obterEstiloDaEtiqueta(
  etiqueta: string
) {

  if (
    etiqueta ===
    'Atrasado'
  ) {

    return `
      border-red-200
      bg-red-50
      text-red-700
    `;

  }


  if (
    etiqueta ===
    'Prioridade'
  ) {

    return `
      border-violet-200
      bg-violet-50
      text-violet-700
    `;

  }


  if (
    etiqueta ===
    'Impedimento'
  ) {

    return `
      border-orange-200
      bg-orange-50
      text-orange-700
    `;

  }


  if (
    etiqueta ===
    'Dependência de terceiros'
  ) {

    return `
      border-cyan-200
      bg-cyan-50
      text-cyan-700
    `;

  }


  return `
    border-gray-200
    bg-gray-50
    text-gray-600
  `;

}


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function ProjectKanbanCard({
  projeto,
  aoAbrirProjeto,
  permitirArrastar = false,
}: ProjectKanbanCardProps) {


  /* ==========================================================
     DRAG AND DROP
     ========================================================== */

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({

    id:
      projeto.id,

    disabled:
      !permitirArrastar,

    data: {
      tipo:
        'projeto',

      projeto,
    },

  });


  /* ==========================================================
     ESTILO DO DRAG
     ========================================================== */

  const estilo = {

    transform:
      CSS.Transform.toString(
        transform
      ),

    transition,

  };


  /* ==========================================================
     DATA PRINCIPAL
     ========================================================== */

  const dataDeEntrega =

    projeto.actualDeliveryDate ||

    projeto.estimatedDeliveryDate ||

    projeto.deliveryDate;


  /* ==========================================================
     INTERFACE
     ========================================================== */

  return (

    <article
      ref={
        setNodeRef
      }

      style={
        estilo
      }

      className={`
        group
        relative
        rounded-xl
        border
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-200

        ${
          isDragging
            ? `
              border-institution-300
              opacity-30
              shadow-lg
            `
            : `
              border-gray-200
              hover:-translate-y-0.5
              hover:border-institution-200
              hover:shadow-md
            `
        }
      `}
    >


      {/* ======================================================
          ALÇA DE ARRASTE
          ====================================================== */}

      {permitirArrastar && (

        <button
          type="button"

          {...attributes}

          {...listeners}

          className="
            absolute
            right-3
            top-3
            z-10
            flex
            h-7
            w-7
            cursor-grab
            items-center
            justify-center
            rounded-md
            text-gray-300
            transition-colors
            hover:bg-gray-100
            hover:text-gray-500
            active:cursor-grabbing
          "

          title="Mover projeto"
        >

          <GripVertical
            className="
              h-4
              w-4
            "
          />

        </button>

      )}


      {/* ======================================================
          CÓDIGO
          ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >

        <span
          className="
            text-[11px]
            font-bold
            uppercase
            tracking-wide
            text-institution-600
          "
        >
          {projeto.code}
        </span>


        <span
          className="
            rounded-full
            bg-gray-100
            px-2
            py-0.5
            text-[10px]
            font-semibold
            text-gray-500
          "
        >
          {projeto.progress}%
        </span>

      </div>


      {/* ======================================================
          TÍTULO
          ====================================================== */}

      <h3
        className="
          mt-2
          line-clamp-2
          min-h-[40px]
          pr-6
          text-sm
          font-semibold
          leading-snug
          text-gray-800
        "
      >
        {projeto.title}
      </h3>


      {/* ======================================================
          ETIQUETAS
          ====================================================== */}

      {projeto.tags.length > 0 ? (

        <div
          className="
            mt-3
            flex
            flex-wrap
            gap-1.5
          "
        >

          {projeto.tags.map(
            (etiqueta) => (

              <span
                key={
                  etiqueta
                }

                className={`
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  border
                  px-2
                  py-0.5
                  text-[10px]
                  font-semibold

                  ${obterEstiloDaEtiqueta(
                    etiqueta
                  )}
                `}
              >

                <Tags
                  className="
                    h-2.5
                    w-2.5
                  "
                />

                {etiqueta}

              </span>

            )
          )}

        </div>

      ) : (

        <div
          className="
            mt-3
            h-5
          "
        />

      )}


      {/* ======================================================
          PROGRESSO
          ====================================================== */}

      <div className="mt-4">

        <div
          className="
            mb-1
            flex
            items-center
            justify-between
          "
        >

          <span
            className="
              text-[10px]
              font-medium
              text-gray-400
            "
          >
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


        <div
          className="
            h-1.5
            overflow-hidden
            rounded-full
            bg-gray-100
          "
        >

          <div
            className={`
              h-full
              rounded-full
              transition-all

              ${definirCorDoProgresso(
                projeto
              )}
            `}

            style={{
              width:
                `${Math.min(
                  Math.max(
                    projeto.progress,
                    0
                  ),
                  100
                )}%`,
            }}
          />

        </div>

      </div>


      {/* ======================================================
          INFORMAÇÕES
          ====================================================== */}

      <div
        className="
          mt-4
          space-y-2
          border-t
          border-gray-100
          pt-3
        "
      >


        {/* RESPONSÁVEL */}

        <div
          className="
            flex
            items-center
            gap-2
            text-xs
            text-gray-500
          "
        >

          <User
            className="
              h-3.5
              w-3.5
              flex-shrink-0
              text-gray-400
            "
          />


          <span
            className="
              truncate
            "
          >
            {projeto.responsible}
          </span>

        </div>


        {/* PRAZO */}

        <div
          className="
            flex
            items-center
            gap-2
            text-xs
            text-gray-500
          "
        >

          <CalendarDays
            className="
              h-3.5
              w-3.5
              flex-shrink-0
              text-gray-400
            "
          />


          <span>
            {formatarData(
              dataDeEntrega
            )}
          </span>

        </div>

      </div>


      {/* ======================================================
          ABRIR PROJETO
          ====================================================== */}

      <button
        type="button"

        onClick={() =>
          aoAbrirProjeto(
            projeto
          )
        }

        className="
          mt-4
          flex
          w-full
          items-center
          justify-center
          gap-1.5
          rounded-lg
          border
          border-gray-200
          bg-white
          px-3
          py-2
          text-xs
          font-semibold
          text-institution-600
          transition-all
          hover:border-institution-200
          hover:bg-institution-50
          hover:text-institution-700
        "
      >

        Ver projeto

        <ArrowRight
          className="
            h-3.5
            w-3.5
          "
        />

      </button>

    </article>

  );
}