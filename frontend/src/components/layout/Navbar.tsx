"use client";

import { Bell, Menu, Search } from "lucide-react";

type NavbarProps = {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
};

export function Navbar({ title, subtitle, onMenuClick }: NavbarProps) {
  return (
    <header className="layout-navbar sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
              {title}
            </h1>
            {subtitle && (
              <p className="hidden truncate text-sm text-slate-400 sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <div className="relative hidden max-w-xs flex-1 sm:block lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Search metrics, campaigns..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="button"
            className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-[#0B0B0B]" />
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
              DS
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-medium text-white">Deepshikha</p>
              <p className="text-[11px] text-slate-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
