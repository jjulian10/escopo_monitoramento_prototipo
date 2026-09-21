import {
  useMemo,
  useState,
} from 'react';

import {
  AlertCircle,
  Building2,
  Crown,
  LockKeyhole,
  ShieldCheck,
  Trash2,
  UserPlus,
  UserRoundMinus,
  UserRoundPlus,
  Users,
  X,
} from 'lucide-react';

import type {
  Project,
  ProjectMember,
  SystemProfile,
} from '@/data/projects';


/* ============================================================
   PROPRIEDADES
   ============================================================ */

interface ProjectTeamProps {
  projeto: Project;

  aoAdicionarMembro: (
    membro: ProjectMember
  ) => void;

  aoRemoverMembro: (
    membro: ProjectMember
  ) => void;
}


/* ============================================================
   USUÁRIOS DISPONÍVEIS NO PROTÓTIPO
   ============================================================

   Futuramente esta lista virá do backend/API.

   O perfil do sistema pertence ao usuário.

   O papel dentro do projeto NÃO será escolhido aqui:

   - quem cria o projeto = Gerente de projeto;
   - quem é adicionado posteriormente = Membro da Equipe.
   ============================================================ */

interface UsuarioDisponivel {
  id: string;

  name: string;

  unit: string;

  systemProfile: SystemProfile;
}


const usuariosDisponiveis:
  UsuarioDisponivel[] = [

  {
    id:
      'user-joao-silva',

    name:
      'João Silva',

    unit:
      'Coordenação de Infraestrutura de TI',

    systemProfile:
      'User',
  },


  {
    id:
      'user-maria-souza',

    name:
      'Maria Souza',

    unit:
      'Coordenação de Infraestrutura de TI',

    systemProfile:
      'User',
  },


  {
    id:
      'user-carlos-lima',

    name:
      'Carlos Lima',

    unit:
      'Coordenação de Infraestrutura de TI',

    systemProfile:
      'Coordenador',
  },


  {
    id:
      'user-rafael-oliveira',

    name:
      'Rafael Oliveira',

    unit:
      'Coordenação de Desenvolvimento',

    systemProfile:
      'User',
  },


  {
    id:
      'user-fernanda-costa',

    name:
      'Fernanda Costa',

    unit:
      'Coordenação de Desenvolvimento',

    systemProfile:
      'Coordenador',
  },


  {
    id:
      'user-amanda-souza',

    name:
      'Amanda Souza',

    unit:
      'Gerência de Governança',

    systemProfile:
      'User',
  },


  {
    id:
      'user-ana-costa',

    name:
      'Ana Costa',

    unit:
      'Gerência de Segurança da Informação',

    systemProfile:
      'User',
  },


  {
    id:
      'user-paulo-mendes',

    name:
      'Paulo Mendes',

    unit:
      'Gerência Administrativa',

    systemProfile:
      'Gestores',
  },

];


/* ============================================================
   INICIAIS
   ============================================================ */

function obterIniciais(
  nome: string
) {

  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (parte) =>
        parte[0]?.toUpperCase()
    )
    .join('');

}


/* ============================================================
   ESTILO DO PAPEL NO PROJETO
   ============================================================ */

function obterEstiloDoPapel(
  membro: ProjectMember
) {

  if (
    membro.projectRole ===
    'Gerente de projeto'
  ) {

    return {

      classe:
        'border-amber-200 bg-amber-50 text-amber-700',

      Icone:
        Crown,

    };

  }


  return {

    classe:
      'border-blue-200 bg-blue-50 text-blue-700',

    Icone:
      Users,

  };

}


/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function ProjectTeam({
  projeto,
  aoAdicionarMembro,
  aoRemoverMembro,
}: ProjectTeamProps) {


  /* ==========================================================
     EQUIPE
     ========================================================== */

  const equipe =
    useMemo(
      () => projeto.team ?? [],
      [projeto.team]
    );


  /* ==========================================================
     MODAL DE ADIÇÃO
     ========================================================== */

  const [
    modalAdicionarAberto,
    setModalAdicionarAberto,
  ] = useState(false);


  /* ==========================================================
     MODAL DE REMOÇÃO
     ========================================================== */

  const [
    membroParaRemover,
    setMembroParaRemover,
  ] = useState<ProjectMember | null>(
    null
  );


  /* ==========================================================
     USUÁRIO SELECIONADO PARA ADIÇÃO
     ========================================================== */

  const [
    usuarioSelecionadoId,
    setUsuarioSelecionadoId,
  ] = useState('');


  /* ==========================================================
     ERRO DO FORMULÁRIO DE ADIÇÃO
     ========================================================== */

  const [
    erroFormulario,
    setErroFormulario,
  ] = useState('');


  /* ==========================================================
     ERRO / BLOQUEIO DE REMOÇÃO
     ========================================================== */

  const [
    erroRemocao,
    setErroRemocao,
  ] = useState('');


  /* ==========================================================
     USUÁRIO SELECIONADO
     ========================================================== */

  const usuarioSelecionado =
    useMemo(
      () =>

        usuariosDisponiveis.find(
          (usuario) =>
            usuario.id ===
            usuarioSelecionadoId
        ) ??
        null,

      [
        usuarioSelecionadoId,
      ]
    );


  /* ==========================================================
     USUÁRIOS NÃO VINCULADOS
     ========================================================== */

  const usuariosNaoVinculados =
    useMemo(
      () => {

        const idsDaEquipe =
          new Set(
            equipe.map(
              (membro) =>
                membro.id
            )
          );


        return usuariosDisponiveis.filter(
          (usuario) =>
            !idsDaEquipe.has(
              usuario.id
            )
        );

      },
      [
        equipe,
      ]
    );


  /* ==========================================================
     ABRIR MODAL DE ADIÇÃO
     ========================================================== */

  function abrirModalAdicionar() {

    setUsuarioSelecionadoId(
      ''
    );


    setErroFormulario(
      ''
    );


    setModalAdicionarAberto(
      true
    );

  }


  /* ==========================================================
     FECHAR MODAL DE ADIÇÃO
     ========================================================== */

  function fecharModalAdicionar() {

    setModalAdicionarAberto(
      false
    );


    setUsuarioSelecionadoId(
      ''
    );


    setErroFormulario(
      ''
    );

  }


  /* ==========================================================
     CONFIRMAR ADIÇÃO
     ========================================================== */

  function confirmarAdicao() {

    if (
      !usuarioSelecionado
    ) {

      setErroFormulario(
        'Selecione um usuário para adicionar à equipe.'
      );

      return;

    }


    const jaEstaNaEquipe =
      equipe.some(
        (membro) =>
          membro.id ===
          usuarioSelecionado.id
      );


    if (
      jaEstaNaEquipe
    ) {

      setErroFormulario(
        'Este usuário já faz parte da equipe do projeto.'
      );

      return;

    }


    /*
     * Todo usuário adicionado posteriormente ao projeto
     * entra automaticamente como Membro da Equipe.
     *
     * O Gerente de projeto é definido durante a criação.
     */

    const novoMembro:
      ProjectMember = {

      id:
        usuarioSelecionado.id,

      name:
        usuarioSelecionado.name,

      unit:
        usuarioSelecionado.unit,

      systemProfile:
        usuarioSelecionado.systemProfile,

      projectRole:
        'Membro da Equipe',

    };


    aoAdicionarMembro(
      novoMembro
    );


    fecharModalAdicionar();

  }


  /* ==========================================================
     CONTAR VÍNCULOS DO MEMBRO
     ========================================================== */

  function obterVinculosDoMembro(
    membro: ProjectMember
  ) {

    const tarefas =
      projeto.tasks ??
      [];


    const tarefasVinculadas =
      tarefas.filter(
        (tarefa) =>

          tarefa.responsible ===
          membro.name
      );


    const subtarefasVinculadas =
      tarefas.flatMap(
        (tarefa) =>
          tarefa.subtasks ??
          []
      ).filter(
        (subtarefa) =>

          subtarefa.responsible ===
          membro.name
      );


    return {

      tarefas:
        tarefasVinculadas.length,

      subtarefas:
        subtarefasVinculadas.length,

      total:
        tarefasVinculadas.length +
        subtarefasVinculadas.length,

    };

  }


  /* ==========================================================
     SOLICITAR REMOÇÃO
     ========================================================== */

  function solicitarRemocao(
    membro: ProjectMember
  ) {


    /* --------------------------------------------------------
       GERENTE NÃO PODE SER REMOVIDO
       -------------------------------------------------------- */

    if (
      membro.projectRole ===
      'Gerente de projeto'
    ) {

      setErroRemocao(
        'O gerente do projeto não pode ser removido da equipe.'
      );

      setMembroParaRemover(
        membro
      );

      return;

    }


    /* --------------------------------------------------------
       VERIFICA TAREFAS / SUBTAREFAS
       -------------------------------------------------------- */

    const vinculos =
      obterVinculosDoMembro(
        membro
      );


    if (
      vinculos.total > 0
    ) {

      const partes:
        string[] = [];


      if (
        vinculos.tarefas > 0
      ) {

        partes.push(
          `${vinculos.tarefas} ${
            vinculos.tarefas === 1
              ? 'tarefa'
              : 'tarefas'
          }`
        );

      }


      if (
        vinculos.subtarefas > 0
      ) {

        partes.push(
          `${vinculos.subtarefas} ${
            vinculos.subtarefas === 1
              ? 'subtarefa'
              : 'subtarefas'
          }`
        );

      }


      setErroRemocao(
        `${membro.name} ainda possui ${partes.join(
          ' e '
        )} sob sua responsabilidade. Reatribua esses itens antes de remover o membro da equipe.`
      );


      setMembroParaRemover(
        membro
      );

      return;

    }


    /* --------------------------------------------------------
       LIBERADO PARA REMOÇÃO
       -------------------------------------------------------- */

    setErroRemocao(
      ''
    );


    setMembroParaRemover(
      membro
    );

  }


  /* ==========================================================
     FECHAR MODAL DE REMOÇÃO
     ========================================================== */

  function fecharModalRemocao() {

    setMembroParaRemover(
      null
    );


    setErroRemocao(
      ''
    );

  }


  /* ==========================================================
     CONFIRMAR REMOÇÃO
     ========================================================== */

  function confirmarRemocao() {

    if (
      !membroParaRemover
    ) {

      return;

    }


    if (
      membroParaRemover.projectRole ===
      'Gerente de projeto'
    ) {

      return;

    }


    const vinculos =
      obterVinculosDoMembro(
        membroParaRemover
      );


    if (
      vinculos.total > 0
    ) {

      return;

    }


    aoRemoverMembro(
      membroParaRemover
    );


    fecharModalRemocao();

  }


  /* ==========================================================
     INTERFACE
     ========================================================== */

  return (

    <>

      <div className="space-y-6">


        {/* ====================================================
            CABEÇALHO
            ==================================================== */}

        <div
          className="
            flex
            flex-wrap
            items-start
            justify-between
            gap-4
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

              <Users
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
                Equipe do Projeto
              </h2>

            </div>


            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Gerencie os usuários vinculados diretamente a este projeto.
            </p>

          </div>


          {/* ==================================================
              ADICIONAR
              ================================================== */}

          <button
            type="button"

            onClick={
              abrirModalAdicionar
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
              shadow-sm
              transition-all
              hover:bg-institution-700
              hover:shadow-md
            "
          >

            <UserPlus className="h-4 w-4" />

            Adicionar membro

          </button>

        </div>


        {/* ====================================================
            RESUMO
            ==================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >


          {/* TOTAL */}

          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-4
              shadow-sm
            "
          >

            <p
              className="
                text-xs
                font-medium
                text-gray-400
              "
            >
              Total de membros
            </p>


            <p
              className="
                mt-1
                text-2xl
                font-bold
                text-gray-800
              "
            >
              {equipe.length}
            </p>

          </div>


          {/* GERENTE */}

          <div
            className="
              rounded-xl
              border
              border-amber-100
              bg-amber-50/50
              p-4
            "
          >

            <p
              className="
                text-xs
                font-medium
                text-amber-600
              "
            >
              Gerente de projeto
            </p>


            <p
              className="
                mt-1
                text-2xl
                font-bold
                text-amber-700
              "
            >

              {
                equipe.filter(
                  (membro) =>
                    membro.projectRole ===
                    'Gerente de projeto'
                ).length
              }

            </p>

          </div>


          {/* MEMBROS */}

          <div
            className="
              rounded-xl
              border
              border-blue-100
              bg-blue-50/50
              p-4
            "
          >

            <p
              className="
                text-xs
                font-medium
                text-blue-600
              "
            >
              Membros da equipe
            </p>


            <p
              className="
                mt-1
                text-2xl
                font-bold
                text-blue-700
              "
            >

              {
                equipe.filter(
                  (membro) =>
                    membro.projectRole ===
                    'Membro da Equipe'
                ).length
              }

            </p>

          </div>

        </div>


        {/* ====================================================
            LISTA
            ==================================================== */}

        {equipe.length > 0 ? (

          <div
            className="
              grid
              grid-cols-1
              gap-4
              lg:grid-cols-2
            "
          >

            {equipe.map(
              (membro) => {


                const {
                  classe,
                  Icone,
                } =
                  obterEstiloDoPapel(
                    membro
                  );


                const ehGerente =
                  membro.projectRole ===
                  'Gerente de projeto';


                const vinculos =
                  obterVinculosDoMembro(
                    membro
                  );


                return (

                  <article
                    key={
                      membro.id
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
                        items-start
                        gap-4
                      "
                    >


                      {/* =======================================
                          AVATAR
                          ======================================= */}

                      <div
                        className="
                          flex
                          h-11
                          w-11
                          flex-shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-institution-600
                          text-sm
                          font-bold
                          text-white
                        "
                      >
                        {obterIniciais(
                          membro.name
                        )}
                      </div>


                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >


                        {/* =====================================
                            NOME + AÇÃO
                            ===================================== */}

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >

                          <div className="min-w-0">

                            <h3
                              className="
                                text-sm
                                font-semibold
                                text-gray-800
                              "
                            >
                              {membro.name}
                            </h3>


                            <p
                              className="
                                mt-1
                                text-xs
                                text-gray-500
                              "
                            >
                              {membro.unit ||
                                'Unidade não informada'}
                            </p>

                          </div>


                          {/* ===================================
                              REMOVER
                              =================================== */}

                          {ehGerente ? (

                            <div
                              className="
                                flex
                                h-8
                                w-8
                                flex-shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-amber-50
                                text-amber-500
                              "

                              title="O gerente do projeto é definido na criação e não pode ser removido."
                            >

                              <LockKeyhole className="h-4 w-4" />

                            </div>

                          ) : (

                            <button
                              type="button"

                              onClick={() =>
                                solicitarRemocao(
                                  membro
                                )
                              }

                              className="
                                flex
                                h-8
                                w-8
                                flex-shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-red-100
                                bg-red-50
                                text-red-500
                                transition-colors
                                hover:border-red-200
                                hover:bg-red-100
                                hover:text-red-700
                              "

                              title="Remover membro"
                            >

                              <Trash2 className="h-4 w-4" />

                            </button>

                          )}

                        </div>


                        {/* =====================================
                            PERFIS
                            ===================================== */}

                        <div
                          className="
                            mt-3
                            flex
                            flex-wrap
                            gap-2
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-[11px]
                              font-semibold

                              ${classe}
                            `}
                          >

                            <Icone className="h-3 w-3" />

                            {membro.projectRole}

                          </span>


                          <span
                            className="
                              inline-flex
                              items-center
                              gap-1
                              rounded-full
                              border
                              border-gray-200
                              bg-gray-50
                              px-2.5
                              py-1
                              text-[11px]
                              font-medium
                              text-gray-600
                            "
                          >

                            <ShieldCheck className="h-3 w-3" />

                            {membro.systemProfile}

                          </span>

                        </div>


                        {/* =====================================
                            RESPONSABILIDADES
                            ===================================== */}

                        {!ehGerente &&
                          vinculos.total > 0 && (

                            <p
                              className="
                                mt-3
                                text-[11px]
                                text-gray-400
                              "
                            >

                              Responsável por{' '}

                              <span
                                className="
                                  font-medium
                                  text-gray-600
                                "
                              >
                                {vinculos.total}
                              </span>{' '}

                              {vinculos.total === 1
                                ? 'item do projeto'
                                : 'itens do projeto'}

                            </p>

                          )}

                      </div>

                    </div>

                  </article>

                );

              }
            )}

          </div>

        ) : (

          <div
            className="
              rounded-xl
              border
              border-dashed
              border-gray-300
              bg-slate-50
              px-6
              py-12
              text-center
            "
          >

            <Users
              className="
                mx-auto
                h-7
                w-7
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
              Nenhum membro vinculado
            </p>


            <p
              className="
                mt-1
                text-xs
                text-gray-400
              "
            >
              Adicione usuários para compor a equipe deste projeto.
            </p>

          </div>

        )}

      </div>


      {/* ======================================================
          MODAL — ADICIONAR MEMBRO
          ====================================================== */}

      {modalAdicionarAberto && (

        <div
          className="
            fixed
            inset-0
            z-[120]
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
              max-w-xl
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >


            {/* =================================================
                CABEÇALHO
                ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-100
                px-6
                py-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-institution-50
                  "
                >

                  <UserRoundPlus
                    className="
                      h-5
                      w-5
                      text-institution-600
                    "
                  />

                </div>


                <div>

                  <h2
                    className="
                      text-base
                      font-semibold
                      text-gray-800
                    "
                  >
                    Adicionar membro
                  </h2>


                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-gray-400
                    "
                  >
                    Vincule um usuário à equipe do projeto.
                  </p>

                </div>

              </div>


              <button
                type="button"

                onClick={
                  fecharModalAdicionar
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

            </div>


            {/* =================================================
                FORMULÁRIO
                ================================================= */}

            <div
              className="
                space-y-5
                px-6
                py-6
              "
            >


              {/* ===============================================
                  USUÁRIO
                  =============================================== */}

              <div>

                <label
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-semibold
                    text-gray-600
                  "
                >
                  Usuário *
                </label>


                <select
                  value={
                    usuarioSelecionadoId
                  }

                  onChange={(evento) => {

                    setUsuarioSelecionadoId(
                      evento.target.value
                    );


                    setErroFormulario(
                      ''
                    );

                  }}

                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-gray-700
                    outline-none
                    focus:border-institution-500
                    focus:ring-2
                    focus:ring-institution-100
                  "
                >

                  <option value="">
                    Selecione um usuário
                  </option>


                  {usuariosNaoVinculados.map(
                    (usuario) => (

                      <option
                        key={
                          usuario.id
                        }

                        value={
                          usuario.id
                        }
                      >
                        {usuario.name}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* ===============================================
                  DADOS DO USUÁRIO
                  =============================================== */}

              {usuarioSelecionado && (

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-3
                    rounded-xl
                    border
                    border-gray-200
                    bg-slate-50
                    p-4
                    sm:grid-cols-2
                  "
                >

                  <div>

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

                      <Building2 className="h-3.5 w-3.5" />

                      Unidade

                    </div>


                    <p
                      className="
                        mt-1
                        text-xs
                        font-medium
                        text-gray-700
                      "
                    >
                      {usuarioSelecionado.unit}
                    </p>

                  </div>


                  <div>

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

                      <ShieldCheck className="h-3.5 w-3.5" />

                      Perfil do sistema

                    </div>


                    <p
                      className="
                        mt-1
                        text-xs
                        font-medium
                        text-gray-700
                      "
                    >
                      {usuarioSelecionado.systemProfile}
                    </p>

                  </div>

                </div>

              )}


              {/* ===============================================
                  PAPEL AUTOMÁTICO
                  =============================================== */}

              <div
                className="
                  rounded-xl
                  border
                  border-blue-100
                  bg-blue-50/50
                  px-4
                  py-3
                "
              >

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-blue-500
                  "
                >
                  Papel no projeto
                </p>


                <div
                  className="
                    mt-1
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Users
                    className="
                      h-4
                      w-4
                      text-blue-600
                    "
                  />


                  <p
                    className="
                      text-sm
                      font-semibold
                      text-blue-700
                    "
                  >
                    Membro da Equipe
                  </p>

                </div>


                <p
                  className="
                    mt-1
                    text-xs
                    text-blue-600/70
                  "
                >
                  O gerente é definido automaticamente durante a criação do projeto.
                </p>

              </div>


              {/* ===============================================
                  ERRO
                  =============================================== */}

              {erroFormulario && (

                <div
                  className="
                    flex
                    items-start
                    gap-2
                    rounded-lg
                    border
                    border-red-100
                    bg-red-50
                    px-3
                    py-2.5
                    text-xs
                    text-red-700
                  "
                >

                  <AlertCircle
                    className="
                      mt-0.5
                      h-4
                      w-4
                      flex-shrink-0
                    "
                  />

                  {erroFormulario}

                </div>

              )}


              {usuariosNaoVinculados.length === 0 && (

                <div
                  className="
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    py-3
                    text-xs
                    text-gray-500
                  "
                >
                  Todos os usuários disponíveis no protótipo já fazem parte desta equipe.
                </div>

              )}

            </div>


            {/* =================================================
                RODAPÉ
                ================================================= */}

            <div
              className="
                flex
                items-center
                justify-end
                gap-3
                border-t
                border-gray-100
                bg-slate-50/70
                px-6
                py-4
              "
            >

              <button
                type="button"

                onClick={
                  fecharModalAdicionar
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
                  confirmarAdicao
                }

                disabled={
                  usuariosNaoVinculados.length === 0
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
                  shadow-sm
                  transition-all
                  hover:bg-institution-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <UserPlus className="h-4 w-4" />

                Adicionar membro

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          MODAL — REMOVER MEMBRO
          ====================================================== */}

      {membroParaRemover && (

        <div
          className="
            fixed
            inset-0
            z-[130]
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


            {/* =================================================
                CABEÇALHO
                ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-100
                px-6
                py-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl

                    ${
                      erroRemocao
                        ? 'bg-amber-50'
                        : 'bg-red-50'
                    }
                  `}
                >

                  {erroRemocao ? (

                    <AlertCircle
                      className="
                        h-5
                        w-5
                        text-amber-600
                      "
                    />

                  ) : (

                    <UserRoundMinus
                      className="
                        h-5
                        w-5
                        text-red-600
                      "
                    />

                  )}

                </div>


                <div>

                  <h2
                    className="
                      text-base
                      font-semibold
                      text-gray-800
                    "
                  >
                    {erroRemocao
                      ? 'Não é possível remover'
                      : 'Remover membro'}
                  </h2>


                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-gray-400
                    "
                  >
                    {membroParaRemover.name}
                  </p>

                </div>

              </div>


              <button
                type="button"

                onClick={
                  fecharModalRemocao
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

            </div>


            {/* =================================================
                CONTEÚDO
                ================================================= */}

            <div
              className="
                px-6
                py-6
              "
            >

              {erroRemocao ? (

                <div
                  className="
                    rounded-xl
                    border
                    border-amber-100
                    bg-amber-50
                    px-4
                    py-4
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <AlertCircle
                      className="
                        mt-0.5
                        h-5
                        w-5
                        flex-shrink-0
                        text-amber-600
                      "
                    />


                    <div>

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-amber-800
                        "
                      >
                        Remoção bloqueada
                      </p>


                      <p
                        className="
                          mt-1
                          text-xs
                          leading-relaxed
                          text-amber-700
                        "
                      >
                        {erroRemocao}
                      </p>

                    </div>

                  </div>

                </div>

              ) : (

                <>

                  <p
                    className="
                      text-sm
                      leading-relaxed
                      text-gray-600
                    "
                  >
                    Tem certeza que deseja remover{' '}

                    <span
                      className="
                        font-semibold
                        text-gray-800
                      "
                    >
                      {membroParaRemover.name}
                    </span>{' '}

                    da equipe deste projeto?
                  </p>


                  <div
                    className="
                      mt-4
                      rounded-lg
                      border
                      border-red-100
                      bg-red-50
                      px-4
                      py-3
                      text-xs
                      text-red-700
                    "
                  >
                    Essa alteração será registrada no histórico do projeto.
                  </div>

                </>

              )}

            </div>


            {/* =================================================
                RODAPÉ
                ================================================= */}

            <div
              className="
                flex
                items-center
                justify-end
                gap-3
                border-t
                border-gray-100
                bg-slate-50/70
                px-6
                py-4
              "
            >

              <button
                type="button"

                onClick={
                  fecharModalRemocao
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
                {erroRemocao
                  ? 'Fechar'
                  : 'Cancelar'}
              </button>


              {!erroRemocao && (

                <button
                  type="button"

                  onClick={
                    confirmarRemocao
                  }

                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-red-600
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    shadow-sm
                    transition-all
                    hover:bg-red-700
                  "
                >

                  <Trash2 className="h-4 w-4" />

                  Remover membro

                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </>

  );
}
