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
import { BookOpen, Settings, RotateCcw, Volume2, VolumeX } from "lucide-react";
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
    beadColor,
    totalCount,
    showTitle
  } = useSessionStore();

  const progress = useSessionProgress();
  const { playClick } = useClickSound(soundEnabled);
  const [showControls, setShowControls] = useState(false);
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

  // Auto-hide controls after inactivity
  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 1000);
    return () => clearTimeout(timer);
  }, [progress?.cycleProgress, showControls]);

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
      className="fixed inset-0 h-[100dvh] flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none"
      onPointerMove={() => setShowControls(true)}
    >
      {/* Top Right Navigation */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+1rem)] right-6 z-50 flex items-center gap-2">
        <div className="flex items-center gap-2">

          <button
            onClick={toggleSound}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all active:scale-90"
            aria-label={soundEnabled ? "Couper le son" : "Activer le son"}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} className="text-white/40" />}
          </button>

          <button
            onClick={() => setIsLibraryOpen(true)}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all active:scale-90"
            aria-label="Bibliothèque"
          >
            <BookOpen size={20} />
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all active:scale-90"
            aria-label="Réglages"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Top Left Counter & Controls */}

      {!isComplete && (
        <div className="absolute top-[calc(env(safe-area-inset-top)+1rem)] left-6 z-50 flex flex-col items-start gap-2 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1 px-4 py-2 rounded-full bg-black/20 border border-white/10 backdrop-blur-md shadow-sm pointer-events-auto">
              <span className="text-xl font-normal text-emerald-100 tabular-nums">
                {progress.cycleProgress}
              </span>
              <span className="text-sm text-white/20 font-light mx-0.5">/</span>
              <span className="text-sm font-light text-white/40 tabular-nums">
                {progress.cycleTotal}
              </span>
            </div>

            {/* Restart Button - specific to left side */}
            {totalCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  reset();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all active:scale-90 pointer-events-auto"
                aria-label="Recommencer"
              >
                <RotateCcw size={20} />
              </button>
            )}
          </div>

          {/* Miniature Title under counter */}
          {showTitle && (
            <div className="px-1 max-w-[220px]">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium truncate">
                {progress.label}
              </p>
              {progress.sublabel && (
                <p className="text-[9px] text-white/20 font-light truncate mt-0.5">
                  {progress.sublabel}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Library Modal */}
      <FullscreenModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        title="Bibliothèque"
      >
        <div onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} className="h-full">
          <LibraryContent onSessionStart={() => setIsLibraryOpen(false)} />
        </div>
      </FullscreenModal>

      {/* Settings Modal */}
      <FullscreenModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Réglages"
      >
        <div onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} className="h-full">
          <SettingsContent />
        </div>
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
            interactive={!isLibraryOpen && !isSettingsOpen}
          />
        )}
      </div>





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
    </div >
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
      <SessionContent />
    </Suspense>
  );
}
