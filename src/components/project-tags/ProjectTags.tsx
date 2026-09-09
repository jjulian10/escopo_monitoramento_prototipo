import {
    useState,
  } from 'react';
  
  import {
    Plus,
    X,
  } from 'lucide-react';
  
  import type {
    TagType,
  } from '@/data/projects';
  
  import AddTagModal from './AddTagModal';
  
  
  /* ============================================================
     PROPRIEDADES
     ============================================================ */
  
  interface EtiquetasProjetoProps {
    etiquetasIniciais: TagType[];
  }
  
  
  /* ============================================================
     ESTILOS DAS ETIQUETAS
     ============================================================ */
  
  const estilosEtiqueta: Record<
    TagType,
    string
  > = {
  
    Impedimento:
      'bg-orange-100 text-orange-700 border-orange-200',
  
    Prioridade:
      'bg-violet-100 text-violet-700 border-violet-200',
  
    'Dependência de terceiros':
      'bg-cyan-100 text-cyan-700 border-cyan-200',
  
    Atrasado:
      'bg-red-100 text-red-700 border-red-200',
  };
  
  
  /* ============================================================
     COMPONENTE PRINCIPAL
     ============================================================ */
  
  export default function ProjectTags({
    etiquetasIniciais,
  }: EtiquetasProjetoProps) {
  
  
    /* ==========================================================
       ETIQUETAS DO PROJETO
  
       Nesta fase ficam armazenadas localmente.
  
       Depois podemos conectar isso ao backend/API.
       ========================================================== */
  
    const [
      etiquetas,
      setEtiquetas,
    ] = useState<TagType[]>(
      etiquetasIniciais
    );
  
  
    /* ==========================================================
       CONTROLE DO MODAL
       ========================================================== */
  
    const [
      modalAberto,
      setModalAberto,
    ] = useState(false);
  
  
    /* ==========================================================
       ADICIONAR ETIQUETA
       ========================================================== */
  
    function adicionarEtiqueta(
      novaEtiqueta: TagType
    ) {
  
      const jaExiste =
        etiquetas.includes(
          novaEtiqueta
        );
  
  
      if (jaExiste) {
        return;
      }
  
  
      setEtiquetas(
        (etiquetasAtuais) => [
          ...etiquetasAtuais,
          novaEtiqueta,
        ]
      );
    }
  
  
    /* ==========================================================
       REMOVER ETIQUETA
       ========================================================== */
  
    function removerEtiqueta(
      etiqueta: TagType
    ) {
  
      /*
       * A etiqueta "Atrasado" é automática.
       *
       * Por isso, o usuário não pode removê-la
       * manualmente.
       */
  
      if (etiqueta === 'Atrasado') {
        return;
      }
  
  
      setEtiquetas(
        (etiquetasAtuais) =>
          etiquetasAtuais.filter(
            (item) =>
              item !== etiqueta
          )
      );
    }
  
  
    return (
  
      <>
  
  
        {/* ======================================================
            ETIQUETAS DO PROJETO
            ====================================================== */}
  
        <div
          className="
            mt-2
            flex
            flex-wrap
            items-center
            gap-1.5
          "
        >
  
  
          {/* ====================================================
              BOTÃO +
              ==================================================== */}
  
          <button
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
            title="Adicionar etiqueta"
          >
  
            <Plus className="h-3.5 w-3.5" />
  
          </button>
  
  
          {/* ====================================================
              ETIQUETAS
              ==================================================== */}
  
          {etiquetas.map(
            (etiqueta) => {
  
              const podeRemover =
                etiqueta !== 'Atrasado';
  
  
              return (
  
                <span
                  key={etiqueta}
                  className={`
                    flex
                    items-center
                    gap-1
                    rounded-full
                    border
                    px-2
                    py-0.5
                    text-[11px]
                    font-semibold
  
                    ${
                      estilosEtiqueta[
                        etiqueta
                      ]
                    }
                  `}
                >
  
                  {etiqueta}
  
  
                  {/* ============================================
                      REMOVER ETIQUETA
  
                      Atrasado não possui X.
                      ============================================ */}
  
                  {podeRemover && (
  
                    <button
                      onClick={() =>
                        removerEtiqueta(
                          etiqueta
                        )
                      }
                      className="
                        rounded-full
                        transition-opacity
                        hover:opacity-60
                      "
                      title={`Remover ${etiqueta}`}
                    >
  
                      <X className="h-3 w-3" />
  
                    </button>
  
                  )}
  
                </span>
  
              );
  
            }
          )}
  
        </div>
  
  
        {/* ======================================================
            MODAL
            ====================================================== */}
  
        {modalAberto && (
  
          <AddTagModal
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