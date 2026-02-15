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

const stopAllBubbles = (e: React.UIEvent | React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
  e.stopPropagation();
  // We don't call preventDefault here to allow button clicks to still fire their onClick
  if ('nativeEvent' in e) {
    (e.nativeEvent as any).stopImmediatePropagation?.();
  }
};

// ─────────────────────────────────────────────────────────────
// LAYER 1: Header (Controls) — Ultra Modern & Floating
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

  const blockPropagation = useCallback((e: React.UIEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none flex flex-col items-center">
      {/* 1. Ultra Modern Floating Action Menu (Borderless/SANS contour) */}
      <div className="w-full max-w-full px-4 pt-safe pt-8 flex justify-center">
        <motion.div
          layout
          onPointerDown={stopAllBubbles}
          onPointerUp={stopAllBubbles}
          onMouseDown={stopAllBubbles}
          onMouseUp={stopAllBubbles}
          onTouchStart={stopAllBubbles}
          onTouchEnd={stopAllBubbles}
          className="flex items-center gap-1.5 pointer-events-auto p-1.5 bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500 ease-out"
        >
          {/* Counter Button - Always Visible */}
          {!isComplete && progress && (
            <motion.div
              layout
              onPointerDown={stopAllBubbles}
              onPointerUp={stopAllBubbles}
              onMouseDown={stopAllBubbles}
              onMouseUp={stopAllBubbles}
              onTouchStart={stopAllBubbles}
              onTouchEnd={stopAllBubbles}
              className="group relative flex flex-col items-center justify-center w-[64px] h-[64px] rounded-[2rem] bg-white/5 transition-all duration-300"
              style={{
                backgroundColor: `${beadColor}15`,
              }}
            >
              <div
                className="absolute inset-0 rounded-[2rem] opacity-20 blur-xl"
                style={{ backgroundColor: beadColor }}
              />
              <span
                className="relative text-2xl font-bold tabular-nums leading-none tracking-tight"
                style={{ color: beadColor }}
              >
                {progress.cycleProgress}
              </span>
              <span className="relative text-[10px] font-medium text-white/30 tabular-nums mt-0.5">
                {progress.cycleTotal}
              </span>
            </motion.div>
          )}

          {/* Action Buttons Group */}
          <div className="flex items-center gap-1 px-1">
            {totalCount > 0 && (
              <button
                onClick={(e) => { stopAllBubbles(e); reset(); }}
                onPointerDown={stopAllBubbles}
                onPointerUp={stopAllBubbles}
                onMouseDown={stopAllBubbles}
                onMouseUp={stopAllBubbles}
                onTouchStart={stopAllBubbles}
                onTouchEnd={stopAllBubbles}
                className="flex items-center justify-center w-14 h-14 rounded-[1.75rem] bg-white/5 text-white/60 md:hover:bg-white/10 active:scale-90 transition-all"
                aria-label="Recommencer"
              >
                <RefreshCw size={20} className="stroke-[1.5]" />
              </button>
            )}

            <button
              onClick={(e) => { stopAllBubbles(e); toggleSound(); }}
              onPointerDown={stopAllBubbles}
              onPointerUp={stopAllBubbles}
              onMouseDown={stopAllBubbles}
              onMouseUp={stopAllBubbles}
              onTouchStart={stopAllBubbles}
              onTouchEnd={stopAllBubbles}
              className={`flex items-center justify-center w-14 h-14 rounded-[1.75rem] transition-all duration-300 ${soundEnabled
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-white/5 text-white/20'
                }`}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            <button
              onClick={(e) => { stopAllBubbles(e); onOpenLibrary(); }}
              onPointerDown={stopAllBubbles}
              onPointerUp={stopAllBubbles}
              onMouseDown={stopAllBubbles}
              onMouseUp={stopAllBubbles}
              onTouchStart={stopAllBubbles}
              onTouchEnd={stopAllBubbles}
              className="flex items-center justify-center w-14 h-14 rounded-[1.75rem] bg-white/5 text-white/60 md:hover:bg-white/10 active:scale-95 transition-all"
            >
              <BookOpen size={20} />
            </button>

            <button
              onClick={(e) => { stopAllBubbles(e); onOpenSettings(); }}
              onPointerDown={stopAllBubbles}
              onPointerUp={stopAllBubbles}
              onMouseDown={stopAllBubbles}
              onMouseUp={stopAllBubbles}
              onTouchStart={stopAllBubbles}
              onTouchEnd={stopAllBubbles}
              className="flex items-center justify-center w-14 h-14 rounded-[1.75rem] bg-white/5 text-white/60 md:hover:bg-white/10 active:scale-95 transition-all"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 2. Focused Title - Below the Menu */}
      <AnimatePresence>
        {!isComplete && progress && showTitle && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-8 px-6 text-center pointer-events-none"
          >
            <h1
              className="text-sm font-bold tracking-[0.25em] uppercase opacity-40 mb-1"
              style={{ color: beadColor }}
            >
              {progress.label}
            </h1>
            {progress.sublabel && (
              <p className="text-xs text-white/20 font-light tracking-wide max-w-[260px] leading-relaxed">
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
// LAYER 2: Bead Scene
// ─────────────────────────────────────────────────────────────
const BeadLayer = memo(() => {
  // Select strictly structural identity state (Preset)
  const presetId = useSessionStore(state => state.preset?.id || "none");
  const advance = useSessionStore(state => state.advance);
  const progress = useSessionProgress();

  // Use internal refs for interactive state to avoid re-rendering the 3D layer
  const hapticRef = useRef(useSessionStore.getState().hapticsEnabled);
  const soundRef = useRef(useSessionStore.getState().soundEnabled);
  const isUiOpenRef = useRef(useSessionStore.getState().isUiOpen);
  const isCompleteRef = useRef(useSessionStore.getState().isComplete);

  useEffect(() => {
    return useSessionStore.subscribe((state) => {
      hapticRef.current = state.hapticsEnabled;
      soundRef.current = state.soundEnabled;
      isUiOpenRef.current = state.isUiOpen;
      isCompleteRef.current = state.isComplete;
    });
  }, []);

  const { playClick } = useClickSound(true);

  const handleAdvance = useCallback(() => {
    if (isUiOpenRef.current || isCompleteRef.current) return;

    if (hapticRef.current && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
    if (soundRef.current) {
      playClick();
    }
    advance();
  }, [advance, playClick]);

  const count = progress ? progress.cycleProgress : 0;
  const total = progress?.cycleTotal || 100;

  return (
    <BeadScene
      presetId={presetId}
      count={count}
      total={total}
      onAdvance={handleAdvance}
    // Note: BeadScene now handles its own internal isUiOpen subscription for animation freezing
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
  const setIsUiOpen = useSessionStore(state => state.setIsUiOpen);

  const isAnyUIOpen = isLibraryOpen || isSettingsOpen || isComplete;

  // Global sync of UI state to store for 3D scene protection
  useEffect(() => {
    setIsUiOpen(isAnyUIOpen);
  }, [isAnyUIOpen, setIsUiOpen]);

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

      <div className={`absolute inset-0 z-0 pt-48 sm:pt-56 transition-all duration-500 ${isAnyUIOpen ? 'pointer-events-none opacity-40 blur-sm grayscale' : 'opacity-100'}`}>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            onPointerDown={stopAllBubbles}
            onPointerUp={stopAllBubbles}
            onMouseDown={stopAllBubbles}
            onMouseUp={stopAllBubbles}
            className="fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl z-[70] w-full"
          >
            <CompletionView
              onReset={reset}
              onOpenLibrary={() => {
                reset();
                openLibrary();
              }}
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
