"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EventData {
  id: string;
  name: string;
  date: string;
  adminName: string;
}

interface StatsData {
  name: string;
  count: number;
  recentCount: number;
  isHellfire: boolean;
  events: EventData[];
}

export default function StatsClient({ data }: { data: StatsData[] }) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<StatsData | null>(null);

  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input 
          type="text" 
          placeholder="이름으로 검색..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">순위</TableHead>
              <TableHead>이름 (클릭 시 상세조회)</TableHead>
              <TableHead className="text-right">총 출석 횟수</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((item, index) => {
                const isHellfire = item.isHellfire;
                return (
                  <TableRow 
                    key={item.name} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedUser(item)}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-semibold", 
                          isHellfire && "text-destructive animate-pulse"
                        )}>
                          {item.name} {isHellfire && "🔥"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {item.count}회
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24 text-slate-500">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedUser?.name}님의 출석 기록 
              {selectedUser?.isHellfire && "🔥"}
            </DialogTitle>
            <DialogDescription>
              총 {selectedUser?.count}회 참석하셨습니다. (최근 6개월: {selectedUser?.recentCount}회)
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            {selectedUser?.events.map((ev, i) => (
              <div key={i} className="flex flex-col gap-1 p-3 rounded-lg border bg-muted/30">
                <div className="font-bold">{ev.name}</div>
                <div className="text-sm text-muted-foreground">
                  {ev.date} · 담당: {ev.adminName}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
