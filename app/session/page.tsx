"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import { BeadScene } from "@/components/session/BeadScene";
import { SessionControls } from "@/components/session/SessionControls";
import { CompletionView } from "@/components/session/CompletionView";
import { ProgressGauge } from "@/components/session/ProgressGauge";
import { useSessionProgress } from "@/lib/hooks/useSessionProgress";
import { useClickSound } from "@/lib/hooks/useClickSound";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Settings } from "lucide-react";

function SessionContent() {
  const searchParams = useSearchParams();
  const {
    preset,
    isComplete,
    hapticsEnabled,
    soundEnabled,
    setPresetByGroupId,
    setPresetByInvocationId,
    advance,
    rewind,
    reset,
    toggleHaptics,
    toggleSound
  } = useSessionStore();

  const progress = useSessionProgress();
  const { playClick } = useClickSound(soundEnabled);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Load group or invocation from URL parameter
  useEffect(() => {
    const groupId = searchParams.get("group");
    const invocationId = searchParams.get("invocation");

    if (groupId) {
      setPresetByGroupId(groupId);
    } else if (invocationId) {
      setPresetByInvocationId(invocationId);
    }
  }, [searchParams, setPresetByGroupId, setPresetByInvocationId]);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [progress?.cycleProgress]);

  const handleAdvance = () => {
    setShowControls(true);
    if (hapticsEnabled && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
    if (soundEnabled) playClick();
    advance();
  };

  const handleRewind = () => {
    setShowControls(true);
    if (hapticsEnabled && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(8);
    }
    rewind();
  };

  if (!preset || !progress) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none"
      onPointerMove={() => setShowControls(true)}
    >
      {/* Floating Settings Icon */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute top-[calc(env(safe-area-inset-top)+1rem)] right-6 z-50 pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all active:scale-90"
        onClick={() => setShowSettings(!showSettings)}
        aria-label="Settings"
      >
        <Settings size={20} />
      </motion.button>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-light mb-6 text-white">Paramètres</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-white/90">Son</span>
                  <button
                    onClick={toggleSound}
                    className={`w-12 h-6 rounded-full transition-all ${soundEnabled ? 'bg-rose-500' : 'bg-white/20'
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-white/90">Vibrations</span>
                  <button
                    onClick={toggleHaptics}
                    className={`w-12 h-6 rounded-full transition-all ${hapticsEnabled ? 'bg-rose-500' : 'bg-white/20'
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform ${hapticsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    reset();
                    setShowSettings(false);
                  }}
                  className="w-full p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95"
                >
                  Réinitialiser la session
                </button>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="mt-6 w-full p-3 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition-all"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        {!isComplete && (
          <BeadScene
            count={progress.cycleProgress}
            total={progress.cycleTotal}
            onAdvance={handleAdvance}
            onRewind={handleRewind}
          />
        )}
      </div>

      {/* Prayer Text Overlay */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0.3 }}
          className="absolute bottom-[calc(env(safe-area-inset-bottom)+8rem)] left-0 right-0 z-20 text-center pointer-events-none px-6"
        >
          <motion.div
            key={`label-${progress.cycleProgress}`}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="space-y-2 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/80 pb-6 pt-12"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 drop-shadow-2xl">
              {progress.label}
            </h2>
            {progress.sublabel && (
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/50">
                {progress.sublabel}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Progress Gauge */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0.3 }}
          className="absolute bottom-[calc(env(safe-area-inset-bottom)+5rem)] left-0 right-0 z-20 flex justify-center pointer-events-none"
        >
          <ProgressGauge
            current={progress.cycleProgress}
            total={progress.cycleTotal}
            size={70}
            strokeWidth={4}
            color="#fb7185" // rose-400
          />
        </motion.div>
      )}

      {/* Completion View */}
      <AnimatePresence mode="wait">
        {isComplete && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full items-center justify-center bg-slate-950 z-40 relative w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent pointer-events-none" />
            <CompletionView onReset={reset} presetName={preset.name} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
      <SessionContent />
    </Suspense>
  );
}
