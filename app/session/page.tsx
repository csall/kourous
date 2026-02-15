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
// LAYER 1: Header (Controls) — Mobile First & Centered
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
    e.nativeEvent?.stopImmediatePropagation?.();
    setTimeout(() => reset(), 0);
  }, [reset]);

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none flex flex-col items-center">
      {/* 1. Main Action Menu Centered */}
      <div className="w-full max-w-md px-4 pt-safe pt-6 flex justify-center">
        <div className="mobile-action-bar flex items-center gap-2.5 pointer-events-auto px-1.5 py-1.5 bg-white/10 rounded-[2rem] shadow-lg backdrop-blur-2xl ring-1 ring-white/10">
          {!isComplete && progress && (
            <div
              className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl backdrop-blur-2xl border transition-all duration-200"
              style={{
                backgroundColor: `${beadColor}20`,
                borderColor: `${beadColor}40`
              }}
            >
              <span
                className="text-xl font-semibold tabular-nums leading-none"
                style={{ color: beadColor }}
              >
                {progress.cycleProgress}
              </span>
              <span className="text-[10px] font-medium text-white/40 tabular-nums mt-0.5">
                {progress.cycleTotal}
              </span>
            </div>
          )}

          {totalCount > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white/80 hover:bg-white/20 active:scale-90 transition-all"
              aria-label="Recommencer"
            >
              <RefreshCw size={22} className="stroke-[1.5]" />
            </button>
          )}

          <button
            onClick={toggleSound}
            className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all ${soundEnabled
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-white/10 text-white/40'
              }`}
          >
            {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>

          <button
            onClick={onOpenLibrary}
            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white/80"
          >
            <BookOpen size={22} />
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white/80"
          >
            <SlidersHorizontal size={22} />
          </button>
        </div>
      </div>

      {/* 2. Title Section - Placed BELOW the menu as requested */}
      {!isComplete && progress && showTitle && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 px-6 text-center pointer-events-none"
        >
          <p
            className="text-base font-semibold tracking-wide uppercase opacity-90"
            style={{ color: beadColor }}
          >
            {progress.label}
          </p>
          {progress.sublabel && (
            <p className="text-sm text-white/40 font-light mt-1 max-w-[280px]">
              {progress.sublabel}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
});

SessionHeader.displayName = "SessionHeader";

// ─────────────────────────────────────────────────────────────
// LAYER 2: Bead Scene (Same logic, position adjusted)
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

      <div className="absolute inset-0 z-0 pt-32 sm:pt-40">
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
