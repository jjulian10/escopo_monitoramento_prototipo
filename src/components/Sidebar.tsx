import { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  label: string;
  icon: typeof LayoutDashboard;
  active?: boolean;
}

const menuItems: MenuItem[] = [
  { label: 'Monitoramento', icon: LayoutDashboard, active: true },
  { label: 'Minhas Solicitações', icon: ClipboardList },
  { label: 'Serviços', icon: Wrench },
  { label: 'Dashboard', icon: BarChart3 },
  { label: 'Manual SCOPE', icon: BookOpen },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('Monitoramento');

  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-screen flex-col bg-institution-900 text-white transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-white/10 px-5 py-5 ${
          collapsed ? 'justify-center px-2' : ''
        }`}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-institution-500 shadow-inner">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              SCOPE
            </span>
          </div>
          {!collapsed && (
            <span className="mt-2 pl-0.5 text-[10px] font-medium leading-tight text-institution-300">
              SISTEMA DE CONTROLE DE
              <br />
              PLANOS ESTRATÉGICOS
            </span>
          )}
        </div>
      </div>

      {/* User area label */}
      {!collapsed && (
        <div className="px-5 pt-6 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-institution-300">
            Área do Usuário
          </span>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            return (
              <li key={item.label}>
                <button
                  onClick={() => setActiveItem(item.label)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-institution-500 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-institution-800 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse button */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={onToggle}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-institution-800 hover:text-white ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Expandir' : 'Recolher'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
