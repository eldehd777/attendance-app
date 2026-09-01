"use client";

import { useState } from "react";
import { saveRule } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function RulesClient({ initialContent }: { initialContent: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    const pwd = window.prompt("관리자 비밀번호를 입력하세요:");
    if (!pwd) return;

    setLoading(true);
    const res = await saveRule(content, pwd);
    if (res.success) {
      setIsEditing(false);
    } else {
      alert(res.error);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">규칙 내용</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            수정하기
          </Button>
        ) : (
          <div className="space-x-2">
            <Button onClick={() => setIsEditing(false)} variant="ghost">
              취소
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "저장 중..." : "저장"}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg border border-secondary/30 p-6 min-h-[300px] shadow-lg shadow-red-900/10">
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] w-full text-base bg-background"
            placeholder="지옥의 골프 규칙을 핏빛으로 적어주세요..."
          />
        ) : (
          <div className="whitespace-pre-wrap leading-relaxed">
            {content || <span className="text-muted-foreground">아직 맺어진 규약이 없습니다. '수정하기'를 눌러 악마의 계약을 시작하세요!</span>}
          </div>
        )}
      </div>
    </div>
  );
}
