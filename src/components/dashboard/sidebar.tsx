"use client";

import { cn } from "@/lib/utils";
import {
  BadgeQuestionMarkIcon,
  BookOpen,
  History,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quizzes", label: "My Quizzes", icon: BookOpen },
  { href: "/attempts", label: "History", icon: History },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className=" w-60 bg-white border-r border-gray-200 flex flex-col">
      <div className=" px-6 py-4 flex items-center gap-2">
        <div className=" bg-primary w-8 h-8 rounded-full flex items-center justify-center">
          <BadgeQuestionMarkIcon className=" w-6 h-6 text-white" />
        </div>
        <span className=" font-bold text-lg">Quizly</span>
      </div>

      <nav className=" flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? " bg-primary text-primary-foreground"
                  : " text-foreground hover:bg-primary/75",
              )}
            >
              <Icon className=" w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-muted-foreground text-center">
        Quizly © {new Date().getFullYear()}
      </div>
    </aside>
  );
};

export default Sidebar;
