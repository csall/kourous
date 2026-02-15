"use client";

import { Capacitor } from '@capacitor/core';

const isNative = () => Capacitor.isNativePlatform();
const isMobile = () => {
    if (isNative()) return true;
    if (typeof navigator === 'undefined') return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export async function hapticLight() {
    if (!isMobile()) return;
    try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
    }
}

export async function hapticMedium() {
    if (!isMobile()) return;
    try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
    }
}

export async function hapticSuccess() {
    if (!isMobile()) return;
    try {
        const { Haptics, NotificationType } = await import('@capacitor/haptics');
        await Haptics.notification({ type: NotificationType.Success });
    } catch {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([50, 50, 100]);
    }
}
