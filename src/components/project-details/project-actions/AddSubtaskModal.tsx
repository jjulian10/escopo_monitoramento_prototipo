import { useState } from 'react';

import {
  Plus,
  X,
  ListTodo,
} from 'lucide-react';

import type {
  ProjectSubtask,
  TaskStatusType,
} from '@/data/projects';


interface AddSubtaskModalProps {
  proximaOrdem: number;

  aoFechar: () => void;

  aoCriar: (
    subtarefa: ProjectSubtask
  ) => void;
}


export default function AddSubtaskModal({
  proximaOrdem,
  aoFechar,
  aoCriar,
}: AddSubtaskModalProps) {

  const [
    titulo,
    setTitulo,
  ] = useState('');

  const [
    responsavel,
    setResponsavel,
  ] = useState('');

  const [
    status,
    setStatus,
  ] = useState<TaskStatusType>(
    'Não iniciado'
  );


  function criarSubtarefa() {

    if (!titulo.trim()) {
      return;
    }


    const novaSubtarefa: ProjectSubtask = {

      id:
        `subtask-${Date.now()}`,

      order:
        proximaOrdem,

      title:
        titulo.trim(),

      status,

      progress:
        status === 'Concluído'
          ? 100
          : 0,

      responsible:
        responsavel.trim() ||
        'Não definido',

    };


    aoCriar(
      novaSubtarefa
    );

    aoFechar();
  }


  return (

    <div
      className="
        fixed
        inset-0
        z-[110]
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
          max-w-lg
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

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

            <ListTodo className="h-5 w-5" />

            <h2 className="font-semibold">
              Nova Subtarefa
            </h2>

          </div>


          <button
            onClick={aoFechar}
            className="rounded-lg p-1.5 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>

        </header>


        <div className="space-y-5 p-6">

          <div>

            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              Nome da subtarefa
            </label>

            <input
              value={titulo}

              onChange={(e) =>
                setTitulo(
                  e.target.value
                )
              }

              placeholder="Ex.: Levantamento dos servidores"

              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                py-2.5
                text-sm
                outline-none
                focus:border-institution-500
                focus:ring-2
                focus:ring-institution-100
              "
            />

          </div>


          <div>

            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              Responsável
            </label>

            <input
              value={responsavel}

              onChange={(e) =>
                setResponsavel(
                  e.target.value
                )
              }

              placeholder="Nome do responsável"

              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                py-2.5
                text-sm
              "
            />

          </div>


          <div>

            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              Status
            </label>

            <select
              value={status}

              onChange={(e) =>
                setStatus(
                  e.target.value as TaskStatusType
                )
              }

              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-2.5
                text-sm
              "
            >

              <option>Não iniciado</option>
              <option>Em andamento</option>
              <option>Homologação</option>
              <option>Concluído</option>

            </select>

          </div>

        </div>


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
              py-2
              text-sm
            "
          >
            Cancelar
          </button>


          <button
            onClick={criarSubtarefa}

            disabled={!titulo.trim()}

            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-institution-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              disabled:opacity-40
            "
          >

            <Plus className="h-4 w-4" />

            Criar subtarefa

          </button>

        </footer>

      </div>

    </div>
  );
}