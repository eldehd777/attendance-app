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

  const attendeeNames = attendeesRaw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

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

export async function updateEventAttendees(eventId: string, attendeesRaw: string, password: string) {
  const adminPw = process.env.ADMIN_PASSWORD || "7913";
  if (password !== adminPw) {
    return { success: false, error: "관리자 비밀번호가 일치하지 않습니다." };
  }

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

export async function addAbsence(namesRaw: string, password: string) {
  const adminPw = process.env.ADMIN_PASSWORD || "7913";
  if (password !== adminPw) {
    return { success: false, error: "관리자 비밀번호가 일치하지 않습니다." };
  }

  try {
    const names = namesRaw
      .split(/[,\n\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (names.length === 0) return { success: false, error: "이름을 입력해주세요." };

    await prisma.$transaction(
      names.map((name) =>
        prisma.absence.upsert({
          where: { name },
          update: { count: { increment: 1 } },
          create: { name, count: 1 },
        })
      )
    );

    revalidatePath("/absences");
    return { success: true };
  } catch (error) {
    console.error("Error adding absence:", error);
    return { success: false, error: "처리 중 오류가 발생했습니다." };
  }
}

export async function updateAbsenceCount(id: string, count: number, password: string) {
  const adminPw = process.env.ADMIN_PASSWORD || "7913";
  if (password !== adminPw) {
    return { success: false, error: "관리자 비밀번호가 일치하지 않습니다." };
  }

  try {
    if (count < 0) return { success: false, error: "횟수는 0 이상이어야 합니다." };
    
    await prisma.absence.update({
      where: { id },
      data: { count }
    });
    
    revalidatePath("/absences");
    return { success: true };
  } catch (error) {
    console.error("Error updating absence:", error);
    return { success: false, error: "수정 중 오류가 발생했습니다." };
  }
}

export async function deleteAbsence(id: string, password: string) {
  const adminPw = process.env.ADMIN_PASSWORD || "7913";
  
  if (password !== adminPw) {
    return { success: false, error: "관리자 비밀번호가 일치하지 않습니다." };
  }

  try {
    await prisma.absence.delete({
      where: { id }
    });
    
    revalidatePath("/absences");
    return { success: true };
  } catch (error) {
    console.error("Error deleting absence:", error);
    return { success: false, error: "삭제 중 오류가 발생했습니다." };
  }
}


export async function getAdmins() {
  const setting = await prisma.setting.findUnique({
    where: { id: "admin_list" }
  });
  if (setting && setting.value) {
    return setting.value.split(",").map(s => s.trim());
  }
  return ["한원석", "최지식", "안병현", "김혜민", "김태일", "김혜원", "이주홍", "장은영", "고준혁"];
}

export async function saveAdmins(admins: string[], password: string) {
  const adminPw = process.env.ADMIN_PASSWORD || "7913";
  
  if (password !== adminPw) {
    return { success: false, error: "관리자 비밀번호가 일치하지 않습니다." };
  }

  const value = admins.join(",");
  await prisma.setting.upsert({
    where: { id: "admin_list" },
    update: { value },
    create: { id: "admin_list", value }
  });
  revalidatePath("/");
  return { success: true };
}
