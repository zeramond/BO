import { auth } from "@/lib/auth/server";

export async function getAdminSession() {
  const { data: session } = await auth.getSession();

  const email = session?.user?.email?.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!email || !adminEmail || email !== adminEmail) {
    return null;
  }

  return session;
}
