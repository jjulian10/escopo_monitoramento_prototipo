import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-end bg-white px-6 shadow-card">
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Separator */}
        <div className="h-8 w-px bg-gray-200" />

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              Julian Matheus de Almeida Feitosa
            </p>
            <p className="text-xs text-gray-500">Usuário(a)</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-institution-600 text-sm font-semibold text-white ring-2 ring-institution-100">
            JM
          </div>
        </div>
      </div>
    </header>
  );
}
