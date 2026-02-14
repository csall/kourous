"use client";

import { useEffect, useRef } from "react";

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

    const playClick = () => {
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
    };

    return { playClick };
}
