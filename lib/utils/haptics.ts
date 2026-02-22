"use client";

import { Capacitor } from '@capacitor/core';
import { useSessionStore } from '../store/sessionStore';

const isNative = () => Capacitor.isNativePlatform();
const isMobile = () => {
    if (isNative()) return true;
    if (typeof navigator === 'undefined') return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export async function hapticLight() {
    if (!isMobile() || !useSessionStore.getState().hapticsEnabled) return;
    try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
    }
}

export async function hapticMedium() {
    if (!isMobile() || !useSessionStore.getState().hapticsEnabled) return;
    try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
    }
}

export async function hapticSuccess() {
    if (!isMobile() || !useSessionStore.getState().hapticsEnabled) return;
    try {
        const { Haptics, NotificationType } = await import('@capacitor/haptics');
        await Haptics.notification({ type: NotificationType.Success });
    } catch {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([60, 60, 150]);
    }
}

export async function hapticHeavy() {
    if (!isMobile() || !useSessionStore.getState().hapticsEnabled) return;
    try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(200);
    }
}

export async function hapticGravity() {
    if (!isMobile() || !useSessionStore.getState().hapticsEnabled) return;
    try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        // Initial heavy strike
        await Haptics.impact({ style: ImpactStyle.Heavy });
        // Sustained "gravity" feeling
        await Haptics.vibrate({ duration: 400 });
    } catch {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 400]);
    }
}

export async function hapticCelebration() {
    if (!isMobile() || !useSessionStore.getState().hapticsEnabled) return;
    try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        // Start with a heavy impact then the long celebration
        await Haptics.impact({ style: ImpactStyle.Heavy });
        await Haptics.vibrate({ duration: 2000 });
    } catch {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 1000]);
    }
}
