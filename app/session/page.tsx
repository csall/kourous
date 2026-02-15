"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import dynamic from "next/dynamic";
import { useSessionProgress } from "@/lib/hooks/useSessionProgress";
import { useClickSound } from "@/lib/hooks/useClickSound";
import { useEffect, useState, Suspense, useCallback, useRef, memo } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Settings, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { FullscreenModal } from "@/components/ui/FullscreenModal";
import { LibraryContent } from "@/components/library/LibraryContent";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { CompletionView } from "@/components/session/CompletionView";

const BeadScene = dynamic(
  () => import("@/components/session/BeadScene").then((mod) => mod.BeadScene),
  { ssr: false }
);

// ─────────────────────────────────────────────────────────────
// LAYER 1: Header (Controls) — Completely isolated from beads.
// Only subscribes to what it needs. Never affects BeadScene.
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

  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex items-start justify-between px-6 pt-4 pointer-events-none">
      {/* Top Left: Counter, Title & Reset */}
      {!isComplete && progress && (
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1 px-4 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl shadow-lg">
              <span className="text-xl font-normal text-emerald-100 tabular-nums">
                {progress.cycleProgress}
              </span>
              <span className="text-sm text-white/20 font-light mx-0.5">/</span>
              <span className="text-sm font-light text-white/40 tabular-nums">
                {progress.cycleTotal}
              </span>
            </div>

            {totalCount > 0 && (
              <button
                onClick={reset}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-rose-500/80 backdrop-blur-xl border border-white/20 text-white shadow-lg transition-all active:scale-90"
                aria-label="Recommencer"
              >
                <RotateCcw size={18} />
              </button>
            )}
          </div>

          {showTitle && (
            <div className="pl-1">
              <p className="text-xs uppercase tracking-[0.15em] text-white/50 font-medium">
                {progress.label}
              </p>
              {progress.sublabel && (
                <p className="text-[10px] text-white/20 font-light mt-0.5 max-w-[220px]">
                  {progress.sublabel}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Top Right: Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={toggleSound}
          className="flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-xl border text-white shadow-lg transition-all active:scale-90"
          style={{
            backgroundColor: soundEnabled ? `${beadColor}99` : 'rgba(0,0,0,0.6)',
            borderColor: soundEnabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'
          }}
          aria-label={soundEnabled ? "Couper le son" : "Activer le son"}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-white/40" />}
        </button>

        <button
          onClick={onOpenLibrary}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white transition-all active:scale-90 shadow-lg"
          aria-label="Bibliothèque"
        >
          <BookOpen size={18} />
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white transition-all active:scale-90 shadow-lg"
          aria-label="Réglages"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
});

SessionHeader.displayName = "SessionHeader";

// ─────────────────────────────────────────────────────────────
// LAYER 2: Bead Scene — Pure visual, isolated state.
// Only re-renders when count, preset, or beadColor changes.
// Uses refs for callbacks so identity is ALWAYS stable.
// ─────────────────────────────────────────────────────────────
const BeadLayer = memo(() => {
  const preset = useSessionStore(state => state.preset);
  const isComplete = useSessionStore(state => state.isComplete);
  const advance = useSessionStore(state => state.advance);
  const hapticsEnabled = useSessionStore(state => state.hapticsEnabled);
  const soundEnabled = useSessionStore(state => state.soundEnabled);
  const progress = useSessionProgress();
  const { playClick } = useClickSound(soundEnabled);

  // Store mutable values in refs so the callback never changes identity
  const refs = useRef({ hapticsEnabled, soundEnabled, playClick, advance });
  refs.current = { hapticsEnabled, soundEnabled, playClick, advance };

  // STABLE callback — never changes identity, never triggers BeadScene re-render
  const handleAdvance = useCallback(() => {
    const { hapticsEnabled: h, soundEnabled: s, playClick: p, advance: a } = refs.current;
    if (h && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
    if (s) p();
    a();
  }, []); // Empty deps = stable forever

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

// BottomTitle removed — title is now inside SessionHeader below the counter

// ─────────────────────────────────────────────────────────────
// MAIN CONTAINER — Orchestrates layers, manages modals only.
// Does NOT subscribe to sound/haptics/beadColor.
// ─────────────────────────────────────────────────────────────
function SessionContent() {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkHydration = () => {
      if (useSessionStore.persist.hasHydrated()) {
        setHasHydrated(true);
      }
    };
    checkHydration();
    return useSessionStore.persist.onFinishHydration(checkHydration);
  }, []);

  const preset = useSessionStore(state => state.preset);
  const isComplete = useSessionStore(state => state.isComplete);
  const reset = useSessionStore(state => state.reset);
  const setPresetByGroupId = useSessionStore(state => state.setPresetByGroupId);
  const setPresetByInvocationId = useSessionStore(state => state.setPresetByInvocationId);

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load group or invocation from URL parameter
  useEffect(() => {
    if (!hasHydrated) return;

    const groupId = searchParams.get("group");
    const invocationId = searchParams.get("invocation");

    if (groupId && preset?.id !== groupId) {
      setPresetByGroupId(groupId);
    } else if (invocationId && preset?.id !== invocationId) {
      setPresetByInvocationId(invocationId);
    }
  }, [searchParams, setPresetByGroupId, setPresetByInvocationId, preset?.id, hasHydrated]);

  // Stable callbacks for header — never change identity
  const openLibrary = useCallback(() => setIsLibraryOpen(true), []);
  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeLibrary = useCallback(() => setIsLibraryOpen(false), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

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

  return (
    <div className="fixed inset-0 h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* ── Z-LAYER 0: 3D Bead Scene (fills entire screen, captures taps) ── */}
      <div className="absolute inset-0 z-0">
        <BeadLayer />
      </div>

      {/* ── Z-LAYER 50: Header controls (isolated, pointer-events on buttons only) ── */}
      <SessionHeader
        onOpenLibrary={openLibrary}
        onOpenSettings={openSettings}
        isComplete={isComplete}
      />

      {/* ── Z-LAYER 60: Modals ── */}
      <FullscreenModal
        isOpen={isLibraryOpen}
        onClose={closeLibrary}
        title="Bibliothèque"
      >
        <LibraryContent onSessionStart={closeLibrary} />
      </FullscreenModal>

      <FullscreenModal
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        title="Réglages"
      >
        <SettingsContent />
      </FullscreenModal>

      {/* ── Z-LAYER 70: Completion overlay ── */}
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
