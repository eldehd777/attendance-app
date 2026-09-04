import { PrismaClient } from "@prisma/client";
import AwardsClient from "./AwardsClient";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function AwardsPage() {
  const awards = await prisma.award.findMany({
    orderBy: [
      { date: "desc" },
      { createdAt: "desc" }
    ]
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">🏆 시상 내역</h1>
        <p className="text-muted-foreground">매월 행사에서 시상한 내역을 기록하여 중복 시상을 방지합니다.</p>
      </div>
      <AwardsClient initialAwards={awards} />
    </div>
  );
}
