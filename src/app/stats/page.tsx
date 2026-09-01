import { PrismaClient } from "@prisma/client";
import StatsClient from "./StatsClient";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const attendances = await prisma.attendance.groupBy({
    by: ["attendeeName"],
    _count: {
      eventId: true,
    },
    orderBy: {
      _count: {
        eventId: "desc",
      },
    },
  });

  const formattedData = attendances.map((item) => ({
    name: item.attendeeName,
    count: item._count.eventId,
  }));

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        📊 생존자 통계 보드 💀
      </h1>
      <p className="text-muted-foreground">지옥의 골프 라운딩에서 끝까지 살아남아 누적 출석 횟수를 기록한 용자들입니다.</p>
      
      <StatsClient data={formattedData} />
    </div>
  );
}
