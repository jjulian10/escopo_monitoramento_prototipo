import {
  LayoutDashboard,
  Box,
  ClipboardList,
  Wrench,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Columns3,
} from 'lucide-react';


/* ============================================================
   TIPOS DE PÁGINA
   ============================================================ */

export type PaginaPrincipal =
  | 'monitoramento'
  | 'kanban-projetos'
  | 'solicitacoes'
  | 'servicos'
  | 'dashboard'
  | 'manual';


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface SidebarProps {
  collapsed: boolean;

  onToggle: () => void;

  paginaAtiva: PaginaPrincipal;

  aoSelecionarPagina: (
    pagina: PaginaPrincipal
  ) => void;
}


/* ============================================================
   ITEM DO MENU
   ============================================================ */

interface MenuItem {
  id: PaginaPrincipal;

  label: string;

  icon: typeof LayoutDashboard;
}


/* ============================================================
   ITENS DO MENU
   ============================================================ */

const menuItems: MenuItem[] = [

  {
    id:
      'monitoramento',

    label:
      'Monitoramento',

    icon:
      LayoutDashboard,
  },


  {
    id:
      'kanban-projetos',

    label:
      'Kanban de Projetos',

    icon:
      Columns3,
  },


  {
    id:
      'solicitacoes',

    label:
      'Minhas Solicitações',

    icon:
      ClipboardList,
  },


  {
    id:
      'servicos',

    label:
      'Serviços',

    icon:
      Wrench,
  },


  {
    id:
      'dashboard',

    label:
      'Dashboard',

    icon:
      BarChart3,
  },


  {
    id:
      'manual',

    label:
      'Manual SCOPE',

    icon:
      BookOpen,
  },

];


/* ============================================================
   COMPONENTE
   ============================================================ */

export default function Sidebar({
  collapsed,
  onToggle,
  paginaAtiva,
  aoSelecionarPagina,
}: SidebarProps) {


  return (

    <aside
      className={`
        fixed
        left-0
        top-0
        z-30
        flex
        h-screen
        flex-col
        bg-institution-900
        text-white
        transition-all
        duration-300
        ease-in-out

        ${
          collapsed
            ? 'w-20'
            : 'w-64'
        }
      `}
    >


      {/* ======================================================
          LOGO
          ====================================================== */}

      <div
        className={`
          flex
          items-center
          border-b
          border-white/10
          px-5
          py-5

          ${
            collapsed
              ? 'justify-center px-2'
              : ''
          }
        `}
      >

        <div
          className="
            flex
            flex-col
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-institution-500
                shadow-inner
              "
            >

              <Box
                className="
                  h-5
                  w-5
                  text-white
                "
              />

            </div>


            {!collapsed && (

              <span
                className="
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-white
                "
              >
                SCOPE
              </span>

            )}

          </div>


          {!collapsed && (

            <span
              className="
                mt-2
                pl-0.5
                text-[10px]
                font-medium
                leading-tight
                text-institution-300
              "
            >

              SISTEMA DE CONTROLE DE

              <br />

              PLANOS ESTRATÉGICOS

            </span>

          )}

        </div>

      </div>


      {/* ======================================================
          ÁREA DO USUÁRIO
          ====================================================== */}

      {!collapsed && (

        <div
          className="
            px-5
            pb-2
            pt-6
          "
        >

          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-institution-300
            "
          >
            Área do Usuário
          </span>

        </div>

      )}


      {/* ======================================================
          MENU
          ====================================================== */}

      <nav
        className="
          flex-1
          px-3
          py-2
        "
      >

        <ul
          className="
            space-y-1
          "
        >

          {menuItems.map(
            (item) => {


              const Icon =
                item.icon;


              const estaAtivo =
                paginaAtiva ===
                item.id;


              return (

                <li
                  key={
                    item.id
                  }
                >

                  <button
                    type="button"

                    onClick={() =>
                      aoSelecionarPagina(
                        item.id
                      )
                    }

                    className={`
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition-all

                      ${
                        estaAtivo

                          ? `
                            bg-institution-500
                            text-white
                            shadow-sm
                          `

                          : `
                            text-slate-300
                            hover:bg-institution-800
                            hover:text-white
                          `
                      }

                      ${
                        collapsed
                          ? 'justify-center'
                          : ''
                      }
                    `}

                    title={
                      collapsed
                        ? item.label
                        : undefined
                    }
                  >

                    <Icon
                      className="
                        h-5
                        w-5
                        flex-shrink-0
                      "
                    />


                    {!collapsed && (

                      <span>
                        {item.label}
                      </span>

                    )}

                  </button>

                </li>

              );

            }
          )}

        </ul>

      </nav>


      {/* ======================================================
          RECOLHER / EXPANDIR
          ====================================================== */}

      <div
        className="
          border-t
          border-white/10
          p-3
        "
      >

        <button
          type="button"

          onClick={
            onToggle
          }

          className={`
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            px-3
            py-2.5
            text-sm
            font-medium
            text-slate-400
            transition-all
            hover:bg-institution-800
            hover:text-white

            ${
              collapsed
                ? 'justify-center'
                : ''
            }
          `}

          title={
            collapsed
              ? 'Expandir'
              : 'Recolher'
          }
        >

          {collapsed ? (

            <ChevronRight
              className="
                h-5
                w-5
              "
            />

          ) : (

            <>

              <ChevronLeft
                className="
                  h-5
                  w-5
                "
              />

              <span>
                Recolher
              </span>

            </>

          )}

        </button>

      </div>

    </aside>

  );
}