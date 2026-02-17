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
    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
      <AnimatePresence>
        {!isComplete && progress && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full pt-[env(safe-area-inset-top,20px)] px-6 flex flex-col items-center gap-1 sm:gap-2 relative"
          >
            {/* Top Controls Row: Sound - Restart - Vibrate */}
            <div className="w-full flex items-center justify-center gap-8 pointer-events-auto min-h-[48px]">
              <button
                onClick={toggleSound}
                className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${soundEnabled ? 'bg-white/10 text-white' : 'bg-transparent text-slate-500 hover:text-slate-300'}`}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  hapticMedium();
                  reset();
                }}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 text-slate-300 hover:text-white transition-all backdrop-blur-3xl group shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
              >
                <RotateCcw size={20} className="group-hover:rotate-[-45deg] transition-transform duration-500" />
              </motion.button>

              <button
                onClick={toggleHaptics}
                className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${hapticsEnabled ? 'bg-white/10 text-white' : 'bg-transparent text-slate-500 hover:text-slate-300'}`}
              >
                {hapticsEnabled ? <Vibrate size={20} /> : <VibrateOff size={20} />}
              </button>
            </div>

            {/* Collection Name */}
            <div className="w-full flex items-center justify-center pointer-events-auto min-h-[16px]">
              {preset && preset.sequence.length > 1 && (
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 truncate max-w-[250px] text-center">
                  {preset.name}
                </span>
              )}
            </div>

            <div className="flex flex-col items-center">
              {/* Title / Label */}
              <h1
                className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 leading-none mb-2"
                style={{ color: beadColor }}
              >
                <span className="tabular-nums">{progress.cycleTotal}</span> × {progress.label}
              </h1>

              {/* Circular Progress & Counter */}
              <div className="relative flex items-center justify-center h-20 w-20">
                {/* Ring Background */}
                <div className="absolute inset-0 rounded-full border border-white/[0.03] bg-white/[0.01] backdrop-blur-3xl" />

                <svg className="absolute inset-0 w-full h-full -rotate-90 p-1">
                  <circle
                    cx="50%" cy="50%" r="46%"
                    fill="none"
                    stroke={beadColor} strokeWidth="1.5"
                    className="opacity-10"
                  />
                  <motion.circle
                    cx="50%" cy="50%" r="46%"
                    fill="none"
                    stroke={beadColor} strokeWidth="2.5"
                    strokeLinecap="round" strokeDasharray="100 100"
                    pathLength="100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - (progress.cycleProgress / progress.cycleTotal * 100) }}
                    transition={{ type: "spring", stiffness: 45, damping: 15 }}
                    className="opacity-90"
                    style={{ filter: `drop-shadow(0 0 8px ${beadColor}60)` }}
                  />
                </svg>

                {/* Counter Text */}
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={progress.cycleProgress}
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.2, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex items-center justify-center"
                  >
                    <span className="text-2xl font-black tabular-nums tracking-tighter text-white">
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

      {/* Main interactive area positioned to be at the limit of the counter area */}
      <div className={`flex-1 relative z-0 mt-[14rem] sm:mt-64 transition-all duration-1000 ${isAnyUIOpen ? 'pointer-events-none opacity-40 blur-sm grayscale' : 'opacity-100'}`}>
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
