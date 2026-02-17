import { SettingsContent } from "@/components/settings/SettingsContent";

export default function Settings() {
    return (
        <div className="h-[100dvh] max-h-[100dvh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden flex flex-col touch-none">
            <SettingsContent />
        </div>
    );
}
