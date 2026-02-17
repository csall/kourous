"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import dynamic from "next/dynamic";
import { useSessionProgress } from "@/lib/hooks/useSessionProgress";
import { useClickSound } from "@/lib/hooks/useClickSound";
import { useEffect, useState, Suspense, useCallback, useRef, memo } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, Volume2, VolumeX, RotateCcw, Vibrate, VibrateOff } from "lucide-react";
import { FullscreenModal } from "@/components/ui/FullscreenModal";
import { LibraryContent } from "@/components/library/LibraryContent";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { CompletionView } from "@/components/session/CompletionView";
import confetti from "canvas-confetti";
import { hapticLight, hapticMedium, hapticSuccess } from "@/lib/utils/haptics";

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
  isComplete,
}: {
  isComplete: boolean;
}) => {
  const beadColor = useSessionStore(state => state.beadColor);
  const preset = useSessionStore(state => state.preset);
  const reset = useSessionStore(state => state.reset);
  const soundEnabled = useSessionStore(state => state.soundEnabled);
  const hapticsEnabled = useSessionStore(state => state.hapticsEnabled);
  const toggleSound = useSessionStore(state => state.toggleSound);
  const toggleHaptics = useSessionStore(state => state.toggleHaptics);
  const progress = useSessionProgress();

  return (
    <div className="relative z-50 w-full">
      <AnimatePresence>
        {!isComplete && progress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full pt-[calc(env(safe-area-inset-top,20px)+12px)] pb-12 px-6 flex flex-col items-center gap-4 relative"
          >
            {/* Top Control Bar */}
            <div className="w-full flex items-center justify-between pointer-events-auto">
              <button
                onClick={toggleSound}
                className={`w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-xl transition-all active:scale-95 ${soundEnabled ? 'bg-white/10 text-white border border-white/10' : 'bg-white/5 text-white/30 border border-white/5'}`}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  hapticMedium();
                  reset();
                }}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white/80 transition-all backdrop-blur-xl active:bg-white/20"
              >
                <RotateCcw size={18} />
              </motion.button>

              <button
                onClick={toggleHaptics}
                className={`w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-xl transition-all active:scale-95 ${hapticsEnabled ? 'bg-white/10 text-white border border-white/10' : 'bg-white/5 text-white/30 border border-white/5'}`}
              >
                {hapticsEnabled ? <Vibrate size={18} /> : <VibrateOff size={18} />}
              </button>
            </div>

            {/* Middle: Collection & Progress Counter */}
            <div className="flex flex-col items-center gap-1">
              {preset && preset.sequence.length > 1 && (
                <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/40 mb-1">
                  {preset.name}
                </span>
              )}

              <h1
                className="text-[10px] font-black tracking-[0.45em] uppercase opacity-70 leading-none mb-6"
                style={{ color: beadColor }}
              >
                {progress.cycleTotal} × {progress.label}
              </h1>

              {/* Counter Ring */}
              <div className="relative flex items-center justify-center h-[96px] w-[96px]">
                <div className="absolute inset-0 rounded-full border border-white/[0.05] bg-white/[0.02] backdrop-blur-3xl shadow-[0_0_30px_rgba(0,0,0,0.3)]" />

                <svg className="absolute inset-0 w-full h-full -rotate-90 p-1">
                  <circle
                    cx="50%" cy="50%" r="46%"
                    fill="none"
                    stroke={beadColor} strokeWidth="2"
                    className="opacity-10"
                  />
                  <motion.circle
                    cx="50%" cy="50%" r="46%"
                    fill="none"
                    stroke={beadColor} strokeWidth="3.5"
                    strokeLinecap="round" strokeDasharray="100 100"
                    pathLength="100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - (progress.cycleProgress / progress.cycleTotal * 100) }}
                    transition={{ type: "spring", stiffness: 45, damping: 15 }}
                    style={{ filter: `drop-shadow(0 0 12px ${beadColor})` }}
                  />
                </svg>

                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={progress.cycleProgress}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="relative flex flex-col items-center"
                  >
                    <span className="text-4xl font-black tabular-nums tracking-tighter text-white">
                      {progress.cycleProgress}
                    </span>
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
  const presetId = useSessionStore(state => state.preset?.id || "none");
  const advance = useSessionStore(state => state.advance);
  const progress = useSessionProgress();

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

    if (hapticRef.current) hapticLight();
    if (soundRef.current) playClick();
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
  const beadColor = useSessionStore(state => state.beadColor);
  const setPresetByGroupId = useSessionStore(state => state.setPresetByGroupId);
  const setPresetByInvocationId = useSessionStore(state => state.setPresetByInvocationId);
  const soundEnabled = useSessionStore(state => state.soundEnabled);

  const { playSuccess, playFinalSuccess } = useClickSound(soundEnabled);

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const setIsUiOpen = useSessionStore(state => state.setIsUiOpen);

  const isAnyUIOpen = isLibraryOpen || isSettingsOpen || isComplete;

  useEffect(() => {
    setIsUiOpen(isAnyUIOpen);
  }, [isAnyUIOpen, setIsUiOpen]);

  useEffect(() => {
    if (isComplete) {
      if (soundEnabled) playFinalSuccess();
      hapticSuccess();
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
  const closeLibrary = useCallback(() => setIsLibraryOpen(false), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const progress = useSessionProgress();
  const [lastFinishedCycle, setLastFinishedCycle] = useState(-1);

  useEffect(() => {
    if (!preset || !progress) return;
    if (progress.cycleProgress === progress.cycleTotal && progress.cycleIndex > lastFinishedCycle) {
      const isIntermediary = progress.cycleIndex < (preset.sequence.length - 1);
      if (isIntermediary) {
        if (soundEnabled) playSuccess();
        hapticMedium();
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
        <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-slate-500 font-light tracking-widest uppercase text-xs">
          Kourous
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-[100dvh] max-h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden font-sans select-none flex flex-col touch-none">
      {/* Immersive mesh glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-slate-950/20">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.08, 0.15, 0.08], x: [0, 50, 0], y: [0, -50, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[15%] w-[90%] h-[70%] blur-[140px] rounded-full"
          style={{ backgroundColor: beadColor }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04], x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[10%] -left-[20%] w-[100%] h-[80%] bg-indigo-600 blur-[150px] rounded-full"
        />
      </div>

      <SessionHeader isComplete={isComplete} />

      {/* Main interactive area - Bead Scene area taking remaining vertical space */}
      <div className={`flex-1 relative z-0 transition-all duration-1000 ${isAnyUIOpen ? 'pointer-events-none opacity-40 blur-sm grayscale' : 'opacity-100'}`}>
        <div className="absolute inset-0 top-0 h-full">
          <BeadLayer />
        </div>
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
