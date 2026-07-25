"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/clinician", label: "Dashboard" },
  { href: "/clinician/consultation", label: "Consultation" },
  { href: "/clinician/availability", label: "Availability" },
  { href: "/clinician/profile", label: "Profile" },
];

export default function ClinicianNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-indigo-100/70 bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
