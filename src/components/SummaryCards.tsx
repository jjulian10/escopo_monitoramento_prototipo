import { FolderKanban, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SummaryCardsProps {
  cards: ReadonlyArray<{
    id: string;
    label: string;
    value: number;
    description: string;
    color: string;
  }>;
}

const config: Record<
  string,
  { icon: LucideIcon; bg: string; text: string; accent: string }
> = {
  blue: { icon: FolderKanban, bg: 'bg-blue-50', text: 'text-blue-600', accent: 'border-l-blue-400' },
  amber: { icon: Activity, bg: 'bg-amber-50', text: 'text-amber-600', accent: 'border-l-amber-400' },
  green: { icon: CheckCircle2, bg: 'bg-green-50', text: 'text-green-600', accent: 'border-l-green-400' },
  red: { icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-600', accent: 'border-l-red-400' },
};

export default function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
    const c = config[card.color] ?? config.blue;
    const Icon = c.icon;
    return (
          <div
            key={card.id}
            className={`scope-summary-card scope-summary-card-${card.color} flex items-center gap-3.5 rounded-xl border border-gray-200 ${c.accent} border-l-4 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover`}
          >
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${c.bg} ${c.text}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold leading-tight text-gray-800">
                {card.value}
                <span className="ml-1.5 whitespace-nowrap text-sm font-medium text-gray-500">
  {card.label}
</span>
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
  {card.description}
</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
