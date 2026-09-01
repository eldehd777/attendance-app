"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { name: "기록 추가", href: "/" },
  { name: "출석 통계", href: "/stats" },
  { name: "행사 히스토리", href: "/history" },
  { name: "모임 규칙", href: "/rules" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-card shadow-sm border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold text-primary flex items-center gap-2">
              <span>🔥</span> 지옥의 골프장 <span>⛳</span>
            </div>
            <div className="hidden md:flex space-x-4">
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
