import { useSessionStore } from "@/lib/store/sessionStore";
import { SectionCard } from "@/components/ui/SectionCard";
import { useTranslation } from "@/lib/hooks/useTranslation";

export function SequenceOverview() {
  const { t, resolve } = useTranslation();
  const preset = useSessionStore((state) => state.preset);
  const totalCount = useSessionStore((state) => state.totalCount);

  if (!preset) return null;

  return (
    <SectionCard title={t.session.title} subtitle="Détails du dhikr">
      <ul className="space-y-2 text-sm text-slate-600">
        {preset.sequence.map((step, index) => {
          const consumedBefore = preset.sequence
            .slice(0, index)
            .reduce((sum, current) => sum + current.repetitions, 0);
          const remainingForStep = Math.max(totalCount - consumedBefore, 0);
          const consumed = Math.min(step.repetitions, remainingForStep);
          const progress = Math.min(1, consumed / step.repetitions);
          return (
            <li key={`${preset.id}-${typeof step.label === 'string' ? step.label : step.label.fr}`} className="space-y-1">
              <div className="flex items-center justify-between">
                <span>{resolve(step.label)}</span>
                <span className="text-xs text-slate-400">
                  {Math.max(step.repetitions - consumed, 0)} {t.common.back === 'Retour' ? 'restants' : 'remaining'}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
