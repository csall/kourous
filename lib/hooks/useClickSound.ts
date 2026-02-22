"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSessionStore } from "../store/sessionStore";

export function useClickSound() {
    const enabled = useSessionStore(state => state.soundEnabled);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext on user interaction if needed, 
        // but best to just have it ready.
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass();
        }

        return () => {
            audioContextRef.current?.close();
        };
    }, []);

    const playClick = useCallback(() => {
        if (!enabled || !audioContextRef.current) return;

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        // 1. Mobile-friendly Zen Core
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(380, now); // Higher frequency to be heard on iPhone

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.02); // 20ms attack for softness
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        // 2. Tiny definition spark (helps iPhone speakers cut through)
        const spark = ctx.createOscillator();
        const sparkGain = ctx.createGain();
        spark.type = "sine";
        spark.frequency.setValueAtTime(1500, now);

        sparkGain.gain.setValueAtTime(0, now);
        sparkGain.gain.linearRampToValueAtTime(0.015, now + 0.005);
        sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        spark.connect(sparkGain);
        sparkGain.connect(ctx.destination);

        osc.start(now);
        spark.start(now);
        osc.stop(now + 0.15);
        spark.stop(now + 0.15);
    }, [enabled]);

    const playSuccess = useCallback(() => {
        if (!enabled || !audioContextRef.current) return;
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;

        // Two-note chime (C6 -> E6)
        [1046.50, 1318.51].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + i * 0.1);

            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.5);
        });
    }, [enabled]);

    const playFinalSuccess = useCallback(() => {
        if (!enabled || !audioContextRef.current) return;
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;

        // 1. Celestial Bloom (Lush Zen Chord: F# Major 9)
        // A deeply resonant and spiritual harmonic structure
        const frequencies = [185.00, 233.08, 277.18, 349.23, 440.00]; // F#3, A#3, C#4, F4, G#4

        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);

            // Slow, blooming attack (1.5s) to avoid any sudden jolt
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 1.5 + (i * 0.2));
            gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 4);
        });

        // 2. Zen Atmosphere (Subtle air texture)
        const duration = 4.0;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 400; // Very deep, muffled air

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime(0.04, now + 1);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + duration);
    }, [enabled]);

    return { playClick, playSuccess, playFinalSuccess };
}
