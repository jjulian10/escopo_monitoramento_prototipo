import {
  useMemo,
  useState,
} from 'react';

import {
  Bell,
} from 'lucide-react';

import type {
  Project,
} from '@/data/projects';

import {
  gerarAlertasDePrazo,
  type AlertaPrazo,
} from '@/utils/projectAlerts';

import NotificationPanel from '@/components/notifications/NotificationPanel';


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface HeaderProps {
  projetos: Project[];

  aoSelecionarAlerta: (
    alerta: AlertaPrazo
  ) => void;
}


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function Header({
  projetos,
  aoSelecionarAlerta,
}: HeaderProps) {


  /* ==========================================================
     ESTADO DO PAINEL
     ========================================================== */

  const [
    notificacoesAbertas,
    setNotificacoesAbertas,
  ] = useState(false);


  /* ==========================================================
     GERAR ALERTAS
     ==========================================================

     Agora os alertas são gerados utilizando os projetos
     recebidos pelo App.tsx.

     Isso é importante porque:

     - projetos criados aparecem nas notificações;
     - projetos alterados aparecem atualizados;
     - mudanças no Kanban refletem nos alertas;
     - não ficamos presos aos dados iniciais do projects.ts.
     ========================================================== */

  const alertas =
    useMemo(
      () =>
        gerarAlertasDePrazo(
          projetos
        ),
      [
        projetos,
      ]
    );


  /* ==========================================================
     QUANTIDADE DE ALERTAS
     ========================================================== */

  const quantidadeDeAlertas =
    alertas.length;


  /* ==========================================================
     SELECIONAR ALERTA
     ========================================================== */

  function selecionarAlerta(
    alerta: AlertaPrazo
  ) {


    /* --------------------------------------------------------
       FECHA O PAINEL
       -------------------------------------------------------- */

    setNotificacoesAbertas(
      false
    );


    /* --------------------------------------------------------
       ENTREGA O ALERTA PARA O APP.TSX
       --------------------------------------------------------

       O App.tsx ficará responsável por:

       Projeto
       → abrir Informações

       Tarefa
       → abrir Ações do Projeto

       Subtarefa
       → abrir Kanban
       -------------------------------------------------------- */

    aoSelecionarAlerta(
      alerta
    );

  }


  /* ==========================================================
     INTERFACE
     ========================================================== */

  return (

    <header
      className="
        sticky
        top-0
        z-20
        flex
        h-16
        items-center
        justify-end
        bg-white
        px-6
        shadow-card
      "
    >

      <div
        className="
          flex
          items-center
          gap-4
        "
      >


        {/* ====================================================
            NOTIFICAÇÕES
            ==================================================== */}

        <div className="relative">

          <button
            type="button"

            onClick={() =>
              setNotificacoesAbertas(
                (aberto) =>
                  !aberto
              )
            }

            className={`
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              transition-colors

              ${
                notificacoesAbertas
                  ? `
                    bg-institution-50
                    text-institution-700
                  `
                  : `
                    text-gray-500
                    hover:bg-gray-100
                    hover:text-gray-700
                  `
              }
            `}

            title="Notificações"
          >

            <Bell className="h-5 w-5" />


            {/* ================================================
                CONTADOR DE ALERTAS
                ================================================ */}

            {quantidadeDeAlertas > 0 && (

              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  min-w-[20px]
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[10px]
                  font-bold
                  leading-none
                  text-white
                  ring-2
                  ring-white
                "
              >

                {quantidadeDeAlertas > 99
                  ? '99+'
                  : quantidadeDeAlertas}

              </span>

            )}

          </button>


          {/* ==================================================
              PAINEL DE NOTIFICAÇÕES
              ================================================== */}

          {notificacoesAbertas && (

            <NotificationPanel
              alertas={
                alertas
              }

              aoFechar={() =>
                setNotificacoesAbertas(
                  false
                )
              }

              aoSelecionarAlerta={
                selecionarAlerta
              }
            />

          )}

        </div>


        {/* ====================================================
            SEPARADOR
            ==================================================== */}

        <div
          className="
            h-8
            w-px
            bg-gray-200
          "
        />


        {/* ====================================================
            USUÁRIO
            ==================================================== */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div className="text-right">

            <p
              className="
                text-sm
                font-semibold
                leading-tight
                text-gray-800
              "
            >
              Julian Matheus de Almeida Feitosa
            </p>


            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Usuário(a)
            </p>

          </div>


          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-institution-600
              text-sm
              font-semibold
              text-white
              ring-2
              ring-institution-100
            "
          >
            JM
          </div>

        </div>

      </div>

    </header>

  );
}