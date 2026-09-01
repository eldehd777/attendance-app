import { PrismaClient } from "@prisma/client";
import RulesClient from "./RulesClient";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function RulesPage() {
  const rules = await prisma.rule.findMany();
  const initialContent = rules.length > 0 ? rules[0].content : "";

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">👿 악마의 규약 (규칙)</h1>
        <p className="text-muted-foreground">이 골프 모임에서 반드시 지켜야 할 피의 규칙들입니다.</p>
      </div>

      <RulesClient initialContent={initialContent} />
    </div>
  );
}
