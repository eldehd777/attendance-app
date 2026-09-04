"use client";

import { useState } from "react";
import { addAward, updateAward, deleteAward } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Award {
  id: string;
  date: string;
  eventName: string;
  winnerName: string;
  awardName: string;
}

export default function AwardsClient({ initialAwards }: { initialAwards: Award[] }) {
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  
  // Add Form State
  const [date, setDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [winnerName, setWinnerName] = useState("");
  const [awardName, setAwardName] = useState("");

  // Edit Form State
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editEventName, setEditEventName] = useState("");
  const [editWinnerName, setEditWinnerName] = useState("");
  const [editAwardName, setEditAwardName] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const pwd = window.prompt("관리자 비밀번호를 입력하세요:");
    if (!pwd) return;

    setLoading(true);
    const res = await addAward(date, eventName, winnerName, awardName, pwd);
    if (res.success) {
      setShowAdd(false);
      setDate("");
      setEventName("");
      setWinnerName("");
      setAwardName("");
    } else {
      alert(res.error || "추가 실패");
    }
    setLoading(false);
  }

  function openEdit(award: Award) {
    setSelectedAward(award);
    setEditDate(award.date);
    setEditEventName(award.eventName);
    setEditWinnerName(award.winnerName);
    setEditAwardName(award.awardName);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAward) return;

    const pwd = window.prompt("관리자 비밀번호를 입력하세요:");
    if (!pwd) return;

    setLoading(true);
    const res = await updateAward(selectedAward.id, editDate, editEventName, editWinnerName, editAwardName, pwd);
    if (res.success) {
      setSelectedAward(null);
    } else {
      alert(res.error || "수정 실패");
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!selectedAward) return;
    const pwd = window.prompt("관리자 비밀번호를 입력하세요:");
    if (!pwd) return;

    setLoading(true);
    const res = await deleteAward(selectedAward.id, pwd);
    if (res.success) {
      setSelectedAward(null);
    } else {
      alert(res.error || "삭제 실패");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-end">
        <Button onClick={() => setShowAdd(true)} disabled={loading}>+ 시상 기록 추가</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {initialAwards.length > 0 ? (
          initialAwards.map((award) => (
            <Card key={award.id} className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => openEdit(award)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between">
                  <span>{award.winnerName}</span>
                  <span className="text-primary">{award.awardName}</span>
                </CardTitle>
                <CardDescription>
                  {award.date} · {award.eventName}
                </CardDescription>
              </CardHeader>
            </Card>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 text-center py-12 text-slate-500 bg-card rounded-lg border">
            아직 기록된 시상 내역이 없습니다.
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새로운 시상 기록 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">날짜 (예: 2024-09-04)</label>
              <Input required type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">행사명 (예: 9월 정기라운드)</label>
              <Input required value={eventName} onChange={(e) => setEventName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">수상자 이름</label>
              <Input required value={winnerName} onChange={(e) => setWinnerName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">시상명 / 상품</label>
              <Input required value={awardName} onChange={(e) => setAwardName(e.target.value)} placeholder="예: 롱기스트 / 타이틀리스트 골프공" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>취소</Button>
              <Button type="submit" disabled={loading}>{loading ? "저장 중..." : "추가"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit/Delete Dialog */}
      <Dialog open={!!selectedAward} onOpenChange={(open) => !open && setSelectedAward(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>시상 기록 수정</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">날짜</label>
              <Input required type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">행사명</label>
              <Input required value={editEventName} onChange={(e) => setEditEventName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">수상자 이름</label>
              <Input required value={editWinnerName} onChange={(e) => setEditWinnerName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">시상명 / 상품</label>
              <Input required value={editAwardName} onChange={(e) => setEditAwardName(e.target.value)} />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? "처리중.." : "기록 삭제"}
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setSelectedAward(null)} disabled={loading}>
                  취소
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "저장 중..." : "수정 완료"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
