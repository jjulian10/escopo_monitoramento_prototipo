import { useState } from 'react';
import { createPortal } from 'react-dom';

import {
  X,
  Tag,
  Save,
} from 'lucide-react';

import type {
  TagType,
} from '@/data/projects';


/* ============================================================
   ETIQUETAS DISPONÍVEIS
   ============================================================ */

const etiquetasDisponiveis: TagType[] = [
  'Impedimento',
  'Prioridade',
  'Dependência de terceiros',
  'Atrasado',
];


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface ModalEtiquetaTarefaProps {
  etiquetasAtuais: TagType[];

  aoFechar: () => void;

  aoSalvar: (
    etiqueta: TagType
  ) => void;
}


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function AddTaskTagModal({
  etiquetasAtuais,
  aoFechar,
  aoSalvar,
}: ModalEtiquetaTarefaProps) {

  const [
    etiquetaSelecionada,
    setEtiquetaSelecionada,
  ] = useState<TagType | null>(
    null
  );


  function salvarEtiqueta() {

    if (!etiquetaSelecionada) {
      return;
    }

    aoSalvar(
      etiquetaSelecionada
    );

    aoFechar();
  }


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

        {/* CABEÇALHO */}

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

            <h2 className="text-base font-semibold">
              Adicionar Etiqueta à Tarefa
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
              hover:bg-white/10
            "
          >

            <X className="h-5 w-5" />

          </button>

        </header>


        {/* CONTEÚDO */}

        <div className="p-5">

          <p className="mb-3 text-sm font-medium text-gray-700">
            Selecione uma etiqueta
          </p>


          <div className="space-y-2">

            {etiquetasDisponiveis.map(
              (etiqueta) => {

                const jaExiste =
                  etiquetasAtuais.includes(
                    etiqueta
                  );

                const selecionada =
                  etiquetaSelecionada ===
                  etiqueta;


                return (

                  <button
                    key={etiqueta}
                    type="button"

                    disabled={jaExiste}

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
                        selecionada
                          ? `
                            border-institution-500
                            bg-institution-50
                            ring-2
                            ring-institution-100
                          `
                          : `
                            border-gray-200
                            hover:border-institution-200
                            hover:bg-gray-50
                          `
                      }

                      ${
                        jaExiste
                          ? `
                            cursor-not-allowed
                            opacity-50
                          `
                          : ''
                      }
                    `}
                  >

                    <span
                      className={`
                        flex
                        h-4
                        w-4
                        items-center
                        justify-center
                        rounded-full
                        border

                        ${
                          selecionada
                            ? 'border-institution-600'
                            : 'border-gray-400'
                        }
                      `}
                    >

                      {selecionada && (

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


                    <span
                      className={`
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-semibold

                        ${
                          etiqueta === 'Impedimento'
                            ? 'bg-orange-100 text-orange-700'
                            : ''
                        }

                        ${
                          etiqueta === 'Prioridade'
                            ? 'bg-violet-100 text-violet-700'
                            : ''
                        }

                        ${
                          etiqueta === 'Dependência de terceiros'
                            ? 'bg-cyan-100 text-cyan-700'
                            : ''
                        }

                        ${
                          etiqueta === 'Atrasado'
                            ? 'bg-red-100 text-red-700'
                            : ''
                        }
                      `}
                    >
                      {etiqueta}
                    </span>


                    {jaExiste && (

                      <span className="ml-auto text-xs text-gray-400">
                        Já adicionada
                      </span>

                    )}

                  </button>

                );

              }
            )}

          </div>

        </div>


        {/* RODAPÉ */}

        <footer
          className="
            flex
            justify-end
            gap-3
            border-t
            border-gray-200
            bg-gray-50
            px-5
            py-4
          "
        >

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
              hover:bg-gray-100
            "
          >
            Cancelar
          </button>


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