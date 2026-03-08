import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type SupabasePublicKeyEnvName =
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"
  | "SUPABASE_ANON_KEY"
  | "SUPABASE_PUBLISHABLE_KEY";

const PUBLIC_KEY_ENV_NAMES: SupabasePublicKeyEnvName[] = [
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
  "SUPABASE_ANON_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
];

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getRequiredUrl(): string {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL") ?? readEnv("SUPABASE_URL");
  if (!url) {
    throw new Error(
      "Missing required Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL for server-only).",
    );
  }
  return url;
}

function getRequiredPublicKey(): string {
  for (const name of PUBLIC_KEY_ENV_NAMES) {
    const value = readEnv(name);
    if (value) return value;
  }

  throw new Error(
    `Missing required Supabase key. Set one of: ${PUBLIC_KEY_ENV_NAMES.join(", ")}`,
  );
}

let cachedClient: SupabaseClient | null = null;

// Lazy singleton client for use across server/client modules.
export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  cachedClient = createClient(getRequiredUrl(), getRequiredPublicKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

// Backward-compatible client export with lazy initialization.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabaseClient(), prop, receiver);
  },
});
