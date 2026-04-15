"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CircleUser, LogOut, Trophy, ShieldCheck, Clock, ShieldAlert, Bell } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { useTransition, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const navItems = [
  { label: "Overview", href: "/dashboard/guide?tab=overview" },
  { label: "Treks", href: "/dashboard/guide?tab=treks" },
  { label: "Bookings", href: "/dashboard/guide?tab=bookings" },
];

type VerificationStatus = "unsubmitted" | "pending" | "verified" | "rejected";

type GuideHeaderProps = {
  verificationStatus?: VerificationStatus;
};

export default function GuideHeader({ verificationStatus }: GuideHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [guideOrder, setGuideOrder] = useState<number | null>(null);
  const [guideActive, setGuideActive] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [previousGuideOrder, setPreviousGuideOrder] = useState<number | null>(null);

  const currentTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    async function fetchGuideOrder() {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("guide_order, guide_active")
        .eq("id", user.id)
        .single();

      if (data) {
        setGuideOrder(data.guide_order);
        setGuideActive(data.guide_active ?? false);
        setPreviousGuideOrder(data.guide_order);
      }
    }
    fetchGuideOrder();
  }, []);

  // Real-time subscription for guide position changes
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let userId: string | null = null;

    async function setupRealtimeSubscription() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      userId = user.id;

      // Subscribe to changes in the users table for this guide
      const channel = supabase
        .channel("guide-position-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "users",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            const newData = payload.new as any;
            const oldData = payload.old as any;

            // Check if guide_order changed
            if (newData.guide_order !== oldData.guide_order) {
              const newOrder = newData.guide_order;
              const oldOrder = oldData.guide_order;

              setGuideOrder(newOrder);
              setGuideActive(newData.guide_active ?? false);

              // Add notification for position change
              if (oldOrder !== null && newOrder !== null) {
                const positionChange = newOrder - oldOrder;
                const message =
                  positionChange > 0
                    ? `You moved down ${positionChange} position${positionChange > 1 ? "s" : ""} in the queue (now #${newOrder})`
                    : `You moved up ${Math.abs(positionChange)} position${Math.abs(positionChange) > 1 ? "s" : ""} in the queue (now #${newOrder})`;

                const newNotification = {
                  id: Date.now(),
                  title: "Queue Position Updated",
                  message: message,
                  time: "Just now",
                  unread: true,
                  type: "queue_position",
                };

                setNotifications((prev) => [newNotification, ...prev]);

                // Show browser notification if permission granted
                if (Notification.permission === "granted") {
                  new Notification("Queue Position Updated", {
                    body: message,
                    icon: "/favicon.ico",
                  });
                }
              }
            }

            // Check if guide_active changed
            if (newData.guide_active !== oldData.guide_active) {
              setGuideActive(newData.guide_active ?? false);

              const statusMessage = newData.guide_active
                ? "You are now active in the booking queue"
                : "You have been paused from the booking queue";

              const newNotification = {
                id: Date.now(),
                title: "Queue Status Changed",
                message: statusMessage,
                time: "Just now",
                unread: true,
                type: "queue_status",
              };

              setNotifications((prev) => [newNotification, ...prev]);

              if (Notification.permission === "granted") {
                new Notification("Queue Status Changed", {
                  body: statusMessage,
                  icon: "/favicon.ico",
                });
              }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    setupRealtimeSubscription();
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, unread: false })));
  };

  // Notification dropdown component
  const NotificationDropdown = () => {
    const unreadCount = notifications.filter((n) => n.unread).length;

    return (
      <div className="relative">
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            if (!showNotifications && unreadCount > 0) {
              // Mark all as read when opening
              setTimeout(() => markAllAsRead(), 500);
            }
          }}
          className="relative rounded-full border border-gray-200 bg-white p-2 transition-colors hover:bg-gray-50"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
        </button>

        {showNotifications && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowNotifications(false)}
            />
            <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 z-50 mt-2 w-80 duration-200 sm:w-96">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
                  <h3 className="text-sm font-black text-[#0b3a2c]">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="mx-auto h-8 w-8 text-gray-300" />
                      <p className="mt-2 text-sm font-semibold text-gray-400">No notifications</p>
                      <p className="mt-1 text-xs text-gray-400">
                        You'll be notified about queue position changes
                      </p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notif) => (
                      <div
                        key={notif.id}
                        className={`border-b border-gray-100 p-4 transition hover:bg-gray-50 ${
                          notif.unread ? "bg-emerald-50/30" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {notif.unread && (
                            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-bold text-gray-900">{notif.title}</p>
                              {notif.type === "queue_position" && (
                                <Trophy className="h-4 w-4 shrink-0 text-emerald-600" />
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-gray-600">{notif.message}</p>
                            <p className="mt-1 text-[10px] font-semibold text-gray-400">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-bold text-gray-600 hover:text-[#0b3a2c] hover:underline"
                      >
                        Mark all as read
                      </button>
                      <Link
                        href="/dashboard/guide/notifications"
                        className="text-xs font-bold text-[#0b3a2c] hover:underline"
                        onClick={() => setShowNotifications(false)}
                      >
                        View all
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Verification badge component
  const VerificationBadge = () => {
    if (!verificationStatus || verificationStatus === "unsubmitted") return null;

    const badgeConfig = {
      verified: {
        icon: ShieldCheck,
        text: "Verified",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        iconColor: "text-emerald-600",
        borderColor: "border-emerald-200",
      },
      pending: {
        icon: Clock,
        text: "Pending",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        iconColor: "text-amber-600",
        borderColor: "border-amber-200",
      },
      rejected: {
        icon: ShieldAlert,
        text: "Action needed",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        iconColor: "text-red-600",
        borderColor: "border-red-200",
      },
    };

    const config = badgeConfig[verificationStatus as keyof typeof badgeConfig];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <div
        className={`flex items-center gap-2 rounded-full border ${config.borderColor} ${config.bgColor} px-3 py-1.5`}
      >
        <Icon className={`h-4 w-4 ${config.iconColor}`} />
        <span className={`text-xs font-bold ${config.textColor}`}>{config.text}</span>
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/guide" className="group flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b3a2c] font-black text-white transition-transform group-hover:scale-105">
                OT
              </div>
              <div>
                <p className="text-xs leading-none font-semibold text-gray-400">Ourika Travels</p>
                <p className="mt-0.5 text-sm leading-none font-black text-[#0b3a2c]">
                  Guide Dashboard
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {guideOrder && (
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1">
                  <Trophy className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-xs font-black text-emerald-700">#{guideOrder}</span>
                </div>
              )}
              <NotificationDropdown />
              <Link
                href="/dashboard/guide/profile"
                className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b3a2c]">
                  <CircleUser className="h-3.5 w-3.5 text-white" />
                </div>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            {verificationStatus && verificationStatus !== "unsubmitted" && (
              <VerificationBadge />
            )}
          </div>
        </div>
      </header>

      {/* Desktop Header - unchanged */}
      <header className="sticky top-0 z-50 hidden border-b border-black/5 bg-white/80 backdrop-blur-xl md:block">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/guide" className="group flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0b3a2c] font-black text-white transition-transform group-hover:scale-105">
                OT
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400">Ourika Travels</p>
                <p className="text-lg font-black text-[#0b3a2c]">Guide Dashboard</p>
              </div>
            </Link>
            <VerificationBadge />
          </div>

          <div className="flex items-center gap-3">
            {guideOrder && (
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
                <Trophy className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-[10px] font-semibold text-emerald-600">Queue Position</p>
                  <p className="text-sm font-black text-emerald-700">#{guideOrder}</p>
                </div>
                <div
                  className={`ml-1 h-2 w-2 rounded-full ${
                    guideActive ? "bg-emerald-500" : "bg-gray-400"
                  }`}
                  title={guideActive ? "Active" : "Paused"}
                />
              </div>
            )}
            <NotificationDropdown />
            <Link
              href="/dashboard/guide/profile"
              className="flex items-center gap-2 rounded-full bg-[#0b3a2c] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#081f12]"
            >
              <CircleUser className="h-4 w-4" />
              Guide Profile
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isPending}
              className="flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-100 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {isPending ? "..." : "Log out"}
            </button>
          </div>
        </div>

        {/* Desktop Nav Pills */}
        <nav className="border-t border-black/5 bg-gray-50/50">
          <div className="scrollbar-hide mx-auto flex w-full max-w-6xl items-center gap-2 overflow-x-auto px-6 py-4">
            {navItems.map((item) => {
              const tabParam = item.href.split("tab=")[1];
              const isActive = pathname === "/dashboard/guide" && currentTab === tabParam;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  scroll={false}
                  className={`rounded-full px-6 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#0b3a2c] text-white shadow-md"
                      : "bg-transparent text-gray-600 hover:bg-white hover:text-[#0b3a2c]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid h-16 grid-cols-4">
          {[
            {
              label: "Overview",
              href: "/dashboard/guide?tab=overview",
              tab: "overview",
              icon: (active: boolean) => (
                <svg
                  className={`h-6 w-6 ${active ? "stroke-[2.5px]" : "stroke-[1.5px]"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              ),
            },
            {
              label: "Treks",
              href: "/dashboard/guide?tab=treks",
              tab: "treks",
              icon: (active: boolean) => (
                <svg
                  className={`h-6 w-6 ${active ? "stroke-[2.5px]" : "stroke-[1.5px]"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              ),
            },
            {
              label: "Bookings",
              href: "/dashboard/guide?tab=bookings",
              tab: "bookings",
              icon: (active: boolean) => (
                <svg
                  className={`h-6 w-6 ${active ? "stroke-[2.5px]" : "stroke-[1.5px]"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              label: "Sign out",
              href: "#",
              icon: () => (
                <svg
                  className="h-6 w-6 stroke-[1.5px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              ),
              isSignOut: true,
            },
          ].map((tab, idx) => {
            const active = pathname === "/dashboard/guide" && currentTab === tab.tab;
            if (tab.isSignOut) {
              return (
                <button
                  key="signout"
                  onClick={handleSignOut}
                  disabled={isPending}
                  className="flex flex-col items-center justify-center gap-1 text-red-400 disabled:opacity-50"
                >
                  {tab.icon()}
                  <span className="text-[10px] font-bold">{isPending ? "..." : "Sign out"}</span>
                </button>
              );
            }
            return (
              <Link
                key={tab.href}
                href={tab.href}
                scroll={false}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  active ? "text-[#0b3a2c]" : "text-gray-400"
                }`}
              >
                {tab.icon(active)}
                <span className={`text-[10px] font-bold ${active ? "font-black" : ""}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
