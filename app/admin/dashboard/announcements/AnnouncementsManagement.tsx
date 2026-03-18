"use client";
import { useState, useTransition } from "react";
import { Megaphone, Trash2, Loader2, Send, CheckCircle2 } from "lucide-react";

import { createAnnouncement, deleteAnnouncement } from "@/app/actions/announcements";

export default function AnnouncementsManagement({
  initialAnnouncements,
  adminId,
}: {
  initialAnnouncements: any[];
  adminId: string;
}) {
  const [items, setItems] = useState(initialAnnouncements);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleCreate() {
    if (!title.trim() || !body.trim()) return;
    startTransition(async () => {
      const result = await createAnnouncement(title.trim(), body.trim());
      if ("error" in result) {
        showToast("❌ " + result.error);
        return;
      }
      setItems((prev) => [result.announcement, ...prev]);
      setTitle("");
      setBody("");
      showToast("✓ Announcement sent to all guides");
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    startTransition(async () => {
      const result = await deleteAnnouncement(id);
      if ("success" in result) setItems((prev) => prev.filter((a) => a.id !== id));
    });
  }

  return (
    <div className="space-y-6">
      {/* Compose box */}
      <div className="space-y-4 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0b3a2c]/10">
            <Megaphone className="h-5 w-5 text-[#0b3a2c]" />
          </div>
          <div>
            <p className="font-black text-[#0b3a2c]">New announcement</p>
            <p className="text-xs text-gray-500">Sent to all active guides via the mobile app</p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Title — e.g. 'Important: Schedule change this weekend'"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium transition-all focus:border-[#0b3a2c] focus:bg-white focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
        />
        <textarea
          rows={4}
          placeholder="Write your message to guides..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium transition-all focus:border-[#0b3a2c] focus:bg-white focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
        />

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            📱 Guides will receive a push notification instantly
          </p>
          <button
            onClick={handleCreate}
            disabled={isPending || !title.trim() || !body.trim()}
            className="flex items-center gap-2 rounded-full bg-[#0b3a2c] px-6 py-3 text-sm font-black text-white shadow-sm transition-all hover:bg-[#0f3d24] active:scale-95 disabled:opacity-40"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Post to all guides
          </button>
        </div>
      </div>

      {/* Announcements history */}
      <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <p className="font-black text-[#0b3a2c]">History ({items.length})</p>
        </div>
        {items.length === 0 ? (
          <div className="py-20 text-center">
            <Megaphone className="mx-auto mb-4 h-12 w-12 text-gray-200" />
            <p className="text-xl font-black text-gray-300">No announcements yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((ann) => (
              <div
                key={ann.id}
                className="group flex items-start justify-between gap-4 px-6 py-5 transition-colors hover:bg-gray-50/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-[#0b3a2c]">{ann.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{ann.body}</p>
                  <p className="mt-2 text-xs font-semibold text-gray-400">
                    {new Date(ann.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {ann.users?.full_name && ` · by ${ann.users.full_name}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(ann.id)}
                  disabled={isPending}
                  className="rounded-full p-2 text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="animate-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-2xl bg-[#0b3a2c] px-5 py-3 text-sm font-semibold text-white shadow-2xl duration-300">
          <CheckCircle2 className="h-4 w-4 text-[#00ef9d]" />
          {toast}
        </div>
      )}
    </div>
  );
}
