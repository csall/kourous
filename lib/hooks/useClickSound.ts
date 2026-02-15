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

        // "Heavenly" Major 7 chord (C5, E5, G5, B5)
        [523.25, 659.25, 783.99, 987.77].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + i * 0.05);

            gain.gain.setValueAtTime(0, now + i * 0.05);
            gain.gain.linearRampToValueAtTime(0.15, now + i * 0.05 + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 1.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 2.0);
        });
    }, [enabled]);

    return { playClick, playSuccess, playFinalSuccess };
}
