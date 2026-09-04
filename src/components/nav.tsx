"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { name: "기록 추가", href: "/" },
  { name: "출석 통계", href: "/stats" },
  { name: "행사 히스토리", href: "/history" },
  { name: "미참여 기록", href: "/absences" },
  { name: "시상 내역", href: "/awards" },
  { name: "모임 규칙", href: "/rules" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-card shadow-sm border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:h-16 items-start md:items-center py-4 md:py-0 justify-between gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 w-full">
            <div className="text-xl font-bold text-primary flex items-center gap-2">
              <span>🔥</span> 지옥의 골프장 <span>⛳</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
