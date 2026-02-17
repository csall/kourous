"use client";

import { LibraryContent } from "@/components/library/LibraryContent";

export default function Library() {
    return (
        <div className="h-[100dvh] max-h-[100dvh] bg-background overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <LibraryContent />
            </div>
        </div>
    );
}
