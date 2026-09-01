"use client";

import { useState } from "react";
import { addEventWithAttendances, saveAdmins } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function HomeClient({ initialAdmins }: { initialAdmins: string[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [admins, setAdmins] = useState(initialAdmins);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  
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

  async function handleSaveAdmins() {
    setLoading(true);
    const names = adminInput.split(/[,\n\s]+/).map(s => s.trim()).filter(s => s.length > 0);
    const uniqueNames = Array.from(new Set(names));
    
    const res = await saveAdmins(uniqueNames);
    if (res.success) {
      setAdmins(uniqueNames);
      setShowAdminDialog(false);
    } else {
      alert("운영진 저장 실패");
    }
    setLoading(false);
  }

  function openAdminDialog() {
    setAdminInput(admins.join(", "));
    setShowAdminDialog(true);
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
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">담당 운영진 (마귀)</label>
                  <Button type="button" variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={openAdminDialog}>
                    운영진 목록 관리
                  </Button>
                </div>
                <select 
                  name="adminName" 
                  required 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">운영진 선택...</option>
                  {admins.map(admin => (
                    <option key={admin} value={admin}>{admin}</option>
                  ))}
                </select>
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
              <div className={p-3 text-sm rounded-md font-bold }>
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

      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>운영진 목록 관리</DialogTitle>
            <DialogDescription>
              드롭다운에 표시될 운영진 이름을 쉼표(,)나 띄어쓰기로 구분하여 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Textarea 
              value={adminInput}
              onChange={(e) => setAdminInput(e.target.value)}
              className="min-h-[100px]"
              placeholder="예: 홍길동, 김철수, 이영희"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAdminDialog(false)} disabled={loading}>
                취소
              </Button>
              <Button onClick={handleSaveAdmins} disabled={loading}>
                {loading ? "저장 중..." : "저장"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
