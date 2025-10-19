"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type Tab = { href: string; label: string };

const TABS: Tab[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/reviews", label: "Reviews" },
  { href: "/insights", label: "Insights" },
];

export default function TopTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-3">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={clsx(
              "rounded-full px-4 py-2 text-sm border",
              active
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
