import { SectionCard } from "@/components/ui/SectionCard";

const metrics = [
  { label: "Minutes méditées", value: "148", trend: "+18%" },
  { label: "Sessions cette semaine", value: "12", trend: "Stable" },
  { label: "Streak actuel", value: "6 jours", trend: "+2" },
];

export function MetricsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {metrics.map((metric) => (
        <SectionCard key={metric.label} title={metric.label}>
          <div className="text-3xl font-semibold text-slate-900">{metric.value}</div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{metric.trend}</p>
        </SectionCard>
      ))}
    </div>
  );
}
