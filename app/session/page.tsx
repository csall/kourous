"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import dynamic from "next/dynamic";
import Link from "next/link";
import { CompletionView } from "@/components/session/CompletionView";
import { ProgressGauge } from "@/components/session/ProgressGauge";
import { useSessionProgress } from "@/lib/hooks/useSessionProgress";
import { useClickSound } from "@/lib/hooks/useClickSound";
import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Settings } from "lucide-react";
import { FullscreenModal } from "@/components/ui/FullscreenModal";
import { LibraryContent } from "@/components/library/LibraryContent";
import { SettingsContent } from "@/components/settings/SettingsContent";

const BeadScene = dynamic(
  () => import("@/components/session/BeadScene").then((mod) => mod.BeadScene),
  { ssr: false }
);

function SessionContent() {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Wait for Zustand hydration
    const unsub = useSessionStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // Fallback if already hydrated
    if (useSessionStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return () => unsub();
  }, []);

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
    toggleSound,
    beadColor
  } = useSessionStore();

  const progress = useSessionProgress();
  const { playClick } = useClickSound(soundEnabled);
  const [showControls, setShowControls] = useState(true);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  const handleAdvance = useCallback(() => {
    setShowControls(true);
    if (hapticsEnabled && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
    if (soundEnabled) playClick();
    advance();
  }, [hapticsEnabled, soundEnabled, playClick, advance]);

  const handleRewind = useCallback(() => {
    setShowControls(true);
    if (hapticsEnabled && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(8);
    }
    rewind();
  }, [hapticsEnabled, rewind]);

  if (!isMounted || !hasHydrated) {
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

  if (!preset || !progress) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none"
      onPointerMove={() => setShowControls(true)}
    >
      {/* Top Right Navigation */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+1rem)] right-6 z-50 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLibraryOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all active:scale-90"
            aria-label="Bibliothèque"
          >
            <BookOpen size={20} />
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all active:scale-90"
            aria-label="Réglages"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Top Left Counter */}
      {!isComplete && (
        <div className="absolute top-[calc(env(safe-area-inset-top)+1rem)] left-6 z-50 pointer-events-none">
          <div className="flex items-baseline gap-1 px-4 py-2 rounded-full bg-black/20 border border-white/10 backdrop-blur-md shadow-sm">
            <span className="text-xl font-normal text-emerald-100 tabular-nums">
              {progress.cycleProgress}
            </span>
            <span className="text-sm text-white/20 font-light mx-0.5">/</span>
            <span className="text-sm font-light text-white/40 tabular-nums">
              {progress.cycleTotal}
            </span>
          </div>
        </div>
      )}

      {/* Library Modal */}
      <FullscreenModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        title="Bibliothèque"
      >
        <LibraryContent onSessionStart={() => setIsLibraryOpen(false)} />
      </FullscreenModal>

      {/* Settings Modal */}
      <FullscreenModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Réglages"
      >
        <SettingsContent />
      </FullscreenModal>

      {/* Session Controls removed as they are now in the settings modal */}



      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        {!isComplete && preset && progress && (
          <BeadScene
            presetId={preset.id}
            count={progress.cycleProgress - 1}
            total={progress.cycleTotal}
            beadColor={beadColor}
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
          className="absolute bottom-[calc(env(safe-area-inset-bottom)+6.5rem)] left-0 right-0 z-20 text-center pointer-events-none px-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={progress.label}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] // Custom ease-out expo
              }}
              className="space-y-2 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/80 pb-6 pt-12"
            >
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/95 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {progress.label}
              </h2>
              {progress.sublabel && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/50"
                >
                  {progress.sublabel}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}



      {/* Completion View */}
      <AnimatePresence mode="wait">
        {isComplete && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="fixed inset-0 flex items-center justify-center bg-slate-950/80 z-40 w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent pointer-events-none" />
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
