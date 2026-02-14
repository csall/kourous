"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import dynamic from "next/dynamic";
import Link from "next/link";
import { CompletionView } from "@/components/session/CompletionView";
import { ProgressGauge } from "@/components/session/ProgressGauge";
import { useSessionProgress } from "@/lib/hooks/useSessionProgress";
import { useClickSound } from "@/lib/hooks/useClickSound";
import { useEffect, useState, Suspense } from "react";
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
    toggleSound
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
          className="absolute bottom-[calc(env(safe-area-inset-bottom)+3.5rem)] left-0 right-0 z-20 flex justify-center pointer-events-none"
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
