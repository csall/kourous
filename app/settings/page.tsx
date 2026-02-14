import { SettingsContent } from "@/components/settings/SettingsContent";

export default function Settings() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-light mb-8">Réglages</h1>
                <SettingsContent />
            </div>
        </div>
    );
}
