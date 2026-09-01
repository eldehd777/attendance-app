"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function saveRule(content: string, password: string) {
  const adminPw = process.env.ADMIN_PASSWORD || "7913";
  if (password !== adminPw) {
    return { success: false, error: "관리자 비밀번호가 일치하지 않습니다." };
  }

  try {
    const rules = await prisma.rule.findMany();
    if (rules.length > 0) {
      await prisma.rule.update({
        where: { id: rules[0].id },
        data: { content },
      });
    } else {
      await prisma.rule.create({
        data: { content },
      });
    }
    revalidatePath("/rules");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "저장 중 오류가 발생했습니다." };
  }
}
