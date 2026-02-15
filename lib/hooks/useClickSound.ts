"use client";

import { useEffect, useRef, useCallback } from "react";

export function useClickSound(enabled: boolean = true) {
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

        // Primary percussive oscillator
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "triangle"; // Softer than sine for this use case
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);

        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Add a "click" noise transient for wood-like texture
        const noise = ctx.createBufferSource();
        const bufferSize = ctx.sampleRate * 0.01; // 10ms of noise
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        noise.buffer = buffer;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.01);

        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 1500;

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        osc.start(now);
        noise.start(now);
        osc.stop(now + 0.1);
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

        // 1. Triumphant Rising Arpeggio (Fanfare style)
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4 to C6 Major
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = i === notes.length - 1 ? "sine" : "triangle";
            osc.frequency.setValueAtTime(freq, now + i * 0.08);

            gain.gain.setValueAtTime(0, now + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.8);
        });

        // 2. Synthesized "Applause" / Shimmer
        // We simulate a crowd-like noise using filtered white noise with multiple grain envelopes
        const duration = 2.5;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 3000;
        filter.Q.value = 1.0;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.5); // Warm up

        // Modulate gain to simulate individual claps (Celebratory Shimmer)
        for (let t = 0; t < duration; t += 0.06) {
            const clapStrength = 0.04 + Math.random() * 0.12;
            noiseGain.gain.setTargetAtTime(clapStrength, now + t + 0.5, 0.01);
            noiseGain.gain.setTargetAtTime(0.04, now + t + 0.5 + 0.03, 0.01);
        }

        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.5);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noise.start(now + 0.5);
        noise.stop(now + duration + 0.5);
    }, [enabled]);

    return { playClick, playSuccess, playFinalSuccess };
}
