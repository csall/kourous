"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import dynamic from "next/dynamic";
import { useSessionProgress } from "@/lib/hooks/useSessionProgress";
import { useClickSound } from "@/lib/hooks/useClickSound";
import { useEffect, useState, Suspense, useCallback, useRef, memo } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, SlidersHorizontal, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { FullscreenModal } from "@/components/ui/FullscreenModal";
import { LibraryContent } from "@/components/library/LibraryContent";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { CompletionView } from "@/components/session/CompletionView";

const BeadScene = dynamic(
  () => import("@/components/session/BeadScene").then((mod) => mod.BeadScene),
  { ssr: false }
);

// ─────────────────────────────────────────────────────────────
// LAYER 1: Header (Controls) — Mobile First, Dynamic Spacing
// ─────────────────────────────────────────────────────────────
const SessionHeader = memo(({
  onOpenLibrary,
  onOpenSettings,
  isComplete,
}: {
  onOpenLibrary: () => void;
  onOpenSettings: () => void;
  isComplete: boolean;
}) => {
  const soundEnabled = useSessionStore(state => state.soundEnabled);
  const toggleSound = useSessionStore(state => state.toggleSound);
  const beadColor = useSessionStore(state => state.beadColor);
  const totalCount = useSessionStore(state => state.totalCount);
  const reset = useSessionStore(state => state.reset);
  const progress = useSessionProgress();
  const showTitle = useSessionStore(state => state.showTitle);

  const handleReset = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(() => reset(), 0);
  }, [reset]);

  // Calculate dynamic gap based on number of active elements
  // Elements: Counter (1) + Reset (0-1) + Sound (1) + Library (1) + Settings (1)
  const buttonCount = 4 + (totalCount > 0 ? 1 : 0);

  // Rule: Fewer buttons = more space, More buttons = tighter gap to fit small screens
  const dynamicGap = buttonCount <= 4 ? "gap-4 sm:gap-6" : "gap-2.5 sm:gap-4";
  const dynamicPadding = buttonCount <= 4 ? "px-3" : "px-2";

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none flex flex-col items-center">
      {/* 1. Main Action Menu Centered with Dynamic Spacing */}
      <div className="w-full max-w-full px-4 pt-safe pt-6 flex justify-center">
        <motion.div
          layout
          className={`mobile-action-bar flex items-center ${dynamicGap} ${dynamicPadding} pointer-events-auto py-2 bg-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl ring-1 ring-white/10 transition-all duration-300 ease-out`}
        >
          {/* 1.1 Counter (Constant) */}
          {!isComplete && progress && (
            <motion.div
              layout
              className="flex flex-col items-center justify-center w-14 h-14 rounded-[1.25rem] backdrop-blur-md border border-white/10 shadow-sm transition-all"
              style={{
                backgroundColor: `${beadColor}25`,
                borderColor: `${beadColor}40`
              }}
            >
              <span
                className="text-xl font-bold tabular-nums leading-none tracking-tight"
                style={{ color: beadColor }}
              >
                {progress.cycleProgress}
              </span>
              <span className="text-[10px] font-semibold text-white/30 tabular-nums mt-0.5">
                {progress.cycleTotal}
              </span>
            </motion.div>
          )}

          {/* 1.2 Reset (Conditional) */}
          <AnimatePresence>
            {totalCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                onClick={handleReset}
                className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 text-white/70 hover:bg-white/15 active:scale-90 transition-all overflow-hidden"
              >
                <RefreshCw size={22} className="stroke-[1.5]" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* 1.3 Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all active:scale-95 ${soundEnabled
                ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                : 'bg-white/5 text-white/30'
              }`}
          >
            {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>

          {/* 1.4 Library */}
          <button
            onClick={onOpenLibrary}
            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 text-white/70 active:scale-95 transition-all"
          >
            <BookOpen size={22} />
          </button>

          {/* 1.5 Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 text-white/70 active:scale-95 transition-all"
          >
            <SlidersHorizontal size={22} />
          </button>
        </motion.div>
      </div>

      {/* 2. Centered Title Section BELOW the Menu */}
      <AnimatePresence>
        {!isComplete && progress && showTitle && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 px-6 text-center pointer-events-none flex flex-col items-center"
          >
            <div
              className="h-1 w-12 rounded-full mb-3 opacity-30"
              style={{ backgroundColor: beadColor }}
            />
            <h1
              className="text-lg font-bold tracking-[0.15em] uppercase drop-shadow-sm"
              style={{ color: beadColor }}
            >
              {progress.label}
            </h1>
            {progress.sublabel && (
              <p className="text-sm text-white/40 font-light mt-1.5 max-w-[300px] leading-relaxed italic">
                {progress.sublabel}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

SessionHeader.displayName = "SessionHeader";

// ─────────────────────────────────────────────────────────────
// LAYER 2: Bead Scene — Visuals
// ─────────────────────────────────────────────────────────────
const BeadLayer = memo(() => {
  const preset = useSessionStore(state => state.preset);
  const isComplete = useSessionStore(state => state.isComplete);
  const advance = useSessionStore(state => state.advance);
  const hapticsEnabled = useSessionStore(state => state.hapticsEnabled);
  const soundEnabled = useSessionStore(state => state.soundEnabled);
  const progress = useSessionProgress();
  const { playClick } = useClickSound(soundEnabled);

  const refs = useRef({ hapticsEnabled, soundEnabled, playClick, advance });

  useEffect(() => {
    refs.current = { hapticsEnabled, soundEnabled, playClick, advance };
  }, [hapticsEnabled, soundEnabled, playClick, advance]);

  const handleAdvance = useCallback(() => {
    const { hapticsEnabled: h, soundEnabled: s, playClick: p, advance: a } = refs.current;
    if (h && typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(15);
    if (s) p();
    a();
  }, []);

  const count = progress ? progress.cycleProgress - 1 : 0;
  const total = progress?.cycleTotal || 100;

  return (
    <BeadScene
      presetId={preset?.id || "none"}
      count={count}
      total={total}
      onAdvance={handleAdvance}
      interactive={!isComplete}
    />
  );
});

BeadLayer.displayName = "BeadLayer";

// ─────────────────────────────────────────────────────────────
// MAIN CONTAINER
// ─────────────────────────────────────────────────────────────
function SessionContent() {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [_hydrated, _setHydrated] = useState(false);
  const hasHydrated = useSessionStore(state => state._hasHydrated);

  useEffect(() => {
    setIsMounted(true);
    if (useSessionStore.persist.hasHydrated()) _setHydrated(true);
  }, []);

  const isActuallyHydrated = hasHydrated || _hydrated;

  const preset = useSessionStore(state => state.preset);
  const isComplete = useSessionStore(state => state.isComplete);
  const reset = useSessionStore(state => state.reset);
  const setPresetByGroupId = useSessionStore(state => state.setPresetByGroupId);
  const setPresetByInvocationId = useSessionStore(state => state.setPresetByInvocationId);

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;
    const groupId = searchParams.get("group");
    const invocationId = searchParams.get("invocation");
    if (groupId && preset?.id !== groupId) setPresetByGroupId(groupId);
    else if (invocationId && preset?.id !== invocationId) setPresetByInvocationId(invocationId);
  }, [searchParams, setPresetByGroupId, setPresetByInvocationId, preset?.id, hasHydrated]);

  const openLibrary = useCallback(() => setIsLibraryOpen(true), []);
  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeLibrary = useCallback(() => setIsLibraryOpen(false), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  if (!isMounted || !isActuallyHydrated) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-slate-500 font-light tracking-widest uppercase text-xs"
        >
          Kourous
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      <SessionHeader
        onOpenLibrary={openLibrary}
        onOpenSettings={openSettings}
        isComplete={isComplete}
      />

      <div className="absolute inset-0 z-0 pt-40 sm:pt-48">
        <BeadLayer />
      </div>

      <FullscreenModal isOpen={isLibraryOpen} onClose={closeLibrary} title="Bibliothèque">
        <LibraryContent onSessionStart={closeLibrary} />
      </FullscreenModal>

      <FullscreenModal isOpen={isSettingsOpen} onClose={closeSettings} title="Réglages">
        <SettingsContent />
      </FullscreenModal>

      <AnimatePresence mode="wait">
        {isComplete && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="fixed inset-0 flex items-center justify-center bg-slate-950/80 z-[70] w-full"
          >
            <CompletionView
              onReset={reset}
              onOpenLibrary={openLibrary}
              presetName={preset?.name || "Session"}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={null}>
      <SessionContent />
    </Suspense>
  );
}
