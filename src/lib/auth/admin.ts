import { auth } from "@/lib/auth/server";

export async function getAdminSession() {
  const { data: session } = await auth.getSession();

  const email = session?.user?.email?.trim().toLowerCase();
  const adminEmails = new Set(
    (process.env.ADMIN_EMAIL ?? "")
      .split(",")
      .map((configuredEmail) => configuredEmail.trim().toLowerCase())
      .filter(Boolean)
  );

  if (!email || !adminEmails.has(email)) {
    return null;
  }

  return session;
}
