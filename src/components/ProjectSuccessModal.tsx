import {
  useEffect,
} from 'react';

import {
  Check,
  Sparkles,
  X,
} from 'lucide-react';

import type {
  Project,
} from '@/data/projects';


/* ============================================================
   TIPOS
   ============================================================ */

export type ProjectSuccessType =
  | 'created'
  | 'completed';


interface ProjectSuccessModalProps {
  tipo: ProjectSuccessType;

  projeto: Project;

  aoFechar: () => void;
}


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function ProjectSuccessModal({
  tipo,
  projeto,
  aoFechar,
}: ProjectSuccessModalProps) {


  /* ==========================================================
     FECHAMENTO AUTOMÁTICO / TECLA ESC
     ========================================================== */

  useEffect(() => {

    const temporizador =
      window.setTimeout(
        aoFechar,
        3600
      );


    function aoPressionarTecla(
      evento: KeyboardEvent
    ) {

      if (
        evento.key ===
        'Escape'
      ) {

        aoFechar();

      }

    }


    window.addEventListener(
      'keydown',
      aoPressionarTecla
    );


    return () => {

      window.clearTimeout(
        temporizador
      );


      window.removeEventListener(
        'keydown',
        aoPressionarTecla
      );

    };

  }, [
    aoFechar,
  ]);


  /* ==========================================================
     CONTEÚDO
     ========================================================== */

  const projetoCriado =
    tipo ===
    'created';


  const titulo =
    projetoCriado
      ? 'Projeto criado com sucesso!'
      : 'Projeto concluído!';


  const descricao =
    projetoCriado
      ? 'O projeto foi criado e já está disponível para acompanhamento.'
      : 'Todas as etapas foram concluídas e o projeto foi finalizado com sucesso.';


  /* ==========================================================
     INTERFACE
     ========================================================== */

  return (

    <div
      className="
        scope-success-backdrop
        fixed
        inset-0
        z-[12000]
        flex
        items-center
        justify-center
        bg-slate-950/30
        p-4
        backdrop-blur-[3px]
      "

      role="dialog"

      aria-modal="true"

      aria-live="polite"

      aria-label={
        titulo
      }

      onMouseDown={(evento) => {

        if (
          evento.target ===
          evento.currentTarget
        ) {

          aoFechar();

        }

      }}
    >

      <div
        className="
          scope-success-card
          relative
          w-full
          max-w-[460px]
          overflow-hidden
          rounded-[24px]
          border
          border-emerald-100
          bg-white
          px-8
          pb-7
          pt-9
          text-center
          shadow-[0_30px_90px_-28px_rgba(15,23,42,0.40)]
        "
      >

        {/* ====================================================
            DETALHE SUPERIOR
            ==================================================== */}

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-1
            bg-gradient-to-r
            from-emerald-400
            via-green-500
            to-emerald-400
          "
        />


        {/* ====================================================
            FECHAR
            ==================================================== */}

        <button
          type="button"

          onClick={
            aoFechar
          }

          className="
            absolute
            right-4
            top-4
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            text-gray-400
            transition-colors
            hover:bg-gray-100
            hover:text-gray-600
          "

          aria-label="Fechar mensagem"
        >

          <X className="h-4 w-4" />

        </button>


        {/* ====================================================
            ÍCONE ANIMADO
            ==================================================== */}

        <div
          className="
            relative
            mx-auto
            flex
            h-28
            w-28
            items-center
            justify-center
          "
        >

          <div
            className="
              scope-success-ring
              absolute
              h-28
              w-28
              rounded-full
              bg-emerald-100/70
            "
          />


          <div
            className="
              scope-success-ring-delayed
              absolute
              h-20
              w-20
              rounded-full
              bg-emerald-200/70
            "
          />


          <div
            className="
              scope-success-check
              relative
              z-10
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              border
              border-emerald-300
              bg-gradient-to-br
              from-emerald-500
              to-green-600
              text-white
              shadow-[0_12px_30px_-10px_rgba(22,163,74,0.65)]
            "
          >

            <Check
              className="
                h-8
                w-8
                stroke-[3]
              "
            />

          </div>


          <Sparkles
            className="
              scope-success-spark-one
              absolute
              right-0
              top-3
              h-5
              w-5
              text-emerald-500
            "
          />


          <Sparkles
            className="
              scope-success-spark-two
              absolute
              bottom-4
              left-1
              h-4
              w-4
              text-green-400
            "
          />

        </div>


        {/* ====================================================
            TEXTO
            ==================================================== */}

        <div className="mt-3">

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-emerald-600
            "
          >
            {projetoCriado
              ? 'Operação concluída'
              : '100% concluído'}
          </p>


          <h2
            className="
              mt-2
              text-2xl
              font-bold
              tracking-tight
              text-gray-900
            "
          >
            {titulo}
          </h2>


          <p
            className="
              mx-auto
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-gray-500
            "
          >
            {descricao}
          </p>

        </div>


        {/* ====================================================
            PROJETO
            ==================================================== */}

        <div
          className="
            mt-6
            rounded-xl
            border
            border-gray-100
            bg-slate-50/80
            px-4
            py-3
            text-left
          "
        >

          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wide
              text-gray-400
            "
          >
            Projeto
          </p>


          <p
            className="
              mt-1
              text-sm
              font-semibold
              text-gray-800
            "
          >
            <span className="text-institution-700">
              {projeto.code}
            </span>

            {' — '}

            {projeto.title}
          </p>

        </div>


        {/* ====================================================
            AÇÃO
            ==================================================== */}

        <button
          type="button"

          onClick={
            aoFechar
          }

          className="
            mt-6
            inline-flex
            min-w-32
            items-center
            justify-center
            rounded-lg
            bg-institution-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition-all
            hover:bg-institution-700
            hover:shadow-md
          "
        >
          Continuar
        </button>


        {/* ====================================================
            INDICADOR DE FECHAMENTO AUTOMÁTICO
            ==================================================== */}

        <div
          className="
            absolute
            bottom-0
            left-0
            h-[3px]
            w-full
            bg-emerald-50
          "
        >

          <div
            className="
              scope-success-progress
              h-full
              bg-emerald-500
            "
          />

        </div>

      </div>


      {/* ======================================================
          ANIMAÇÕES
          ====================================================== */}

      <style>
        {`
          @keyframes scopeSuccessBackdrop {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes scopeSuccessCard {
            0% {
              opacity: 0;
              transform: translateY(16px) scale(0.94);
            }

            70% {
              opacity: 1;
              transform: translateY(-2px) scale(1.012);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes scopeSuccessCheck {
            0% {
              opacity: 0;
              transform: scale(0.45) rotate(-18deg);
            }

            65% {
              opacity: 1;
              transform: scale(1.10) rotate(3deg);
            }

            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
          }

          @keyframes scopeSuccessRing {
            0% {
              opacity: 0;
              transform: scale(0.55);
            }

            60% {
              opacity: 1;
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes scopeSuccessSpark {
            0%,
            100% {
              opacity: 0.35;
              transform: scale(0.82) rotate(-8deg);
            }

            50% {
              opacity: 1;
              transform: scale(1.15) rotate(8deg);
            }
          }

          @keyframes scopeSuccessProgress {
            from {
              width: 100%;
            }

            to {
              width: 0%;
            }
          }

          .scope-success-backdrop {
            animation:
              scopeSuccessBackdrop
              180ms
              ease-out
              both;
          }

          .scope-success-card {
            animation:
              scopeSuccessCard
              430ms
              cubic-bezier(0.22, 1, 0.36, 1)
              both;
          }

          .scope-success-check {
            animation:
              scopeSuccessCheck
              560ms
              90ms
              cubic-bezier(0.22, 1, 0.36, 1)
              both;
          }

          .scope-success-ring {
            animation:
              scopeSuccessRing
              520ms
              40ms
              cubic-bezier(0.22, 1, 0.36, 1)
              both;
          }

          .scope-success-ring-delayed {
            animation:
              scopeSuccessRing
              600ms
              90ms
              cubic-bezier(0.22, 1, 0.36, 1)
              both;
          }

          .scope-success-spark-one {
            animation:
              scopeSuccessSpark
              1.25s
              350ms
              ease-in-out
              infinite;
          }

          .scope-success-spark-two {
            animation:
              scopeSuccessSpark
              1.45s
              520ms
              ease-in-out
              infinite;
          }

          .scope-success-progress {
            animation:
              scopeSuccessProgress
              3600ms
              linear
              forwards;
          }

          @media (prefers-reduced-motion: reduce) {
            .scope-success-backdrop,
            .scope-success-card,
            .scope-success-check,
            .scope-success-ring,
            .scope-success-ring-delayed,
            .scope-success-spark-one,
            .scope-success-spark-two,
            .scope-success-progress {
              animation: none !important;
            }
          }
        `}
      </style>

    </div>

  );

}
