import {
    Check,
  } from 'lucide-react';
  
  
  /* ============================================================
     PROPRIEDADES
     ============================================================ */
  
  interface CreateProjectStepsProps {
    etapaAtual: number;
  }
  
  
  /* ============================================================
     ETAPAS DO CADASTRO
     ============================================================ */

  interface EtapaDoCadastro {
    numero: number;
    titulo: string;
    opcional?: boolean;
  }
  
     const etapas: EtapaDoCadastro[] = [

        {
          numero: 1,
          titulo: 'Informações',
        },
      
        {
          numero: 2,
          titulo: 'Estrutura do Projeto',
        },
      
        {
          numero: 3,
          titulo: 'Revisão',
        },
      
      ];
  
  
  /* ============================================================
     COMPONENTE
     ============================================================ */
  
  export default function CreateProjectSteps({
    etapaAtual,
  }: CreateProjectStepsProps) {
  
    return (
  
      <div
        className="
          border-b
          border-gray-200
          bg-white
          px-8
          py-5
        "
      >
  
        <div
          className="
            mx-auto
            flex
            max-w-6xl
            items-start
            justify-between
          "
        >
  
          {etapas.map(
            (etapa, indice) => {
  
  
              const concluida =
                etapa.numero < etapaAtual;
  
  
              const ativa =
                etapa.numero === etapaAtual;
  
  
              return (
  
                <div
                  key={etapa.numero}
  
                  className="
                    relative
                    flex
                    flex-1
                    flex-col
                    items-center
                  "
                >
  
  
                  {/* LINHA ENTRE ETAPAS */}
  
                  {indice !== etapas.length - 1 && (
  
                    <div
                      className={`
                        absolute
                        left-1/2
                        top-4
                        h-[2px]
                        w-full
  
                        ${
                          etapa.numero < etapaAtual
                            ? 'bg-green-400'
                            : 'bg-gray-200'
                        }
                      `}
                    />
  
                  )}
  
  
                  {/* NÚMERO */}
  
                  <div
                    className={`
                      relative
                      z-10
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      text-xs
                      font-bold
                      transition-all
  
                      ${
                        concluida
                          ? `
                            bg-green-500
                            text-white
                          `
                          : ativa
                          ? `
                            bg-institution-600
                            text-white
                            shadow-sm
                          `
                          : `
                            bg-gray-100
                            text-gray-400
                          `
                      }
                    `}
                  >
  
                    {concluida ? (
  
                      <Check className="h-4 w-4" />
  
                    ) : (
  
                      etapa.numero
  
                    )}
  
                  </div>
  
  
                  {/* TÍTULO */}
  
                  <div
                    className="
                      mt-2
                      text-center
                    "
                  >
  
                    <p
                      className={`
                        text-[11px]
                        font-semibold
  
                        ${
                          ativa
                            ? 'text-gray-800'
                            : concluida
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }
                      `}
                    >
                      {etapa.titulo}
                    </p>
  
  
                    {etapa.opcional && (
  
                      <span
                        className="
                          text-[9px]
                          text-gray-400
                        "
                      >
                        opcional
                      </span>
  
                    )}
  
                  </div>
  
                </div>
  
              );
  
            }
          )}
  
        </div>
  
      </div>
  
    );
  }
