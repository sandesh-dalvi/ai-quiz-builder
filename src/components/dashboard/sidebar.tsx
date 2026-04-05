"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, History, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quizzes", label: "My Quizzes", icon: BookOpen },
  { href: "/attempts", label: "History", icon: History },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-full bg-background text-foreground border-r border-muted-foreground/10 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-muted-foreground/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-background" />
          </div>
          <span className="font-bold text-lg tracking-tight">Quizly</span>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-md text-muted-foreground/70 hover:text-muted-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-background"
                  : "text-muted-foreground hover:bg-primary/60 hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-muted-foreground/10 text-xs text-muted-foreground/50 space-y-1 shrink-0">
        <p className="font-medium text-muted-foreground/70">Quizly</p>
        <div className="flex gap-2">
          <a
            href="https://github.com/sandesh-dalvi"
            target="_blank"
            className="hover:text-muted-foreground underline"
          >
            GitHub
          </a>
          <span>·</span>
          <a
            href="https://www.linkedin.com/in/sandesh-dalvi-35835119b/"
            target="_blank"
            className="hover:text-muted-foreground underline"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </aside>
  );
}
