/**
 * Identity providers offered on the sign-in screen.
 * Google only — X/Twitter removed from the UI.
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
];
