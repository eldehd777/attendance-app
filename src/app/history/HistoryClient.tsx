"use client";

import { useState } from "react";
import { updateEventAttendees, deleteEvent } from "../actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function EventCard({ event }: { event: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendeesRaw, setAttendeesRaw] = useState(
    event.attendances.map((a: any) => a.attendeeName).join(", ")
  );

  async function handleSave() {
    setLoading(true);
    const res = await updateEventAttendees(event.id, attendeesRaw);
    setLoading(false);
    if (res.success) {
      setIsEditing(false);
    } else {
      alert(res.error || "수정 실패");
    }
  }

  async function handleDelete() {
    const pwd = window.prompt("관리자 비밀번호를 입력하세요 (기본값: 1234):");
    if (!pwd) return;
    
    setLoading(true);
    const res = await deleteEvent(event.id, pwd);
    setLoading(false);
    
    if (!res.success) {
      alert(res.error || "삭제 실패");
    }
  }

  return (
    <Card className="border-secondary/30 bg-card">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <CardTitle>{event.name}</CardTitle>
          <CardDescription className="mt-1">
            {event.date} · 담당: {event.adminName} · 참석 인원: {event.attendances.length}명
          </CardDescription>
        </div>
        {!isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} disabled={loading}>
              명단 수정
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
              {loading ? "삭제 중..." : "행사 삭제"}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={loading}>
              취소
            </Button>
            <Button size="sm" onClick={handleSave} disabled={loading}>
              {loading ? "저장 중..." : "저장"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={attendeesRaw}
            onChange={(e) => setAttendeesRaw(e.target.value)}
            className="min-h-[100px] bg-background"
            placeholder="이름을 쉼표(,)나 줄바꿈으로 구분해서 입력하세요"
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {event.attendances.length > 0 ? (
              event.attendances.map((attendance: any) => (
                <span
                  key={attendance.id}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-slate-100 text-slate-900"
                >
                  {attendance.attendeeName}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">기록된 참석자가 없습니다.</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function HistoryClient({ events }: { events: any[] }) {
  return (
    <div className="space-y-6">
      {events.length > 0 ? (
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <div className="text-center py-12 text-slate-500 bg-card rounded-lg border">
          등록된 행사 기록이 없습니다.
        </div>
      )}
    </div>
  );
}
