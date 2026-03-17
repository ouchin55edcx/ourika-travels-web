'use client';
import { useState, useTransition } from 'react';
import { Megaphone, Trash2, Loader2, Send, CheckCircle2 } from 'lucide-react';

import { createAnnouncement, deleteAnnouncement }
  from '@/app/actions/announcements';

export default function AnnouncementsManagement({
  initialAnnouncements, adminId,
}: { initialAnnouncements: any[]; adminId: string }) {
  const [items,   setItems]   = useState(initialAnnouncements);
  const [title,   setTitle]   = useState('');
  const [body,    setBody]    = useState('');
  const [toast,   setToast]   = useState<string|null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleCreate() {
    if (!title.trim() || !body.trim()) return;
    startTransition(async () => {
      const result = await createAnnouncement(title.trim(), body.trim());
      if ('error' in result) { showToast('❌ ' + result.error); return; }
      setItems(prev => [result.announcement, ...prev]);
      setTitle(''); setBody('');
      showToast('✓ Announcement sent to all guides');
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this announcement?')) return;
    startTransition(async () => {
      const result = await deleteAnnouncement(id);
      if ('success' in result) setItems(prev => prev.filter(a => a.id !== id));
    });
  }

  return (
    <div className="space-y-6">

      {/* Compose box */}
      <div className="rounded-[2rem] border border-black/5 bg-white
        p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center
            rounded-2xl bg-[#0b3a2c]/10">
            <Megaphone className="h-5 w-5 text-[#0b3a2c]" />
          </div>
          <div>
            <p className="font-black text-[#0b3a2c]">New announcement</p>
            <p className="text-xs text-gray-500">
              Sent to all active guides via the mobile app
            </p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Title — e.g. 'Important: Schedule change this weekend'"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50
            px-4 py-3 text-sm font-medium focus:border-[#0b3a2c]
            focus:bg-white focus:outline-none focus:ring-2
            focus:ring-[#0b3a2c]/10 transition-all"
        />
        <textarea
          rows={4}
          placeholder="Write your message to guides..."
          value={body}
          onChange={e => setBody(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50
            px-4 py-3 text-sm font-medium resize-none
            focus:border-[#0b3a2c] focus:bg-white focus:outline-none
            focus:ring-2 focus:ring-[#0b3a2c]/10 transition-all"
        />

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            📱 Guides will receive a push notification instantly
          </p>
          <button
            onClick={handleCreate}
            disabled={isPending || !title.trim() || !body.trim()}
            className="flex items-center gap-2 rounded-full bg-[#0b3a2c]
              px-6 py-3 text-sm font-black text-white shadow-sm
              hover:bg-[#0d4a38] transition-all disabled:opacity-40
              active:scale-95">
            {isPending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Send className="h-4 w-4" />}
            Post to all guides
          </button>
        </div>
      </div>

      {/* Announcements history */}
      <div className="overflow-hidden rounded-[2rem] border border-black/5
        bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <p className="font-black text-[#0b3a2c]">
            History ({items.length})
          </p>
        </div>
        {items.length === 0 ? (
          <div className="py-20 text-center">
            <Megaphone className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-300 font-black text-xl">
              No announcements yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map(ann => (
              <div key={ann.id}
                className="flex items-start justify-between gap-4
                  px-6 py-5 hover:bg-gray-50/50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#0b3a2c] text-sm">
                    {ann.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {ann.body}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 font-semibold">
                    {new Date(ann.created_at).toLocaleDateString('en-US', {
                      month:'short', day:'numeric', year:'numeric',
                      hour:'2-digit', minute:'2-digit'
                    })}
                    {ann.users?.full_name && ` · by ${ann.users.full_name}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(ann.id)}
                  disabled={isPending}
                  className="opacity-0 group-hover:opacity-100 rounded-full
                    p-2 text-gray-300 hover:text-red-500 hover:bg-red-50
                    transition-all disabled:opacity-30">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center
          gap-2 rounded-2xl bg-[#0b3a2c] px-5 py-3 text-sm font-semibold
          text-white shadow-2xl animate-in slide-in-from-bottom-4
          duration-300">
          <CheckCircle2 className="h-4 w-4 text-[#00ef9d]" />
          {toast}
        </div>
      )}
    </div>
  );
}
