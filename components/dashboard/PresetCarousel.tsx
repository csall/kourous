"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { prayerPresets } from "@/lib/data/prayerPresets";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/hooks/useTranslation";

export function PresetCarousel() {
  const { resolve } = useTranslation();
  return (
    <SectionCard title="Presets populaires" subtitle="Choisis ta routine">
      <div className="flex snap-x gap-4 overflow-x-auto pb-2">
        {prayerPresets.map((preset) => (
          <motion.div
            key={preset.id}
            whileHover={{ y: -4 }}
            className="min-w-[220px] snap-center rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{preset.totalBeads} grains</p>
            <h5 className="text-lg font-semibold text-slate-900">{resolve(preset.name)}</h5>
            <p className="text-sm text-slate-500">{resolve(preset.description)}</p>
            <Link href={`/session?preset=${preset.id}`} className="text-sm font-medium text-rose-500">
              Charger ce preset →
            </Link>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}
