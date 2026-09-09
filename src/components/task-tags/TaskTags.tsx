import { useState } from 'react';

import {
  Plus,
  X,
} from 'lucide-react';

import type {
  TagType,
} from '@/data/projects';

import AddTaskTagModal from './AddTaskTagModal';


interface EtiquetasTarefaProps {
  etiquetasIniciais?: TagType[];

  aoAlterarEtiquetas?: (
    etiquetas: TagType[]
  ) => void;
}


/* ============================================================
   ESTILOS
   ============================================================ */

const estilosDasEtiquetas: Record<
  TagType,
  string
> = {

  Impedimento:
    'border-orange-200 bg-orange-50 text-orange-700',

  Prioridade:
    'border-violet-200 bg-violet-50 text-violet-700',

  'Dependência de terceiros':
    'border-cyan-200 bg-cyan-50 text-cyan-700',

  Atrasado:
    'border-red-200 bg-red-50 text-red-700',

};


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function TaskTags({
  etiquetasIniciais = [],
  aoAlterarEtiquetas,
}: EtiquetasTarefaProps) {

  const [
    etiquetas,
    setEtiquetas,
  ] = useState<TagType[]>(
    etiquetasIniciais
  );


  const [
    modalAberto,
    setModalAberto,
  ] = useState(false);


  function atualizarEtiquetas(
    novasEtiquetas: TagType[]
  ) {

    setEtiquetas(
      novasEtiquetas
    );

    aoAlterarEtiquetas?.(
      novasEtiquetas
    );
  }


  function adicionarEtiqueta(
    etiqueta: TagType
  ) {

    if (
      etiquetas.includes(
        etiqueta
      )
    ) {
      return;
    }

    atualizarEtiquetas([
      ...etiquetas,
      etiqueta,
    ]);
  }


  function removerEtiqueta(
    etiqueta: TagType
  ) {

    atualizarEtiquetas(
      etiquetas.filter(
        (item) =>
          item !== etiqueta
      )
    );
  }


  return (

    <>

      <div
        className="
          mt-3
          flex
          flex-wrap
          items-center
          gap-1.5
        "
      >

        {/* BOTÃO + */}

        <button
          type="button"

          onClick={() =>
            setModalAberto(true)
          }

          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            border
            border-dashed
            border-institution-300
            text-institution-600
            transition-all
            hover:border-institution-500
            hover:bg-institution-50
          "
          title="Adicionar etiqueta à tarefa"
        >

          <Plus className="h-3.5 w-3.5" />

        </button>


        {/* ETIQUETAS */}

        {etiquetas.map(
          (etiqueta) => (

            <span
              key={etiqueta}
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

                ${estilosDasEtiquetas[etiqueta]}
              `}
            >

              {etiqueta}


              <button
                type="button"

                onClick={() =>
                  removerEtiqueta(
                    etiqueta
                  )
                }

                className="
                  rounded-full
                  hover:opacity-60
                "
                title={`Remover ${etiqueta}`}
              >

                <X className="h-3 w-3" />

              </button>

            </span>

          )
        )}

      </div>


      {modalAberto && (

        <AddTaskTagModal
          etiquetasAtuais={
            etiquetas
          }

          aoSalvar={
            adicionarEtiqueta
          }

          aoFechar={() =>
            setModalAberto(false)
          }
        />

      )}

    </>

  );
}