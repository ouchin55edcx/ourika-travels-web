"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AuthUser } from "@/lib/auth";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => { },
});

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    // Force a sync with Supabase session on mount to prevent stale server state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setUser(null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Always clear user on sign out — handle this FIRST
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (data) {
          setUser(data as AuthUser);
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name:
              session.user.user_metadata?.full_name ||
              session.user.email?.split('@')[0] ||
              'User',
            role: (session.user.user_metadata?.role as any) || 'tourist',
            avatar_url: session.user.user_metadata?.avatar_url || null,
            phone: session.user.user_metadata?.phone || null,
            bio: null,
            guide_badge_code: null,
            badge_image_url: null,
            email_verified: !!session.user.email_confirmed_at,
            is_active: true,
            specialties: [],
            languages: [],
            location: null,
            years_experience: null,
            certifications: [],
            is_verified: false,
            verification_status: 'unsubmitted',
            verification_note: null,
            verified_at: null,
          } as AuthUser);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
