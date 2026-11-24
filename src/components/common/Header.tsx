"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Zap, Award, BarChart3, Volume2, VolumeX, Stethoscope } from "lucide-react";
import { useTypingStore } from "@/lib/store/useTypingStore";

/** Global navigation header with active route highlighting, branding, and sound toggle. */
export const Header: React.FC = () => {
  const pathname = usePathname();
  const { soundEnabled, toggleSound } = useTypingStore();

  const navItems = [
    { href: "/academy", label: "अकॅडमी (Academy)", icon: GraduationCap },
    { href: "/sprint", label: "स्पीड स्प्रिंट (Sprint)", icon: Zap },
    { href: "/exam", label: "परीक्षा (GCC-TBC Exam)", icon: Award },
    { href: "/clinic", label: "वीक की क्लिनिक (Clinic)", icon: Stethoscope },
    { href: "/stats", label: "प्रगती (Stats)", icon: BarChart3 },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-lg shadow-md">
            म
          </div>
          <div>
            <div className="font-bold text-slate-100 text-sm leading-tight">मराठी टायपिंग</div>
            <div className="text-[10px] text-emerald-400 font-mono">InScript Academy</div>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href) ?? false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={toggleSound}
          aria-label={soundEnabled ? "Mute Sound" : "Enable Sound"}
          className="p-2 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition"
          title={soundEnabled ? "Mute Sound" : "Enable Sound"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
