"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function addEventWithAttendances(formData: FormData) {
  const date = formData.get("date") as string;
  const name = formData.get("name") as string;
  const adminName = formData.get("adminName") as string;
  const attendeesRaw = formData.get("attendees") as string;

  if (!date || !name || !adminName || !attendeesRaw) {
    throw new Error("모든 필드를 입력해주세요.");
  }

  // 쉼표 또는 줄바꿈으로 분리하고 양옆 공백 제거 후 빈 문자열 필터링
  const attendeeNames = attendeesRaw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // 중복 이름 제거 (한 행사에 같은 사람이 두 번 체크되지 않도록)
  const uniqueAttendeeNames = Array.from(new Set(attendeeNames));

  try {
    const event = await prisma.event.create({
      data: {
        date,
        name,
        adminName,
        attendances: {
          create: uniqueAttendeeNames.map((attendeeName) => ({
            attendeeName,
          })),
        },
      },
    });

    revalidatePath("/stats");
    revalidatePath("/history");
    return { success: true, event };
  } catch (error) {
    console.error("Error adding event:", error);
    return { success: false, error: "저장 중 오류가 발생했습니다." };
  }
}
