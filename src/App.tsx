import { useState } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TabCards from '@/components/TabCards';
import Filters from '@/components/Filters';
import SummaryCards from '@/components/SummaryCards';
import ProjectList from '@/components/ProjectList';
import StrategicView from '@/components/StrategicView';
import {
  tabs,
  projects,
  sharedProjects,
  strategicAxes,
  summaryCardsByTab,
} from '@/data/projects';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('mine');

  const activeTabConfig = tabs.find((t) => t.id === activeTab) ?? tabs[0];
  const activeSummaryCards = summaryCardsByTab[activeTab] ?? summaryCardsByTab.mine;

  return (
    <div className="min-h-screen bg-slate-50/80">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />

      {/* Main content area — shifts based on sidebar state */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Header />

        <main className="flex-1 space-y-8 p-6 lg:p-8">
          {/* Page title + create button */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 rounded-full bg-institution-600" />
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Monitoramento de Projetos</h1>
              </div>
              <p className="mt-2 pl-4.5 text-sm text-gray-500">
                Acompanhe seus projetos, etapas, ações e indicadores.
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-institution-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-institution-700 hover:shadow-md">
              <Plus className="h-4 w-4" />
              Criar Novo Projeto
            </button>
          </div>

          {/* Tab navigation cards */}
          <TabCards tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Filters (always visible) */}
          <Filters />

          {/* Summary cards (changes per tab) */}
          <SummaryCards cards={activeSummaryCards} />

          {/* Content area — changes based on active tab */}
          {activeTab === 'mine' && (
            <ProjectList
              projects={projects}
              title={activeTabConfig.title}
              badge={activeTabConfig.badge}
            />
          )}

          {activeTab === 'shared' && (
            <ProjectList
              projects={sharedProjects}
              title={activeTabConfig.title}
              badge={activeTabConfig.badge}
              showAccess
            />
          )}

          {activeTab === 'strategic' && <StrategicView axes={strategicAxes} />}
        </main>
      </div>
    </div>
  );
}
