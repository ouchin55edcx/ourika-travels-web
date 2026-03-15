import { AuthUser } from '@/lib/auth';
import {
  MapPin, Mail, Phone, Star, Award, Shield, CheckCircle2,
  AlertTriangle, Languages, Briefcase, Calendar, Clock, ShieldCheck
} from 'lucide-react';

interface GuideProfileViewProps {
  user: AuthUser;
  completeness: number;
}

export default function GuideProfileView({ user, completeness }: GuideProfileViewProps) {
  const progressColor = completeness >= 80 ? 'bg-[#00ef9d]' : completeness >= 50 ? 'bg-amber-400' : 'bg-red-400';
  const progressTextColor = completeness >= 80 ? 'text-[#00ef9d]' : completeness >= 50 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      {/* Profile completeness banner */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
            Profile Completeness
          </h3>
          <span className={`text-2xl font-black ${progressTextColor}`}>
            {completeness}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-500`}
            style={{ width: `${completeness}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          {completeness >= 80
            ? '✨ Your profile looks great! Keep it updated to attract more bookings.'
            : 'Complete your profile below to attract more bookings and build trust with travelers.'}
        </p>
      </div>

      {/* Main profile card */}
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-5xl font-black text-gray-300">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-[#0b3a2c]">
                  {user.full_name}
                </h1>
                {user.is_verified && (
                  <div className="inline-flex items-center gap-2 rounded-full
                    bg-[#0b3a2c] px-3 py-1.5 text-xs font-black text-[#00ef9d]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Ourika Travels Verified
                  </div>
                )}
                {user.verification_status === 'pending' && (
                  <div className="inline-flex items-center gap-2 rounded-full
                    bg-amber-50 border border-amber-200 px-3 py-1.5
                    text-xs font-bold text-amber-700">
                    <Clock className="h-3.5 w-3.5" />
                    Verification pending
                  </div>
                )}
              </div>
              {user.location && (
                <p className="mt-1 flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </p>
              )}
            </div>

            {user.bio && (
              <p className="text-gray-600 leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 pt-2">
              {user.years_experience && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-[#0b3a2c]" />
                  <span className="font-bold text-gray-700">
                    {user.years_experience} years experience
                  </span>
                </div>
              )}
              {user.languages && user.languages.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Languages className="h-4 w-4 text-[#0b3a2c]" />
                  <span className="font-bold text-gray-700">
                    {user.languages.length} {user.languages.length === 1 ? 'language' : 'languages'}
                  </span>
                </div>
              )}
              {user.specialties && user.specialties.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-[#0b3a2c]" />
                  <span className="font-bold text-gray-700">
                    {user.specialties.length} {user.specialties.length === 1 ? 'specialty' : 'specialties'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specialties */}
        {user.specialties && user.specialties.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
              Specialties
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.specialties.map((specialty, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0b3a2c]/5 px-4 py-2 text-sm font-bold text-[#0b3a2c]"
                >
                  <Star className="h-3 w-3" />
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {user.languages && user.languages.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.languages.map((language, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700"
                >
                  <Languages className="h-3 w-3" />
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {user.certifications && user.certifications.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
              Certifications & Credentials
            </h3>
            <ul className="space-y-2">
              {user.certifications.map((cert, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-[#00ef9d] mt-0.5 flex-shrink-0" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Guide badge */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
            Official Guide Badge
          </h3>
          {user.badge_image_url ? (
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-xl overflow-hidden border-2 border-[#00ef9d] bg-white p-2">
                <img
                  src={user.badge_image_url}
                  alt="Guide badge"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-[#00ef9d]">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified badge uploaded
                </p>
                {user.guide_badge_code && (
                  <p className="mt-1 text-xs text-gray-500">
                    Badge code: <span className="font-mono font-semibold">{user.guide_badge_code}</span>
                  </p>
                )}
              </div>
            </div>
          ) : user.guide_badge_code ? (
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-gray-400" />
              <span className="font-mono font-semibold text-gray-700">{user.guide_badge_code}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-semibold">No badge uploaded yet — add one below to verify your credentials</span>
            </div>
          )}
        </div>

        {/* Contact info */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
            Contact Information
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* View as traveler button */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            disabled
            className="w-full rounded-full border-2 border-gray-200 bg-gray-50 py-3 text-sm font-bold text-gray-400 cursor-not-allowed"
          >
            🔒 Public profile view (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
}

