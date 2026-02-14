import { LibraryContent } from "@/components/library/LibraryContent";

export default function Library() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-light mb-8">Bibliothèque</h1>
                <LibraryContent />
            </div>
        </div>
    );
}
