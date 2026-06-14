/** Client-side filter for demo / bot accounts in Super Admin lists. */

export function isDemoOrBotUser(
  uid: string,
  data: { username?: string; isDemoAccount?: boolean }
): boolean {
  if (data.isDemoAccount === true) return true;
  if (uid.startsWith("demo-")) return true;
  const username = (data.username ?? "").toLowerCase();
  if (username.startsWith("demo_") || username.startsWith("demo-")) return true;
  return false;
}
