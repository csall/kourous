"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import dynamic from "next/dynamic";
import { useSessionProgress } from "@/lib/hooks/useSessionProgress";
import { useClickSound } from "@/lib/hooks/useClickSound";
import { useEffect, useState, Suspense, useCallback, useRef, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, Volume2, VolumeX, RotateCcw, Vibrate, VibrateOff, Pencil } from "lucide-react";
import { FullscreenModal } from "@/components/ui/FullscreenModal";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { CompletionView } from "@/components/session/CompletionView";
import { useTranslation } from "@/lib/hooks/useTranslation";
import confetti from "canvas-confetti";
import { hapticLight, hapticMedium, hapticSuccess, hapticHeavy, hapticCelebration, hapticGravity } from "@/lib/utils/haptics";

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
  isEditing,
  setIsEditing
}: {
  isComplete: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
}) => {
  const beadColor = useSessionStore(state => state.beadColor);
  const preset = useSessionStore(state => state.preset);
  const reset = useSessionStore(state => state.reset);
  const soundEnabled = useSessionStore(state => state.soundEnabled);
  const hapticsEnabled = useSessionStore(state => state.hapticsEnabled);
  const toggleSound = useSessionStore(state => state.toggleSound);
  const toggleHaptics = useSessionStore(state => state.toggleHaptics);
  const updateFreeSession = useSessionStore(state => state.updateFreeSession);
  const currentCycle = useSessionStore(state => state.currentCycle);
  const progress = useSessionProgress();
  const { t, resolve } = useTranslation();

  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState<number | string>(33);

  useEffect(() => {
    if (preset) {
      setEditName(resolve(preset.name));
      setEditTarget(preset.sequence[0].repetitions);
    }
  }, [preset]);

  const handleSave = () => {
    // Parse editTarget safely
    const num = parseInt(editTarget.toString());

    // If invalid or < 1, do nothing (keep editing, button disabled)
    if (isNaN(num) || num < 1) return;

    // Check if we need to update state (if it was string or different number)
    if (editTarget.toString() !== num.toString() || editTarget === '') {
      setEditTarget(num);
    }
    updateFreeSession(editName, num);
    setIsEditing(false);
  };

  const handleQuickSave = (val: number) => {
    setEditTarget(val);
    updateFreeSession(editName, val);
    setIsEditing(false);
  };

  return (
    <div className="relative z-50 w-full">
      <AnimatePresence>
        {!isComplete && progress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full pt-[calc(env(safe-area-inset-top,20px)+12px)] pb-2 px-6 flex flex-col items-center gap-4 relative"
          >
            {/* Top Control Bar */}
            <div className="w-full flex items-center justify-center gap-8 pointer-events-auto">
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
              {/* Collection Name / Edit Controls */}
              {preset?.id === "free-session" ? (
                <div className="flex flex-col items-center gap-2 mb-4 w-full">
                  {isEditing ? (
                    <div
                      className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 duration-200"
                      onMouseDown={stopAllBubbles}
                      onMouseUp={stopAllBubbles}
                      onPointerDown={stopAllBubbles}
                      onPointerUp={stopAllBubbles}
                      onTouchStart={stopAllBubbles}
                      onTouchEnd={stopAllBubbles}
                      onClick={stopAllBubbles}
                    >
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 mb-1">
                        {t.session.modification}
                      </span>

                      {/* Name Input - Minimal */}
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-transparent border-b border-white/10 py-1 text-center text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 focus:outline-none focus:border-white/40 focus:text-white transition-colors mb-1"
                        placeholder={t.session.title}
                      />

                      {/* Inline Target Edit */}
                      <div className="flex items-center gap-2 p-1 rounded-full bg-white/10 border border-white/10">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={editTarget}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, ''); // Remove non-digits
                            setEditTarget(val);
                          }}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSave();
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="w-[60px] bg-transparent text-center text-sm font-bold font-mono text-white focus:outline-none"
                          placeholder=""
                          autoFocus
                          enterKeyHint="done"
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck="false"
                        />
                        <button
                          onClick={handleSave}
                          disabled={!editTarget || editTarget === '0'}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all mr-0.5 ${!editTarget || editTarget === '0'
                            ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500 hover:text-white'
                            }`}
                        >
                          {t.common.validate}
                        </button>
                      </div>

                      {/* Quick Presets - Horizontal Row */}
                      <div className="flex items-center gap-1 mt-1">
                        {[33, 99, 100, 1000].map(val => (
                          <button
                            key={val}
                            onClick={() => handleQuickSave(val)}
                            className={`px-2 py-0.5 rounded text-[9px] font-medium border transition-all ${
                              // Convert editTarget to number for comparison or string
                              parseInt(editTarget.toString()) === val
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                              }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="group flex flex-col items-center gap-1"
                    >
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 group-hover:text-white transition-colors mb-2">
                        {t.session.loop} {currentCycle || 1}
                      </span>

                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
                        <span className="text-xs font-medium text-white/80">
                          {t.session.goal} : {progress?.cycleTotal}
                        </span>
                        <Pencil size={10} className="text-white/40 group-hover:text-white/80" />
                      </div>
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {preset && preset.sequence.length > 1 && (
                    <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/40 mb-1">
                      {resolve(preset.name)}
                    </span>
                  )}

                  <h1
                    className="text-[11px] font-black tracking-[0.2em] uppercase opacity-80 leading-snug text-center max-w-[85%] mx-auto mb-6 break-words"
                    style={{ color: beadColor }}
                  >
                    {progress?.cycleTotal} <span className="opacity-50 mx-1">×</span> {resolve(progress?.label)}
                  </h1>
                </>
              )}

              {/* Counter Ring */}
              <div className="relative flex items-center justify-center h-[96px] w-[96px]">
                {/* Static Glow */}
                <motion.div
                  initial={{ opacity: 0.3, scale: 1 }}
                  animate={{ opacity: 0.3, scale: 1 }}
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: beadColor, filter: 'blur(25px)' }}
                />

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
          </motion.div >
        )}
      </AnimatePresence >
    </div >
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

  const { playClick } = useClickSound();

  const handleAdvance = useCallback(() => {
    if (isUiOpenRef.current || isCompleteRef.current) return;

    hapticLight();
    playClick();
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
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [_hydrated, _setHydrated] = useState(false);
  const hasHydrated = useSessionStore(state => state._hasHydrated);
  const { t, resolve } = useTranslation();

  useEffect(() => {
    setIsMounted(true);
    if (useSessionStore.persist.hasHydrated()) _setHydrated(true);
  }, []);

  const isActuallyHydrated = hasHydrated || _hydrated;

  const preset = useSessionStore(state => state.preset);
  const isComplete = useSessionStore(state => state.isComplete);
  const isStepComplete = useSessionStore(state => state.isStepComplete);
  const reset = useSessionStore(state => state.reset);
  const continueSession = useSessionStore(state => state.continueSession);
  const beadColor = useSessionStore(state => state.beadColor);
  const setPresetByGroupId = useSessionStore(state => state.setPresetByGroupId);
  const setPresetByInvocationId = useSessionStore(state => state.setPresetByInvocationId);
  const soundEnabled = useSessionStore(state => state.soundEnabled);
  const totalCount = useSessionStore(state => state.totalCount);

  const { playSuccess, playFinalSuccess } = useClickSound();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const setIsUiOpen = useSessionStore(state => state.setIsUiOpen);

  const isAnyModalOpen = isSettingsOpen || isEditing;
  const isAnyUIOpen = isAnyModalOpen || isComplete || isStepComplete;

  useEffect(() => {
    setIsUiOpen(isAnyUIOpen);
  }, [isAnyUIOpen, setIsUiOpen]);

  useEffect(() => {
    if (isComplete) {
      playFinalSuccess();
      hapticCelebration();
    } else if (isStepComplete) {
      // Step completion sound/haptics handled in the progress watcher below
    }
  }, [isComplete, playFinalSuccess]);

  useEffect(() => {
    if (!hasHydrated) return;
    const groupId = searchParams.get("group");
    const invocationId = searchParams.get("invocation");
    if (groupId && preset?.id !== groupId) setPresetByGroupId(groupId);
    else if (invocationId && preset?.id !== invocationId) setPresetByInvocationId(invocationId);
  }, [searchParams, setPresetByGroupId, setPresetByInvocationId, preset?.id, hasHydrated]);

  const openLibrary = useCallback(() => router.push('/library'), [router]);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);
  const progress = useSessionProgress();
  const [lastFinishedCycle, setLastFinishedCycle] = useState(-1);
  const lastTriggeredStep = useRef(-1);

  useEffect(() => {
    if (!preset || !progress) return;

    // Final completion logic is already handled in sessionStore (isComplete)
    // and triggered below.

    // Success Detection
    const isFreeSession = preset.id === "free-session";
    const currentCycle = useSessionStore.getState().currentCycle || 1;
    const isAtZero = progress.cycleProgress === 0;

    // 1. Regular Session: Trigger on isStepComplete or isComplete (when progress hits 0)
    // isStepComplete is set when totalCount reaches the end of an intermediary step.
    if (!isFreeSession && isStepComplete) {
      if (progress.cycleIndex > lastTriggeredStep.current) {
        playSuccess();
        hapticGravity();
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.2 },
          colors: [beadColor, '#ffffff']
        });
        lastTriggeredStep.current = progress.cycleIndex;
      }
    }

    // 2. Free Session: Trigger when cycleProgress hits 0 (and it's not the first bead of session)
    if (isFreeSession && isAtZero && totalCount > 0 && currentCycle !== lastFinishedCycle) {
      playSuccess();
      hapticGravity();
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.3 },
        colors: [beadColor, '#ffd700', '#ffffff']
      });
      setLastFinishedCycle(currentCycle);
    }
  }, [isStepComplete, progress, preset, lastFinishedCycle, beadColor, soundEnabled, playSuccess, totalCount]);

  const handleReset = useCallback(() => {
    setLastFinishedCycle(-1);
    lastTriggeredStep.current = -1;
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

      <SessionHeader
        isComplete={isComplete}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      {/* Main interactive area - Bead Scene area taking remaining vertical space */}
      <div className={`flex-1 relative z-0 transition-all duration-1000 ${isAnyModalOpen ? 'pointer-events-none opacity-40 blur-sm grayscale' : isComplete ? 'pointer-events-none opacity-60' : 'opacity-100'}`}>
        <div className="absolute inset-0 top-0 h-full">
          <BeadLayer />
        </div>
      </div>


      <FullscreenModal isOpen={isSettingsOpen} onClose={closeSettings} title={t.settings.title}>
        <SettingsContent />
      </FullscreenModal>

      <AnimatePresence mode="wait">
        {(isComplete || isStepComplete) && (
          <motion.div
            key={isComplete ? "complete" : "step-complete"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            onPointerDown={stopAllBubbles}
            onPointerUp={stopAllBubbles}
            onMouseDown={stopAllBubbles}
            onMouseUp={stopAllBubbles}
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-[70] w-full"
          >
            <CompletionView
              onReset={handleReset}
              onOpenLibrary={() => {
                handleReset();
                openLibrary();
              }}
              onNext={continueSession}
              isIntermediary={isStepComplete}
              presetName={isStepComplete ? resolve(progress?.label) : (resolve(preset?.name) || "Session")}
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
