import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import ScheduleDashboard from "./ScheduleDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SchedulePage() {
  const authClient = await createSupabaseServerClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (
    !user ||
    !user.email ||
    user.email.toLowerCase() !==
      process.env.ADMIN_EMAIL?.toLowerCase()
  ) {
    redirect("/admin/login");
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("reservations")
    .select(`
      id,
      name,
      phone,
      reservation_date,
      reservation_time,
      duration_minutes,
      guests,
      occasion,
      notes,
      status,
      source
    `)
    .eq("status", "confirmed")
    .order("reservation_date", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Unable to load schedule: ${error.message}`
    );
  }

  return (
    <ScheduleDashboard
      reservations={data ?? []}
    />
  );
}