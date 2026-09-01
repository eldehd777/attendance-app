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

export async function updateEventAttendees(eventId: string, attendeesRaw: string) {
  const attendeeNames = attendeesRaw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const uniqueAttendeeNames = Array.from(new Set(attendeeNames));

  try {
    await prisma.$transaction([
      prisma.attendance.deleteMany({
        where: { eventId }
      }),
      ...uniqueAttendeeNames.map(name => prisma.attendance.create({
        data: {
          eventId,
          attendeeName: name
        }
      }))
    ]);

    revalidatePath("/history");
    revalidatePath("/stats");
    return { success: true };
  } catch (error) {
    console.error("Error updating attendees:", error);
    return { success: false, error: "수정 중 오류가 발생했습니다." };
  }
}

export async function deleteEvent(eventId: string, password: string) {
  // 기본 비밀번호는 7913으로 설정하고, Vercel 환경변수로 변경 가능하게 처리
  const adminPw = process.env.ADMIN_PASSWORD || "7913";
  
  if (password !== adminPw) {
    return { success: false, error: "관리자 비밀번호가 일치하지 않습니다." };
  }

  try {
    await prisma.event.delete({
      where: { id: eventId }
    });
    
    revalidatePath("/history");
    revalidatePath("/stats");
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: "삭제 중 오류가 발생했습니다." };
  }
}
