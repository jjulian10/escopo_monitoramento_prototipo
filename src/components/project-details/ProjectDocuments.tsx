import {
    FileText,
    Image,
    FolderOpen,
    User,
    CalendarDays,
    ListChecks,
    CheckCircle2,
  } from 'lucide-react';
  
  import type {
    Project,
    ProjectDocument,
  } from '@/data/projects';
  
  
  /* ============================================================
     PROPRIEDADES
     ============================================================ */
  
  interface ProjectDocumentsProps {
    projeto: Project;
  }
  
  
  /* ============================================================
     FORMATAR DATA
     ============================================================ */
  
  function formatarDataHora(
    data?: string
  ) {
  
    if (
      !data
    ) {
      return 'Data não informada';
    }
  
  
    const dataFormatada =
      new Date(
        data
      );
  
  
    if (
      Number.isNaN(
        dataFormatada.getTime()
      )
    ) {
      return data;
    }
  
  
    return dataFormatada.toLocaleString(
      'pt-BR',
      {
        day:
          '2-digit',
  
        month:
          '2-digit',
  
        year:
          'numeric',
  
        hour:
          '2-digit',
  
        minute:
          '2-digit',
      }
    );
  
  }
  
  
  /* ============================================================
     FORMATAR TAMANHO
     ============================================================ */
  
  function formatarTamanho(
    tamanho?: number
  ) {
  
    if (
      tamanho === undefined
    ) {
      return '';
    }
  
  
    if (
      tamanho < 1024
    ) {
      return `${tamanho} B`;
    }
  
  
    if (
      tamanho < 1024 * 1024
    ) {
  
      return `${(
        tamanho /
        1024
      ).toFixed(1)} KB`;
  
    }
  
  
    return `${(
      tamanho /
      (
        1024 *
        1024
      )
    ).toFixed(1)} MB`;
  
  }
  
  
  /* ============================================================
     COMPONENTE PRINCIPAL
     ============================================================ */
  
  export default function ProjectDocuments({
    projeto,
  }: ProjectDocumentsProps) {
  
  
    /* ==========================================================
       DOCUMENTOS
       ========================================================== */
  
    const documentos:
      ProjectDocument[] =
      projeto.documents ??
      [];
  
  
    /* ==========================================================
       QUANTIDADES
       ========================================================== */
  
    const quantidadeImagens =
      documentos.filter(
        (documento) =>
          documento.type ===
          'image'
      ).length;
  
  
    const quantidadeDocumentos =
      documentos.filter(
        (documento) =>
          documento.type ===
          'document'
      ).length;
  
  
    /* ==========================================================
       INTERFACE
       ========================================================== */
  
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
            pb-5
          "
        >
  
          <div>
  
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
  
              <FolderOpen
                className="
                  h-5
                  w-5
                  text-institution-600
                "
              />
  
  
              <h2
                className="
                  text-lg
                  font-semibold
                  text-gray-800
                "
              >
                Documentos do Projeto
              </h2>
  
            </div>
  
  
            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Arquivos e evidências anexados durante
              a execução do projeto.
            </p>
  
  
            {/* ==================================================
                RESUMO
                ================================================== */}
  
            <div
              className="
                mt-3
                flex
                flex-wrap
                gap-2
              "
            >
  
              <span
                className="
                  rounded-full
                  bg-institution-50
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-institution-700
                "
              >
                {documentos.length}{' '}
  
                {documentos.length === 1
                  ? 'arquivo'
                  : 'arquivos'}
              </span>
  
  
              <span
                className="
                  rounded-full
                  bg-blue-50
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-blue-700
                "
              >
                {quantidadeImagens}{' '}
  
                {quantidadeImagens === 1
                  ? 'imagem'
                  : 'imagens'}
              </span>
  
  
              <span
                className="
                  rounded-full
                  bg-violet-50
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-violet-700
                "
              >
                {quantidadeDocumentos}{' '}
  
                {quantidadeDocumentos === 1
                  ? 'documento'
                  : 'documentos'}
              </span>
  
            </div>
  
          </div>
  
        </div>
  
  
        {/* ======================================================
            SEM DOCUMENTOS
            ====================================================== */}
  
        {documentos.length === 0 ? (
  
          <div
            className="
              rounded-xl
              border
              border-dashed
              border-gray-300
              bg-gray-50
              px-6
              py-14
              text-center
            "
          >
  
            <FolderOpen
              className="
                mx-auto
                h-9
                w-9
                text-gray-300
              "
            />
  
  
            <p
              className="
                mt-3
                text-sm
                font-semibold
                text-gray-600
              "
            >
              Nenhum arquivo anexado
            </p>
  
  
            <p
              className="
                mx-auto
                mt-1
                max-w-md
                text-xs
                leading-relaxed
                text-gray-400
              "
            >
              Os arquivos utilizados como comprovação
              na conclusão das tarefas e subtarefas
              aparecerão automaticamente nesta área.
            </p>
  
          </div>
  
        ) : (
  
          /* =====================================================
             LISTA DE DOCUMENTOS
             ===================================================== */
  
          <div className="space-y-3">
  
            {documentos.map(
              (documento) => {
  
  
                /* ===============================================
                   TIPO
                   =============================================== */
  
                const ehImagem =
                  documento.type ===
                  'image';
  
  
                const tamanhoFormatado =
                  formatarTamanho(
                    documento.size
                  );
  
  
                return (
  
                  <article
                    key={
                      documento.id
                    }
  
                    className="
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      p-5
                      shadow-sm
                      transition-all
                      hover:border-institution-200
                      hover:shadow-md
                    "
                  >
  
  
                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        xl:flex-row
                        xl:items-start
                      "
                    >
  
  
                      {/* =========================================
                          ÍCONE
                          ========================================= */}
  
                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          flex-shrink-0
                          items-center
                          justify-center
                          rounded-xl
  
                          ${
                            ehImagem
                              ? `
                                bg-blue-50
                                text-blue-600
                              `
                              : `
                                bg-violet-50
                                text-violet-600
                              `
                          }
                        `}
                      >
  
                        {ehImagem ? (
  
                          <Image className="h-5 w-5" />
  
                        ) : (
  
                          <FileText className="h-5 w-5" />
  
                        )}
  
                      </div>
  
  
                      {/* =========================================
                          CONTEÚDO
                          ========================================= */}
  
                      <div className="min-w-0 flex-1">
  
  
                        {/* =======================================
                            NOME
                            ======================================= */}
  
                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >
  
                          <p
                            className="
                              break-all
                              text-sm
                              font-semibold
                              text-gray-800
                            "
                          >
                            {documento.fileName}
                          </p>
  
  
                          {documento.isCompletionEvidence && (
  
                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-full
                                bg-green-50
                                px-2
                                py-0.5
                                text-[10px]
                                font-medium
                                text-green-700
                              "
                            >
  
                              <CheckCircle2 className="h-3 w-3" />
  
                              Evidência de conclusão
  
                            </span>
  
                          )}
  
                        </div>
  
  
                        {/* =======================================
                            TIPO / TAMANHO
                            ======================================= */}
  
                        <div
                          className="
                            mt-1
                            flex
                            flex-wrap
                            items-center
                            gap-2
                            text-xs
                            text-gray-400
                          "
                        >
  
                          <span>
                            {ehImagem
                              ? 'Imagem'
                              : 'Documento'}
                          </span>
  
  
                          {tamanhoFormatado && (
                            <>
                              <span>
                                •
                              </span>
  
                              <span>
                                {tamanhoFormatado}
                              </span>
                            </>
                          )}
  
                        </div>
  
  
                        {/* =======================================
                            ORIGEM
                            ======================================= */}
  
                        <div
                          className="
                            mt-4
                            grid
                            grid-cols-1
                            gap-3
                            lg:grid-cols-2
                          "
                        >
  
  
                          {/* =====================================
                              TAREFA
                              ===================================== */}
  
                          {documento.taskTitle && (
  
                            <div
                              className="
                                rounded-lg
                                border
                                border-gray-100
                                bg-slate-50
                                px-3
                                py-2.5
                              "
                            >
  
                              <div
                                className="
                                  flex
                                  items-center
                                  gap-1.5
                                  text-[10px]
                                  font-semibold
                                  uppercase
                                  tracking-wide
                                  text-gray-400
                                "
                              >
  
                                <ListChecks className="h-3.5 w-3.5" />
  
                                Tarefa
  
                              </div>
  
  
                              <p
                                className="
                                  mt-1
                                  text-xs
                                  font-medium
                                  text-gray-700
                                "
                              >
  
                                {documento.taskOrder
                                  ? `${documento.taskOrder}. `
                                  : ''}
  
                                {documento.taskTitle}
  
                              </p>
  
                            </div>
  
                          )}
  
  
                          {/* =====================================
                              SUBTAREFA
                              ===================================== */}
  
                          {documento.subtaskTitle && (
  
                            <div
                              className="
                                rounded-lg
                                border
                                border-gray-100
                                bg-slate-50
                                px-3
                                py-2.5
                              "
                            >
  
                              <div
                                className="
                                  flex
                                  items-center
                                  gap-1.5
                                  text-[10px]
                                  font-semibold
                                  uppercase
                                  tracking-wide
                                  text-gray-400
                                "
                              >
  
                                <CheckCircle2 className="h-3.5 w-3.5" />
  
                                Subtarefa
  
                              </div>
  
  
                              <p
                                className="
                                  mt-1
                                  text-xs
                                  font-medium
                                  text-gray-700
                                "
                              >
  
                                {documento.taskOrder &&
                                documento.subtaskOrder
                                  ? `${documento.taskOrder}.${documento.subtaskOrder}. `
                                  : ''}
  
                                {documento.subtaskTitle}
  
                              </p>
  
                            </div>
  
                          )}
  
                        </div>
  
  
                        {/* =======================================
                            RESPONSÁVEL / DATA
                            ======================================= */}
  
                        <div
                          className="
                            mt-4
                            flex
                            flex-wrap
                            items-center
                            gap-x-5
                            gap-y-2
                            border-t
                            border-gray-100
                            pt-3
                            text-xs
                            text-gray-500
                          "
                        >
  
                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                            "
                          >
  
                            <User className="h-3.5 w-3.5" />
  
                            <span>
                              Anexado por
                            </span>
  
                            <strong
                              className="
                                font-semibold
                                text-gray-700
                              "
                            >
                              {documento.uploadedBy}
                            </strong>
  
                          </div>
  
  
                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                            "
                          >
  
                            <CalendarDays className="h-3.5 w-3.5" />
  
                            <span>
                              {formatarDataHora(
                                documento.uploadedAt
                              )}
                            </span>
  
                          </div>
  
                        </div>
  
                      </div>
  
                    </div>
  
                  </article>
  
                );
  
              }
            )}
  
          </div>
  
        )}
  
      </div>
  
    );
  }