"use client";

import { useState } from "react";
import { addEventWithAttendances } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    
    try {
      const res = await addEventWithAttendances(formData);
      if (res.success) {
        setMessage("성공적으로 저장되었습니다.");
        (event.target as HTMLFormElement).reset();
      } else {
        setMessage(res.error || "오류가 발생했습니다.");
      }
    } catch (error: any) {
      setMessage(error.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card className="border-secondary/50 shadow-lg shadow-red-900/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            ⛳ 필드 및 출석 기록 📝
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            새로운 라운딩 정보와 지옥훈련(?)을 견딘 참석자 명단을 입력해주세요. 참석자 이름은 쉼표(,)나 줄바꿈으로 한 번에 붙여넣을 수 있습니다.
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">티업 날짜</label>
                <Input type="date" name="date" required className="bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">담당 운영진 (마귀)</label>
                <Input type="text" name="adminName" placeholder="예: 염라대왕" required className="bg-background" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">행사명 (구장명)</label>
              <Input type="text" name="name" placeholder="예: 9월 불지옥 CC 라운딩" required className="bg-background" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">생존자(참석자) 명단</label>
              <Textarea 
                name="attendees" 
                placeholder="타이거 우즈, 필 미켈슨&#10;존 람&#10;로리 매킬로이"
                className="min-h-[150px] bg-background"
                required
              />
              <p className="text-xs text-muted-foreground">
                카카오톡이나 메모장에서 복사해서 바로 붙여넣기 하세요.
              </p>
            </div>

            {message && (
              <div className={`p-3 text-sm rounded-md font-bold ${message.includes("성공") ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}>
                {message}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full text-lg font-bold" disabled={loading}>
              {loading ? "🔥 기록 중..." : "🔥 지옥불 기록 저장하기 ⛳"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
