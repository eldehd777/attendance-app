import { PrismaClient } from "@prisma/client";
import StatsClient from "./StatsClient";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const allAttendances = await prisma.attendance.findMany({
    include: {
      event: true,
    },
    orderBy: {
      event: {
        date: "desc",
      },
    },
  });

  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  const sixMonthsAgoStr = sixMonthsAgo.toISOString().split("T")[0];

  const userMap = new Map();
  for (const a of allAttendances) {
    if (!userMap.has(a.attendeeName)) {
      userMap.set(a.attendeeName, {
        name: a.attendeeName,
        count: 0,
        recentCount: 0,
        firstDate: a.event.date,
        events: []
      });
    }
    const user = userMap.get(a.attendeeName);
    user.count += 1;
    user.events.push(a.event);
    
    if (a.event.date < user.firstDate) {
      user.firstDate = a.event.date;
    }
    
    if (a.event.date >= sixMonthsAgoStr) {
      user.recentCount += 1;
    }
  }

  const formattedData = Array.from(userMap.values()).map(user => {
    // 6개월 초과 (첫 참석이 6개월보다 이전) 인데, 최근 6개월간 2회 미만인 사람
    const isHellfire = (user.firstDate <= sixMonthsAgoStr) && (user.recentCount < 2);
    return { ...user, isHellfire };
  });
  
  formattedData.sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        📊 생존자 통계 보드 💀
      </h1>
      <p className="text-muted-foreground">
        지옥의 골프 라운딩에서 끝까지 살아남아 누적 출석 횟수를 기록한 용자들입니다.<br/>
        <span className="text-destructive font-semibold">⚠️ 주의: 가입(첫 참석) 후 6개월이 지났음에도 최근 6개월 내 참석이 2회 미만인 용자는 이름에 지옥불(🔥)이 붙습니다!</span>
      </p>
      
      <StatsClient data={formattedData} />
    </div>
  );
}
