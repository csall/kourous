"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LibraryBig, Settings, Timer, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ReactNode } from "react";

const navItems: Array<{ label: string; href: string; icon: LucideIcon; helper?: string }> = [
  { label: "Dashboard", href: "/", icon: Home, helper: "Vue d'ensemble" },
  { label: "Session", href: "/session", icon: Timer, helper: "Chapelet actif" },
  { label: "Bibliothèque", href: "/library", icon: LibraryBig, helper: "Prières & presets" },
  { label: "Réglages", href: "/settings", icon: Settings, helper: "Profil & rappels" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-8">
        <aside className="hidden w-64 flex-shrink-0 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_25px_60px_rgba(8,15,40,0.08)] backdrop-blur-xl lg:block">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-[0.3em] text-rose-400">Kourous</span>
            <h1 className="text-2xl font-semibold text-slate-900">Chapelet IA</h1>
            <p className="mt-2 text-sm text-slate-500">
              Sessions guidées, suivi personnalisé et rappels zen.
            </p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                    active
                      ? "bg-gradient-to-r from-rose-500/90 to-amber-300/80 text-white shadow-lg shadow-rose-200/70"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    {item.helper && (
                      <span className="text-xs font-normal text-slate-400 group-hover:text-slate-600">
                        {item.helper}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1">
          <TopBar pathname={pathname} />
          {children}
        </main>
      </div>
      <MobileNav pathname={pathname} />
    </div>
  );
}

function TopBar({ pathname }: { pathname: string }) {
  const current = navItems.find((item) => item.href === pathname);
  return (
    <header className="sticky top-4 z-10 mb-6 rounded-3xl border border-white/70 bg-white/80 px-6 py-4 shadow-[0_15px_40px_rgba(15,15,30,0.08)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Flux</p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {current?.label ?? "Kourous"}
          </h2>
          {current?.helper && <p className="text-sm text-slate-500">{current.helper}</p>}
        </div>
        <div className="rounded-2xl border border-slate-200/80 px-4 py-2 text-right text-xs text-slate-500">
          <p>Prochaine session</p>
          <p className="text-sm font-semibold text-slate-900">21:30 - Dhikr apaisé</p>
        </div>
      </div>
    </header>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-4 z-20 mx-auto flex max-w-md items-center justify-between rounded-full border border-white/60 bg-white/90 px-4 py-2 shadow-[0_20px_60px_rgba(8,15,40,0.2)] backdrop-blur-xl lg:hidden">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center rounded-full px-3 py-1 text-[11px] font-medium",
              active ? "text-rose-500" : "text-slate-400"
            )}
          >
            <Icon className="mb-1 h-5 w-5" />
            {item.label.split(" ")[0]}
          </Link>
        );
      })}
    </nav>
  );
}
