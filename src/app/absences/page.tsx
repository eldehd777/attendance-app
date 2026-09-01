import { PrismaClient } from "@prisma/client";
import AbsenceClient from "./AbsenceClient";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function AbsencesPage() {
  const absences = await prisma.absence.findMany({
    orderBy: {
      count: "desc",
    },
  });

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">👻 미참여 기록부</h1>
        <p className="text-muted-foreground">
          수요조사 시 미참여한 인원들의 누적 횟수를 기록하고 관리합니다.
        </p>
      </div>
      <AbsenceClient initialData={absences} />
    </div>
  );
}
