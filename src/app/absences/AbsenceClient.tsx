"use client";

import { useState } from "react";
import { addAbsence, updateAbsenceCount } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Absence {
  id: string;
  name: string;
  count: number;
}

export default function AbsenceClient({ initialData }: { initialData: Absence[] }) {
  const [loading, setLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  
  const [selectedUser, setSelectedUser] = useState<Absence | null>(null);
  const [editCount, setEditCount] = useState<number>(0);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!nameInput.trim()) return;
    
    setLoading(true);
    const res = await addAbsence(nameInput);
    if (res.success) {
      setNameInput("");
    } else {
      alert(res.error);
    }
    setLoading(false);
  }

  async function handleSaveEdit() {
    if (!selectedUser) return;
    setLoading(true);
    const res = await updateAbsenceCount(selectedUser.id, editCount);
    if (res.success) {
      setSelectedUser(null);
    } else {
      alert(res.error);
    }
    setLoading(false);
  }

  function openEdit(user: Absence) {
    setSelectedUser(user);
    setEditCount(user.count);
  }

  return (
    <div className="space-y-6">
      {/* Top Input Form */}
      <form onSubmit={handleAdd} className="flex gap-2 sticky top-4 z-10 bg-background/95 backdrop-blur py-4 border-b border-secondary/50">
        <Input
          placeholder="미참여 회원 이름 입력 (예: 홍길동)"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          disabled={loading}
          className="flex-1 bg-background"
        />
        <Button type="submit" disabled={loading || !nameInput.trim()}>
          {loading ? "기록중.." : "추가 (+1)"}
        </Button>
      </form>

      {/* List */}
      <div className="space-y-2 pb-20">
        {initialData.length > 0 ? (
          initialData.map((user) => (
            <div
              key={user.id}
              onClick={() => openEdit(user)}
              className="flex justify-between items-center p-4 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="font-semibold text-lg">{user.name}</div>
              <div className="text-destructive font-bold text-lg">
                {user.count}회 미참여
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500 bg-card rounded-lg border">
            미참여 기록이 없습니다.
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex flex-wrap">{selectedUser?.name}님의 미참여 횟수 수정</DialogTitle>
            <DialogDescription>
              현재 누적 {selectedUser?.count}회 미참여로 기록되어 있습니다. 올바른 횟수로 수정해주세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex items-center gap-4">
            <label className="font-semibold w-24">누적 횟수</label>
            <Input 
              type="number" 
              min="0"
              value={editCount} 
              onChange={(e) => setEditCount(parseInt(e.target.value) || 0)}
              className="w-full text-lg"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSelectedUser(null)} disabled={loading}>
              취소
            </Button>
            <Button onClick={handleSaveEdit} disabled={loading}>
              {loading ? "저장 중..." : "수정 완료"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
