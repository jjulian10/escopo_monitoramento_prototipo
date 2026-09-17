import { User, Users, Building2 } from 'lucide-react';
import type { TabConfig } from '@/data/projects';

interface TabCardsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const iconMap = {
  mine: User,
  shared: Users,
  strategic: Building2,
} as const;

export default function TabCards({ tabs, activeTab, onTabChange }: TabCardsProps) {
  return (
    <div className="scope-tab-grid grid grid-cols-1 gap-4 md:grid-cols-3 items-stretch">
      {tabs.map((tab) => {
        const Icon = iconMap[tab.id];
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`scope-tab-card group relative flex h-full flex-col items-start rounded-xl border p-5 text-left transition-all duration-200 ${
              isActive
                ? 'border-institution-500 bg-institution-50/60 shadow-sm ring-1 ring-institution-200'
                : 'border-gray-200 bg-white shadow-card hover:border-gray-300 hover:shadow-card-hover'
            }`}
          >
            {/* Icon + badge row */}
            <div className="mb-4 flex w-full items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? 'bg-institution-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600'
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <span
                className={`flex h-7 min-w-[28px] items-center justify-center rounded-full px-2.5 text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-institution-600 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tab.badge}
              </span>
            </div>

            {/* Title */}
            <h3
              className={`text-base font-semibold transition-colors ${
                isActive ? 'text-institution-800' : 'text-gray-800'
              }`}
            >
              {tab.title}
            </h3>

            {/* Description */}
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              {tab.description}
            </p>

            {/* Active indicator bar */}
            {isActive && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-b-xl bg-institution-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
