import { useState } from 'react';
import { createPortal } from 'react-dom';

import {
  X,
  Tag,
  Info,
  Save,
} from 'lucide-react';

import type {
  TagType,
} from '@/data/projects';


/* ============================================================
   ETIQUETAS QUE PODEM SER ADICIONADAS MANUALMENTE
   ============================================================

   "Atrasado" não aparece aqui porque será automático.
   ============================================================ */

const etiquetasDisponiveis: TagType[] = [
  'Impedimento',
  'Prioridade',
  'Dependência de terceiros',
];


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface ModalAdicionarEtiquetaProps {

  // Etiquetas que o projeto já possui
  etiquetasAtuais: TagType[];

  // Fecha o modal
  aoFechar: () => void;

  // Salva uma nova etiqueta
  aoSalvar: (
    etiqueta: TagType
  ) => void;
}


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function AddTagModal({
  etiquetasAtuais,
  aoFechar,
  aoSalvar,
}: ModalAdicionarEtiquetaProps) {


  /* ==========================================================
     ETIQUETA SELECIONADA
     ========================================================== */

  const [
    etiquetaSelecionada,
    setEtiquetaSelecionada,
  ] = useState<TagType | null>(
    null
  );


  /* ==========================================================
     SALVAR ETIQUETA
     ========================================================== */

  function salvarEtiqueta() {

    if (!etiquetaSelecionada) {
      return;
    }

    aoSalvar(
      etiquetaSelecionada
    );

    aoFechar();
  }


  /* ==========================================================
     MODAL COM PORTAL
     ==========================================================

     O createPortal faz o modal ser renderizado diretamente
     no <body> da página.

     Isso evita que o modal fique preso dentro do card do
     projeto ou sofra influência de transformações/animações.
     ========================================================== */

  return createPortal(

    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/40
        p-4
        backdrop-blur-[2px]
      "
    >


      {/* ======================================================
          MODAL
          ====================================================== */}

      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >


        {/* ====================================================
            CABEÇALHO
            ==================================================== */}

        <header
          className="
            flex
            items-center
            justify-between
            bg-institution-600
            px-5
            py-4
            text-white
          "
        >

          <div className="flex items-center gap-2">

            <Tag className="h-5 w-5" />

            <h2
              className="
                text-base
                font-semibold
              "
            >
              Adicionar Etiqueta
            </h2>

          </div>


          <button
            onClick={aoFechar}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              transition-colors
              hover:bg-white/10
            "
            title="Fechar"
          >

            <X className="h-5 w-5" />

          </button>

        </header>


        {/* ====================================================
            CONTEÚDO
            ==================================================== */}

        <div className="p-5">

          <p
            className="
              mb-3
              text-sm
              font-medium
              text-gray-700
            "
          >
            Selecione uma etiqueta
          </p>


          {/* ==================================================
              ETIQUETAS DISPONÍVEIS
              ================================================== */}

          <div className="space-y-2">

            {etiquetasDisponiveis.map(
              (etiqueta) => {


                const jaPossuiEtiqueta =
                  etiquetasAtuais.includes(
                    etiqueta
                  );


                const estaSelecionada =
                  etiquetaSelecionada ===
                  etiqueta;


                return (

                  <button
                    key={etiqueta}
                    type="button"

                    disabled={
                      jaPossuiEtiqueta
                    }

                    onClick={() =>
                      setEtiquetaSelecionada(
                        etiqueta
                      )
                    }

                    className={`
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      border
                      px-4
                      py-3
                      text-left
                      transition-all

                      ${
                        estaSelecionada
                          ? `
                            border-institution-500
                            bg-institution-50
                            ring-2
                            ring-institution-100
                          `
                          : `
                            border-gray-200
                            bg-white
                            hover:border-institution-200
                            hover:bg-gray-50
                          `
                      }

                      ${
                        jaPossuiEtiqueta
                          ? `
                            cursor-not-allowed
                            opacity-50
                          `
                          : ''
                      }
                    `}
                  >


                    {/* RADIO VISUAL */}

                    <span
                      className={`
                        flex
                        h-4
                        w-4
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border

                        ${
                          estaSelecionada
                            ? `
                              border-institution-600
                            `
                            : `
                              border-gray-400
                            `
                        }
                      `}
                    >

                      {estaSelecionada && (

                        <span
                          className="
                            h-2
                            w-2
                            rounded-full
                            bg-institution-600
                          "
                        />

                      )}

                    </span>


                    {/* ETIQUETA */}

                    <span
                      className={`
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-semibold

                        ${
                          etiqueta ===
                          'Impedimento'
                            ? `
                              bg-orange-100
                              text-orange-700
                            `
                            : ''
                        }

                        ${
                          etiqueta ===
                          'Prioridade'
                            ? `
                              bg-violet-100
                              text-violet-700
                            `
                            : ''
                        }

                        ${
                          etiqueta ===
                          'Dependência de terceiros'
                            ? `
                              bg-cyan-100
                              text-cyan-700
                            `
                            : ''
                        }
                      `}
                    >
                      {etiqueta}
                    </span>


                    {/* JÁ ADICIONADA */}

                    {jaPossuiEtiqueta && (

                      <span
                        className="
                          ml-auto
                          text-xs
                          text-gray-400
                        "
                      >
                        Já adicionada
                      </span>

                    )}

                  </button>

                );

              }
            )}

          </div>


          {/* ==================================================
              AVISO SOBRE ATRASADO
              ================================================== */}

          <div
            className="
              mt-5
              flex
              items-start
              gap-2
              rounded-xl
              bg-gray-50
              p-3
            "
          >

            <Info
              className="
                mt-0.5
                h-4
                w-4
                flex-shrink-0
                text-gray-400
              "
            />

            <p
              className="
                text-xs
                leading-relaxed
                text-gray-500
              "
            >
              A etiqueta{' '}

              <strong className="text-red-600">
                Atrasado
              </strong>{' '}

              não pode ser adicionada manualmente.
              Ela é aplicada automaticamente quando
              o projeto ultrapassa a entrega estimada
              sem estar concluído.
            </p>

          </div>

        </div>


        {/* ====================================================
            RODAPÉ
            ==================================================== */}

        <footer
          className="
            flex
            items-center
            justify-end
            gap-3
            border-t
            border-gray-200
            bg-gray-50
            px-5
            py-4
          "
        >

          {/* CANCELAR */}

          <button
            onClick={aoFechar}
            className="
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
              hover:bg-gray-100
            "
          >
            Cancelar
          </button>


          {/* SALVAR */}

          <button
            onClick={salvarEtiqueta}

            disabled={
              !etiquetaSelecionada
            }

            className="
              flex
              items-center
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
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >

            <Save className="h-4 w-4" />

            Salvar Etiqueta

          </button>

        </footer>

      </div>

    </div>,

    document.body
  );
}