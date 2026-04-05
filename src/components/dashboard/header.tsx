"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

export function Header({
  firstName,
  onMenuClick,
}: {
  firstName?: string;
  onMenuClick?: () => void;
}) {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        {firstName && (
          <p className="text-sm text-zinc-500 hidden sm:block">
            Welcome back,{" "}
            <span className="font-medium text-zinc-900">{firstName}</span> 👋
          </p>
        )}
      </div>
      <UserButton />
    </header>
  );
}
