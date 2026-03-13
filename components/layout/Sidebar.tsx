"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Flame,
  History,
  Settings,
  Zap,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "All Leads", href: "/leads", icon: Users },
  { name: "Hot Leads", href: "/leads/hot", icon: Flame },
  { name: "Pipeline Runs", href: "/runs", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-taupe/20 bg-soft-white">
      <div className="flex h-20 items-center px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Zap className="h-6 w-6 text-warm-gold" />
          <span className="font-heading text-2xl font-semibold tracking-tight text-charcoal">
            Femnique
          </span>
        </Link>
      </div>

      <div className="px-4 pb-2">
        <p className="px-4 text-[10px] font-medium uppercase tracking-[0.2em] text-taupe">
          Pipeline
        </p>
      </div>

      <nav className="flex-1 space-y-0.5 px-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-warm-gold/10 text-warm-gold"
                  : "text-taupe hover:bg-cream hover:text-charcoal"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive
                    ? "text-warm-gold"
                    : "text-taupe group-hover:text-charcoal"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-taupe/10 p-6">
        <p className="text-[11px] text-taupe">
          NPI Lead Acquisition
        </p>
        <p className="mt-0.5 text-[10px] text-muted-brand">
          Texas · Wellness & Aesthetics
        </p>
      </div>
    </aside>
  );
}
