import { PrismaClient } from "@prisma/client";
import HistoryClient from "./HistoryClient";

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
      <HistoryClient events={events} />
    </div>
  );
}
