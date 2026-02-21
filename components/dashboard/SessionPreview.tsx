"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useMemo } from "react";
import { SectionCard } from "@/components/ui/SectionCard";
import { prayerPresets } from "@/lib/data/prayerPresets";
import { useTranslation } from "@/lib/hooks/useTranslation";

export function SessionPreview() {
  const { t, resolve } = useTranslation();
  const featured = useMemo(() => prayerPresets[0], []);

  return (
    <SectionCard title={t.home.progression} subtitle="Continue où tu t'es arrêté">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative h-40 w-40 rounded-full bg-gradient-to-br from-rose-500 to-amber-200 p-1"
        >
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white/80 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-400">Complété</p>
            <span className="text-4xl font-semibold text-slate-900">48%</span>
            <p className="text-xs text-slate-500">{featured.totalBeads} grains</p>
          </div>
        </motion.div>
        <div className="flex-1 space-y-3">
          <h4 className="text-xl font-semibold text-slate-900">{resolve(featured.name)}</h4>
          <p className="text-sm text-slate-500">{resolve(featured.description)}</p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            {featured.sequence.map((step) => (
              <span
                key={typeof step.label === 'string' ? step.label : step.label.fr}
                className="rounded-full border border-rose-100/80 bg-rose-50/80 px-3 py-1 text-rose-600"
              >
                {resolve(step.label)} · {step.repetitions}
              </span>
            ))}
          </div>
          <Link
            href="/session"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-slate-900/10"
          >
            <Play className="h-4 w-4" /> {t.library.launch}
          </Link>
        </div>
      </div>
    </SectionCard>
  );
}
