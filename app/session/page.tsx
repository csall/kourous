"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import dynamic from "next/dynamic";
import { useSessionProgress } from "@/lib/hooks/useSessionProgress";
import { useClickSound } from "@/lib/hooks/useClickSound";
import { useEffect, useState, Suspense, useCallback, useRef, memo } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, SlidersHorizontal, RefreshCw, Volume2, VolumeX, CircleCheck } from "lucide-react";
import { FullscreenModal } from "@/components/ui/FullscreenModal";
import { LibraryContent } from "@/components/library/LibraryContent";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { CompletionView } from "@/components/session/CompletionView";
import confetti from "canvas-confetti";

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


          {/* Action Buttons Group */}
          <div className="flex items-center gap-1 px-1">
            <button
              onClick={(e) => { stopAllBubbles(e); reset(); }}
              onPointerDown={stopAllBubbles}
              onPointerUp={stopAllBubbles}
              onMouseDown={stopAllBubbles}
              onMouseUp={stopAllBubbles}
              onTouchStart={stopAllBubbles}
              onTouchEnd={stopAllBubbles}
              className="flex items-center justify-center w-14 h-14 rounded-[1.75rem] transition-all duration-300 bg-white/5 text-white/60 md:hover:bg-white/10 active:scale-90"
              aria-label="Recommencer"
            >
              <RefreshCw size={20} className="stroke-[1.5]" />
            </button>

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
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full mt-4 px-8 flex flex-col items-center text-center pointer-events-none"
          >
            <h1
              className="text-sm font-bold tracking-[0.25em] uppercase opacity-50 mb-0 leading-none"
              style={{ color: beadColor }}
            >
              <span className="tabular-nums">{progress.cycleTotal}</span> x {progress.label}
            </h1>

            {progress.sublabel && (
              <p className="text-xs text-white/20 font-light tracking-wide max-w-[260px] mx-auto leading-none mb-0 uppercase">
                {progress.sublabel}
              </p>
            )}

            <div className="flex flex-col items-center mt-2">
              <div className="relative flex items-center justify-center h-16 w-16">
                {/* Circular Progress Halo */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  {/* Background Track */}
                  {/* Background Track (Full Colored Contour) */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="46%"
                    fill={beadColor}
                    fillOpacity="0.05"
                    stroke={beadColor}
                    strokeWidth="1.5"
                    className="opacity-30"
                  />
                  {/* Active Progress Ring */}
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="46%"
                    fill="none"
                    stroke={beadColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="100 100"
                    pathLength="100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{
                      strokeDashoffset: 100 - (progress.cycleProgress / progress.cycleTotal * 100)
                    }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    className="opacity-80"
                    style={{
                      filter: `drop-shadow(0 0 6px ${beadColor}60)`
                    }}
                  />
                </svg>

                {/* Pulsing Core */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.03, 0.08, 0.03]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-2 rounded-full"
                  style={{ backgroundColor: beadColor }}
                />

                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={progress.cycleProgress}
                    initial={{ opacity: 0, scale: 0.8, y: 3 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.2, y: -3 }}
                    className="relative flex flex-col items-center"
                  >
                    {progress.cycleProgress === progress.cycleTotal ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <CircleCheck
                          size={28}
                          style={{
                            color: beadColor,
                            filter: `drop-shadow(0 0 10px ${beadColor}80)`
                          }}
                        />
                      </motion.div>
                    ) : (
                      <span
                        className="text-2xl font-black tabular-nums tracking-tight leading-none"
                        style={{
                          color: beadColor,
                          textShadow: `0 0 15px ${beadColor}40`
                        }}
                      >
                        {progress.cycleProgress}
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
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
  const advance = useSessionStore(state => state.advance);
  const beadColor = useSessionStore(state => state.beadColor);
  const setPresetByGroupId = useSessionStore(state => state.setPresetByGroupId);
  const setPresetByInvocationId = useSessionStore(state => state.setPresetByInvocationId);
  const soundEnabled = useSessionStore(state => state.soundEnabled);

  const { playSuccess, playFinalSuccess } = useClickSound(soundEnabled);

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const setIsUiOpen = useSessionStore(state => state.setIsUiOpen);

  const isAnyUIOpen = isLibraryOpen || isSettingsOpen || isComplete;

  // Global sync of UI state to store for 3D scene protection
  useEffect(() => {
    setIsUiOpen(isAnyUIOpen);
  }, [isAnyUIOpen, setIsUiOpen]);

  // Handle final completion sound
  useEffect(() => {
    if (isComplete && soundEnabled) {
      playFinalSuccess();
    }
  }, [isComplete, soundEnabled, playFinalSuccess]);

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

  const progress = useSessionProgress();

  const [lastFinishedCycle, setLastFinishedCycle] = useState(-1);

  useEffect(() => {
    if (!preset || !progress) return;

    // Check if we just finished a cycle
    if (progress.cycleProgress === progress.cycleTotal && progress.cycleIndex > lastFinishedCycle) {
      const isIntermediary = progress.cycleIndex < (preset.sequence.length - 1);

      if (isIntermediary) {
        // Play success sound for intermediate step
        if (soundEnabled) {
          playSuccess();
        }

        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.2 },
          colors: [beadColor, '#ffffff']
        });
      }

      setLastFinishedCycle(progress.cycleIndex);
    }
  }, [progress, preset, lastFinishedCycle, beadColor, soundEnabled, playSuccess]);


  const handleReset = useCallback(() => {
    setLastFinishedCycle(-1);
    reset();
  }, [reset]);

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
              onReset={handleReset}
              onOpenLibrary={() => {
                handleReset();
                openLibrary();
              }}
              presetName={preset?.name || "Session"}
              beadColor={beadColor}
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
