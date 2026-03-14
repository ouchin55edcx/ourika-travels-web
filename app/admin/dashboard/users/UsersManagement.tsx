"use client";

import { useState, useTransition } from "react";
import { AuthUser } from "@/lib/auth";
import {
    Search,
    Compass,
    Mail,
    Phone,
    ShieldCheck,
    ShieldAlert,
    UserX,
    Archive,
    ExternalLink,
    CheckCircle2,
    UsersRound,
    MoreVertical,
    Filter
} from "lucide-react";
import { toggleUserStatus, toggleGuideVerification, archiveUser } from "@/app/actions/users";

interface UsersManagementProps {
    initialUsers: AuthUser[];
}

export default function UsersManagement({ initialUsers }: UsersManagementProps) {
    const [activeTab, setActiveTab] = useState<"tourist" | "guide">("tourist");
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();

    const tourists = initialUsers.filter(u => u.role === "tourist");
    const guides = initialUsers.filter(u => u.role === "guide");
    const blockedUsers = initialUsers.filter(u => !u.is_active).length;
    const pendingGuides = guides.filter(u => !u.email_verified).length;

    const filteredUsers = initialUsers.filter((user) => {
        const matchesTab = user.role === activeTab;
        const matchesSearch =
            user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleToggleStatus = (userId: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? "block" : "activate"} this user?`)) return;
        startTransition(async () => {
            const result = await toggleUserStatus(userId, !currentStatus);
            if (result.error) alert(result.error);
        });
    };

    const handleToggleVerification = (userId: string, currentStatus: boolean) => {
        const actionLabel = currentStatus ? "unverify" : "verify";
        if (!confirm(`Are you sure you want to ${actionLabel} this guide?`)) return;
        startTransition(async () => {
            const result = await toggleGuideVerification(userId, !currentStatus);
            if (result.error) alert(result.error);
        });
    };

    const handleArchive = (userId: string) => {
        if (!confirm("Are you sure you want to archive this user? They will be blocked from the platform.")) return;
        startTransition(async () => {
            const result = await archiveUser(userId);
            if (result.error) alert(result.error);
        });
    };


    return (
        <div className="space-y-10">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Tourists", count: tourists.length, icon: UsersRound, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Active Guides", count: guides.filter(g => g.is_active).length, icon: Compass, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Pending Verification", count: pendingGuides, icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Blocked Accounts", count: blockedUsers, icon: ShieldCheck, color: "text-red-600", bg: "bg-red-50" },
                ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-tight text-gray-400">{stat.label}</p>
                            <p className="text-2xl font-black text-[#0b3a2c]">{stat.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                {/* Filters & Search */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
                        <button
                            onClick={() => setActiveTab("tourist")}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "tourist"
                                ? "bg-white text-[#0b3a2c] shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Tourists
                        </button>
                        <button
                            onClick={() => setActiveTab("guide")}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "guide"
                                ? "bg-white text-[#0b3a2c] shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Guides
                        </button>
                    </div>

                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}s by name or email...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-black/5 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#0b3a2c]/5 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-2xl shadow-black/[0.03]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50 bg-gray-50/50">
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">User</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Contact</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                    {activeTab === "guide" && (
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Verification</th>
                                    )}
                                    <th className="px-8 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0b3a2c]/5 text-lg font-bold text-[#0b3a2c]">
                                                        {user.full_name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{user.full_name}</p>
                                                        <p className="text-xs font-medium text-gray-400">ID: {user.id.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                                                        {user.email}
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                                            <Phone className="h-3.5 w-3.5" />
                                                            {user.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-tight ${user.is_active
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                    : "bg-red-50 text-red-700 border border-red-100"
                                                    }`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                                                    {user.is_active ? "Active" : "Blocked"}
                                                </span>
                                            </td>
                                            {activeTab === "guide" && (
                                                <td className="px-6 py-5">
                                                    <button
                                                        onClick={() => handleToggleVerification(user.id, user.email_verified)}
                                                        disabled={isPending}
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all shadow-sm ${user.email_verified
                                                            ? "bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100"
                                                            : "bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100"
                                                            }`}
                                                    >
                                                        {user.email_verified ? (
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <ShieldAlert className="h-3.5 w-3.5" />
                                                        )}
                                                        {user.email_verified ? "Verified" : "Verify Guide"}
                                                    </button>
                                                </td>
                                            )}
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {activeTab === "guide" && (
                                                        <button
                                                            title="View Profile"
                                                            className="p-2.5 text-gray-400 hover:text-[#0b3a2c] hover:bg-[#0b3a2c]/5 rounded-xl transition-all"
                                                        >
                                                            <ExternalLink className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        title={user.is_active ? "Block User" : "Activate User"}
                                                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                                                        disabled={isPending}
                                                        className={`p-2.5 rounded-xl transition-all ${user.is_active
                                                            ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                            : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                                                            }`}
                                                    >
                                                        <UserX className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        title="Archive User"
                                                        onClick={() => handleArchive(user.id)}
                                                        disabled={isPending}
                                                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    >
                                                        <Archive className="h-5 w-5" />
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={activeTab === "guide" ? 5 : 4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-gray-50 rounded-full">
                                                    <ShieldAlert className="h-10 w-10 text-gray-300" />
                                                </div>
                                                <p className="text-gray-500 font-medium">No {activeTab}s found matching your criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
