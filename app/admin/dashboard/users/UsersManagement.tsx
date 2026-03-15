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
    Filter,
    X,
    MapPin,
    Briefcase,
    Loader2,
    Clock,
    ShieldX
} from "lucide-react";
import { toggleUserStatus, toggleGuideVerification, archiveUser, verifyGuide, rejectGuide } from "@/app/actions/users";

interface UsersManagementProps {
    initialUsers: AuthUser[];
}

export default function UsersManagement({ initialUsers }: UsersManagementProps) {
    type Tab = 'tourist' | 'guide' | 'pending';
    const [activeTab, setActiveTab] = useState<Tab>("tourist");
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();
    const [selectedGuide, setSelectedGuide] = useState<AuthUser | null>(null);
    const [rejectNote, setRejectNote] = useState('');
    const [showRejectInput, setShowRejectInput] = useState(false);

    const tourists = initialUsers.filter(u => u.role === "tourist");
    const guides = initialUsers.filter(u => u.role === "guide");
    const blockedUsers = initialUsers.filter(u => !u.is_active).length;
    const pendingGuides = guides.filter(g => g.verification_status === 'pending').length;

    const filteredUsers = initialUsers.filter((user) => {
        if (activeTab === 'pending') {
            return user.role === 'guide' && user.verification_status === 'pending';
        }
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
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all relative ${activeTab === "pending"
                                ? "bg-white text-amber-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Pending Verification
                            {pendingGuides > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center
                                    justify-center rounded-full bg-amber-500 text-[10px] font-black
                                    text-white">
                                    {pendingGuides}
                                </span>
                            )}
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
                                            {(activeTab === "guide" || activeTab === "pending") && (
                                                <td className="px-6 py-5">
                                                    {user.verification_status === 'pending' && (
                                                        <span className="rounded-full bg-amber-100 px-2 py-0.5
                                                            text-[10px] font-black text-amber-700">Pending</span>
                                                    )}
                                                    {user.verification_status === 'verified' && (
                                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5
                                                            text-[10px] font-black text-emerald-700 flex items-center gap-1 w-fit">
                                                            <ShieldCheck className="h-2.5 w-2.5" /> Verified
                                                        </span>
                                                    )}
                                                    {user.verification_status === 'rejected' && (
                                                        <span className="rounded-full bg-red-100 px-2 py-0.5
                                                            text-[10px] font-black text-red-600">Rejected</span>
                                                    )}
                                                    {user.verification_status === 'unsubmitted' && (
                                                        <span className="text-xs text-gray-400">Not requested</span>
                                                    )}
                                                </td>
                                            )}
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(activeTab === "guide" || activeTab === "pending") && (
                                                        <button
                                                            onClick={() => setSelectedGuide(user)}
                                                            className="flex items-center gap-1.5 rounded-full border border-gray-200
                                                                px-3 py-1.5 text-[12px] font-bold text-gray-600 hover:border-[#0b3a2c]
                                                                hover:text-[#0b3a2c] transition-all"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            View
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
                                        <td colSpan={(activeTab === "guide" || activeTab === "pending") ? 5 : 4} className="px-8 py-20 text-center">
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

            {/* Guide Detail Panel */}
            {selectedGuide && (
                <div className="fixed inset-0 z-[200] flex">
                    {/* Backdrop */}
                    <div
                        className="flex-1 bg-black/40 backdrop-blur-sm"
                        onClick={() => { setSelectedGuide(null); setShowRejectInput(false); setRejectNote(''); }}
                    />

                    {/* Panel */}
                    <div className="w-full max-w-lg bg-white h-full overflow-y-auto
                        shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                        {/* Panel header */}
                        <div className="flex items-center justify-between border-b
                            border-gray-100 px-6 py-5 sticky top-0 bg-white z-10">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest
                                    text-gray-400">
                                    Guide Profile
                                </p>
                                <h2 className="text-xl font-black text-[#0b3a2c]">
                                    {selectedGuide.full_name}
                                </h2>
                            </div>
                            <button
                                onClick={() => { setSelectedGuide(null); setShowRejectInput(false); }}
                                className="rounded-full p-2 hover:bg-gray-100 transition-colors">
                                <X className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Panel body */}
                        <div className="flex-1 px-6 py-6 space-y-6">

                            {/* Avatar + basic info */}
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-2xl overflow-hidden
                                    bg-[#0b3a2c] flex items-center justify-center flex-shrink-0">
                                    {selectedGuide.avatar_url ? (
                                        <img src={selectedGuide.avatar_url} alt=""
                                            className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-black text-white">
                                            {selectedGuide.full_name?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-black text-[#0b3a2c] text-lg">
                                        {selectedGuide.full_name}
                                    </p>
                                    <p className="text-sm text-gray-500">{selectedGuide.email}</p>
                                    {selectedGuide.phone && (
                                        <p className="text-sm text-gray-500">{selectedGuide.phone}</p>
                                    )}
                                    {selectedGuide.location && (
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> {selectedGuide.location}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Current verification status */}
                            <div className={`rounded-2xl px-4 py-3 flex items-center gap-3
                                ${selectedGuide.verification_status === 'verified'
                                    ? 'bg-emerald-50 border border-emerald-100'
                                    : selectedGuide.verification_status === 'pending'
                                    ? 'bg-amber-50 border border-amber-100'
                                    : selectedGuide.verification_status === 'rejected'
                                    ? 'bg-red-50 border border-red-100'
                                    : 'bg-gray-50 border border-gray-100'
                                }`}>
                                <ShieldCheck className={`h-5 w-5
                                    ${selectedGuide.verification_status === 'verified'
                                        ? 'text-emerald-600'
                                        : selectedGuide.verification_status === 'pending'
                                        ? 'text-amber-600'
                                        : 'text-gray-400'}`} />
                                <div>
                                    <p className="text-sm font-bold capitalize text-gray-800">
                                        {selectedGuide.verification_status === 'unsubmitted'
                                            ? 'Not requested'
                                            : selectedGuide.verification_status}
                                    </p>
                                    {selectedGuide.verification_note && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Note: {selectedGuide.verification_note}
                                        </p>
                                    )}
                                    {selectedGuide.verified_at && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Verified: {new Date(selectedGuide.verified_at)
                                                .toLocaleDateString('en-US', {
                                                    month: 'long', day: 'numeric', year: 'numeric'
                                                })}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            {selectedGuide.bio && (
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest
                                        text-gray-400 mb-2">About</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {selectedGuide.bio}
                                    </p>
                                </div>
                            )}

                            {/* Years experience */}
                            {selectedGuide.years_experience && (
                                <div className="flex items-center gap-3 rounded-2xl
                                    bg-gray-50 px-4 py-3">
                                    <Briefcase className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm font-semibold text-gray-700">
                                        {selectedGuide.years_experience} years of experience
                                    </span>
                                </div>
                            )}

                            {/* Languages */}
                            {selectedGuide.languages?.length > 0 && (
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest
                                        text-gray-400 mb-2">Languages</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedGuide.languages.map(l => (
                                            <span key={l} className="rounded-full bg-gray-100
                                                px-3 py-1 text-xs font-semibold text-gray-700">
                                                {l}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Specialties */}
                            {selectedGuide.specialties?.length > 0 && (
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest
                                        text-gray-400 mb-2">Specialties</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedGuide.specialties.map(s => (
                                            <span key={s} className="rounded-full
                                                bg-[#f0faf5] border border-emerald-100
                                                px-3 py-1 text-xs font-semibold text-[#0b3a2c]">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Certifications */}
                            {selectedGuide.certifications?.length > 0 && (
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest
                                        text-gray-400 mb-2">Certifications</p>
                                    <div className="space-y-2">
                                        {selectedGuide.certifications.map(c => (
                                            <div key={c} className="flex items-center gap-2
                                                rounded-xl bg-gray-50 px-4 py-2.5">
                                                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                                                <span className="text-sm font-medium text-gray-700">{c}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Guide badge image */}
                            {selectedGuide.badge_image_url && (
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest
                                        text-gray-400 mb-2">Official Guide Badge</p>
                                    <div className="rounded-2xl overflow-hidden border
                                        border-gray-100 bg-gray-50 p-4">
                                        <img src={selectedGuide.badge_image_url}
                                            alt="Guide badge"
                                            className="max-h-48 w-full object-contain" />
                                    </div>
                                    {selectedGuide.guide_badge_code && (
                                        <p className="mt-2 text-xs text-gray-500">
                                            Code: <span className="font-mono font-semibold">
                                                {selectedGuide.guide_badge_code}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Panel footer — action buttons */}
                        {selectedGuide.verification_status !== 'verified' && (
                            <div className="border-t border-gray-100 px-6 py-5 space-y-3
                                sticky bottom-0 bg-white">

                                {/* Reject with note */}
                                {showRejectInput && (
                                    <div className="space-y-2">
                                        <textarea
                                            value={rejectNote}
                                            onChange={e => setRejectNote(e.target.value)}
                                            placeholder="Reason for rejection (shown to guide)..."
                                            rows={3}
                                            className="w-full rounded-2xl border border-gray-200
                                                bg-gray-50 px-4 py-3 text-sm focus:outline-none
                                                focus:border-red-300 resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setShowRejectInput(false);
                                                    setRejectNote('');
                                                }}
                                                className="flex-1 rounded-full border border-gray-200
                                                    py-2.5 text-sm font-bold text-gray-500
                                                    hover:bg-gray-50 transition-all">
                                                Cancel
                                            </button>
                                            <button
                                                disabled={!rejectNote.trim() || isPending}
                                                onClick={() => {
                                                    startTransition(async () => {
                                                        const result = await rejectGuide(
                                                            selectedGuide.id, rejectNote
                                                        );
                                                        if (!result.error) {
                                                            setSelectedGuide(null);
                                                            setShowRejectInput(false);
                                                            setRejectNote('');
                                                        }
                                                    });
                                                }}
                                                className="flex-1 rounded-full bg-red-600 py-2.5
                                                    text-sm font-bold text-white hover:bg-red-700
                                                    transition-all disabled:opacity-50 flex items-center
                                                    justify-center gap-2">
                                                {isPending
                                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                                    : 'Confirm rejection'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {!showRejectInput && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowRejectInput(true)}
                                            className="flex-1 rounded-full border-2 border-red-200
                                                bg-white py-3.5 text-sm font-black text-red-500
                                                hover:bg-red-50 transition-all">
                                            Reject
                                        </button>
                                        <button
                                            disabled={isPending}
                                            onClick={() => {
                                                startTransition(async () => {
                                                    const result = await verifyGuide(selectedGuide.id);
                                                    if (!result.error) setSelectedGuide(null);
                                                });
                                            }}
                                            className="flex-1 rounded-full bg-[#0b3a2c] py-3.5
                                                text-sm font-black text-[#00ef9d] shadow-lg
                                                hover:bg-[#0d4a38] transition-all active:scale-95
                                                disabled:opacity-60 flex items-center justify-center gap-2">
                                            {isPending
                                                ? <Loader2 className="h-5 w-5 animate-spin" />
                                                : <><ShieldCheck className="h-4 w-4" />
                                                    Verify & Badge</>
                                            }
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedGuide.verification_status === 'verified' && (
                            <div className="border-t border-emerald-100 bg-emerald-50
                                px-6 py-4 text-center sticky bottom-0">
                                <p className="text-sm font-black text-emerald-700 flex
                                    items-center justify-center gap-2">
                                    <ShieldCheck className="h-4 w-4" />
                                    This guide is Ourika Travels Verified
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
