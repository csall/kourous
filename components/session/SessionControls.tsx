"use client";

import { RefreshCw, Volume2, VolumeX, Smartphone, SmartphoneNfc } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SessionControlsProps {
  onReset: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  hapticsEnabled: boolean;
  toggleHaptics: () => void;
  className?: string; // Add className prop
}

export function SessionControls({
  onReset,
  soundEnabled,
  toggleSound,
  hapticsEnabled,
  toggleHaptics,
  className
}: SessionControlsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3 rounded-full bg-black/20 p-1.5 backdrop-blur-md border border-white/10", className)}>
      <button
        onClick={toggleSound}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full transition-all text-white/70 hover:bg-white/5 active:scale-90",
          !soundEnabled && "text-white/30"
        )}
        aria-label="Toggle sound"
      >
        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      <button
        onClick={onReset}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/90 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-90 transition-all hover:bg-rose-500"
        aria-label="Reset session"
      >
        <RefreshCw size={18} />
      </button>

      <button
        onClick={toggleHaptics}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full transition-all text-white/70 hover:bg-white/5 active:scale-90",
          !hapticsEnabled && "text-white/30"
        )}
        aria-label="Toggle haptics"
      >
        {hapticsEnabled ? <SmartphoneNfc size={16} /> : <Smartphone size={16} />}
      </button>
    </div>
  );
}
