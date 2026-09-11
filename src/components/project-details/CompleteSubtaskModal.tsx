import {
  useState,
} from 'react';

import {
  CheckCircle2,
  FileText,
  Image,
  MessageSquareText,
  Upload,
  X,
} from 'lucide-react';

import type {
  ProjectCompletionEvidence,
  ProjectSubtask,
  ProjectDocumentType,
} from '@/data/projects';


/* ============================================================
   ARQUIVO SELECIONADO NA CONCLUSÃO
   ============================================================

   Essa estrutura representa o arquivo selecionado no modal.

   Neste protótipo ainda não enviaremos o arquivo para
   um servidor.

   Vamos guardar apenas seus metadados para depois criar
   um ProjectDocument dentro do projeto.
   ============================================================ */

export interface ArquivoConclusaoSelecionado {
  fileName: string;

  type: ProjectDocumentType;

  mimeType?: string;

  size?: number;
}


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface CompleteSubtaskModalProps {
  subtarefa: ProjectSubtask;

  aoFechar: () => void;

  aoConfirmar: (
    evidencia: ProjectCompletionEvidence,
    arquivos: ArquivoConclusaoSelecionado[]
  ) => void;
}


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function CompleteSubtaskModal({
  subtarefa,
  aoFechar,
  aoConfirmar,
}: CompleteSubtaskModalProps) {


  /* ==========================================================
     OBSERVAÇÃO
     ========================================================== */

  const [
    observacao,
    setObservacao,
  ] = useState('');


  /* ==========================================================
     IMAGEM
     ========================================================== */

  const [
    imagemSelecionada,
    setImagemSelecionada,
  ] = useState<File | null>(
    null
  );


  /* ==========================================================
     DOCUMENTO
     ========================================================== */

  const [
    documentoSelecionado,
    setDocumentoSelecionado,
  ] = useState<File | null>(
    null
  );


  /* ==========================================================
     NOMES DOS ARQUIVOS
     ========================================================== */

  const nomeImagem =
    imagemSelecionada?.name ??
    '';


  const nomeDocumento =
    documentoSelecionado?.name ??
    '';


  /* ==========================================================
     VALIDAÇÃO
     ==========================================================

     A subtarefa só poderá ser concluída se houver pelo menos:

     - uma observação;
     - OU uma imagem;
     - OU um documento.
     ========================================================== */

  const possuiComprovacao =
    observacao.trim() !== '' ||
    imagemSelecionada !== null ||
    documentoSelecionado !== null;


  /* ==========================================================
     CONFIRMAR
     ========================================================== */

  function confirmarConclusao() {

    if (
      !possuiComprovacao
    ) {

      window.alert(
        'Informe uma observação ou anexe uma imagem/documento para concluir a subtarefa.'
      );

      return;

    }


    /* --------------------------------------------------------
       DATA DA CONCLUSÃO
       -------------------------------------------------------- */

    const dataDaConclusao =
      new Date().toISOString();


    /* --------------------------------------------------------
       EVIDÊNCIA DA SUBTAREFA
       -------------------------------------------------------- */

    const evidencia:
      ProjectCompletionEvidence = {

      observation:
        observacao.trim() ||
        undefined,

      imageName:
        nomeImagem ||
        undefined,

      documentName:
        nomeDocumento ||
        undefined,

      completedAt:
        dataDaConclusao,

      completedBy:
        subtarefa.responsible,

    };


    /* --------------------------------------------------------
       ARQUIVOS QUE SERÃO REGISTRADOS NO PROJETO
       -------------------------------------------------------- */

    const arquivos:
      ArquivoConclusaoSelecionado[] = [];


    /* --------------------------------------------------------
       IMAGEM
       -------------------------------------------------------- */

    if (
      imagemSelecionada
    ) {

      arquivos.push({

        fileName:
          imagemSelecionada.name,

        type:
          'image',

        mimeType:
          imagemSelecionada.type ||
          undefined,

        size:
          imagemSelecionada.size,

      });

    }


    /* --------------------------------------------------------
       DOCUMENTO
       -------------------------------------------------------- */

    if (
      documentoSelecionado
    ) {

      arquivos.push({

        fileName:
          documentoSelecionado.name,

        type:
          'document',

        mimeType:
          documentoSelecionado.type ||
          undefined,

        size:
          documentoSelecionado.size,

      });

    }


    /* --------------------------------------------------------
       ENVIA A EVIDÊNCIA + ARQUIVOS
       -------------------------------------------------------- */

    aoConfirmar(
      evidencia,
      arquivos
    );

  }


  /* ==========================================================
     INTERFACE
     ========================================================== */

  return (

    <div
      className="
        fixed
        inset-0
        z-[100]
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
          max-w-2xl
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
            border-b
            border-gray-200
            bg-white
            px-6
            py-5
          "
        >

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                flex-shrink-0
                items-center
                justify-center
                rounded-xl
                bg-green-50
                text-green-600
              "
            >
              <CheckCircle2 className="h-5 w-5" />
            </div>


            <div className="min-w-0">

              <h2
                className="
                  truncate
                  text-base
                  font-semibold
                  text-gray-800
                "
              >
                Concluir subtarefa
              </h2>


              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  text-gray-400
                "
              >
                {subtarefa.title}
              </p>

            </div>

          </div>


          <button
            type="button"

            onClick={
              aoFechar
            }

            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-gray-400
              transition-colors
              hover:bg-gray-100
              hover:text-gray-600
            "
          >
            <X className="h-5 w-5" />
          </button>

        </header>


        {/* ====================================================
            CONTEÚDO
            ==================================================== */}

        <div
          className="
            space-y-6
            p-6
          "
        >


          {/* ==================================================
              AVISO
              ================================================== */}

          <div
            className="
              rounded-xl
              border
              border-green-100
              bg-green-50/60
              px-4
              py-3
            "
          >

            <p
              className="
                text-sm
                font-medium
                text-green-800
              "
            >
              Comprovação de conclusão
            </p>


            <p
              className="
                mt-1
                text-xs
                leading-relaxed
                text-green-700/80
              "
            >
              Para concluir esta subtarefa, informe pelo menos uma evidência:
              observação, imagem ou documento.
            </p>

          </div>


          {/* ==================================================
              OBSERVAÇÃO
              ================================================== */}

          <div>

            <label
              className="
                mb-2
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-gray-700
              "
            >

              <MessageSquareText
                className="
                  h-4
                  w-4
                  text-institution-600
                "
              />

              Observação de conclusão

            </label>


            <textarea
              value={
                observacao
              }

              onChange={(evento) =>
                setObservacao(
                  evento.target.value
                )
              }

              rows={4}

              placeholder="Descreva o que foi realizado nesta subtarefa..."

              className="
                w-full
                resize-none
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                text-gray-700
                outline-none
                transition-all
                placeholder:text-gray-400
                focus:border-institution-400
                focus:ring-2
                focus:ring-institution-100
              "
            />

          </div>


          {/* ==================================================
              ANEXOS
              ================================================== */}

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
            "
          >


            {/* =================================================
                IMAGEM
                ================================================= */}

            <div>

              <label
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >

                <Image
                  className="
                    h-4
                    w-4
                    text-blue-600
                  "
                />

                Imagem de comprovação

              </label>


              <label
                className="
                  flex
                  min-h-[120px]
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-dashed
                  border-gray-300
                  bg-gray-50
                  px-4
                  py-5
                  text-center
                  transition-all
                  hover:border-institution-300
                  hover:bg-institution-50/30
                "
              >

                <Upload
                  className="
                    h-5
                    w-5
                    text-gray-400
                  "
                />


                <span
                  className="
                    mt-2
                    text-xs
                    font-medium
                    text-gray-600
                  "
                >
                  Selecionar imagem
                </span>


                <span
                  className="
                    mt-1
                    text-[10px]
                    text-gray-400
                  "
                >
                  PNG, JPG ou JPEG
                </span>


                <input
                  type="file"

                  accept="
                    image/png,
                    image/jpeg
                  "

                  className="hidden"

                  onChange={(evento) => {

                    const arquivo =
                      evento.target.files?.[0] ??
                      null;


                    setImagemSelecionada(
                      arquivo
                    );

                  }}
                />

              </label>


              {imagemSelecionada && (

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    justify-between
                    gap-2
                    rounded-lg
                    bg-blue-50
                    px-3
                    py-2
                  "
                >

                  <span
                    className="
                      truncate
                      text-xs
                      font-medium
                      text-blue-700
                    "
                  >
                    {imagemSelecionada.name}
                  </span>


                  <button
                    type="button"

                    onClick={() =>
                      setImagemSelecionada(
                        null
                      )
                    }

                    className="
                      text-blue-400
                      hover:text-blue-600
                    "
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                </div>

              )}

            </div>


            {/* =================================================
                DOCUMENTO
                ================================================= */}

            <div>

              <label
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >

                <FileText
                  className="
                    h-4
                    w-4
                    text-violet-600
                  "
                />

                Documento

              </label>


              <label
                className="
                  flex
                  min-h-[120px]
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-dashed
                  border-gray-300
                  bg-gray-50
                  px-4
                  py-5
                  text-center
                  transition-all
                  hover:border-institution-300
                  hover:bg-institution-50/30
                "
              >

                <Upload
                  className="
                    h-5
                    w-5
                    text-gray-400
                  "
                />


                <span
                  className="
                    mt-2
                    text-xs
                    font-medium
                    text-gray-600
                  "
                >
                  Selecionar documento
                </span>


                <span
                  className="
                    mt-1
                    text-[10px]
                    text-gray-400
                  "
                >
                  PDF, DOC ou DOCX
                </span>


                <input
                  type="file"

                  accept="
                    .pdf,
                    .doc,
                    .docx
                  "

                  className="hidden"

                  onChange={(evento) => {

                    const arquivo =
                      evento.target.files?.[0] ??
                      null;


                    setDocumentoSelecionado(
                      arquivo
                    );

                  }}
                />

              </label>


              {documentoSelecionado && (

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    justify-between
                    gap-2
                    rounded-lg
                    bg-violet-50
                    px-3
                    py-2
                  "
                >

                  <span
                    className="
                      truncate
                      text-xs
                      font-medium
                      text-violet-700
                    "
                  >
                    {documentoSelecionado.name}
                  </span>


                  <button
                    type="button"

                    onClick={() =>
                      setDocumentoSelecionado(
                        null
                      )
                    }

                    className="
                      text-violet-400
                      hover:text-violet-600
                    "
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                </div>

              )}

            </div>

          </div>


          {/* ==================================================
              INFORMAÇÃO
              ================================================== */}

          <div
            className="
              rounded-lg
              border
              border-gray-100
              bg-slate-50
              px-4
              py-3
            "
          >

            <p
              className="
                text-[11px]
                leading-relaxed
                text-gray-500
              "
            >
              Neste protótipo, os arquivos ainda não serão enviados para um
              servidor. Serão armazenados o nome e os metadados do arquivo.
              Quando integrarmos o backend, substituiremos isso pelo upload real.
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
            justify-between
            gap-3
            border-t
            border-gray-200
            bg-slate-50/60
            px-6
            py-4
          "
        >

          <p
            className="
              hidden
              text-xs
              text-gray-400
              sm:block
            "
          >
            Pelo menos uma comprovação é obrigatória.
          </p>


          <div
            className="
              ml-auto
              flex
              items-center
              gap-3
            "
          >

            <button
              type="button"

              onClick={
                aoFechar
              }

              className="
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-gray-600
                transition-colors
                hover:bg-gray-50
              "
            >
              Cancelar
            </button>


            <button
              type="button"

              onClick={
                confirmarConclusao
              }

              disabled={
                !possuiComprovacao
              }

              className={`
                flex
                items-center
                gap-2
                rounded-lg
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition-all

                ${
                  possuiComprovacao
                    ? `
                      bg-green-600
                      shadow-sm
                      hover:bg-green-700
                      hover:shadow-md
                    `
                    : `
                      cursor-not-allowed
                      bg-gray-300
                    `
                }
              `}
            >

              <CheckCircle2 className="h-4 w-4" />

              Confirmar conclusão

            </button>

          </div>

        </footer>

      </div>

    </div>

  );
}