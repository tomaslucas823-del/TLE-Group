/**
 * Identity providers offered on the sign-in screen.
 *
 * On Vercel we use Better Auth built-in socialProviders (Google + X/Twitter)
 * with credentials from GOOGLE_* and TWITTER_* env vars. providerId matches
 * Better Auth's social id so the client can call signIn.social().
 */
export type GrokProvider = {
  /** Better Auth social provider id / callback path segment. */
  providerId: "google" | "twitter";
  /** Upstream id (same as providerId for native social). */
  idp: string;
  /** Human label for the sign-in button. */
  label: string;
};

export const GROK_PROVIDERS: readonly GrokProvider[] = [
  { providerId: "google", idp: "google", label: "Google" },
  { providerId: "twitter", idp: "twitter", label: "X" },
];
