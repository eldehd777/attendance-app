import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      date: "desc",
    },
    include: {
      attendances: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">📜 지옥의 라운딩 역사</h1>
        <p className="text-muted-foreground">과거 피튀겼던 골프 행사 목록과 희생자(참석자)를 확인합니다.</p>
      </div>

      <div className="space-y-6">
        {events.length > 0 ? (
          events.map((event) => (
            <Card key={event.id} className="border-secondary/30 bg-card">
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>
                  {event.date} · 담당: {event.adminName} · 참석 인원: {event.attendances.length}명
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {event.attendances.length > 0 ? (
                    event.attendances.map((attendance) => (
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
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500 bg-white rounded-lg border">
            등록된 행사 기록이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
