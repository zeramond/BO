import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import ReservationsDashboard from "./ReservationsDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ReservationsPage() {
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
    .select(
      `
        id,
        created_at,
        name,
        phone,
        reservation_date,
        reservation_time,
        guests,
        occasion,
        notes,
        status
      `
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Unable to load reservations: ${error.message}`
    );
  }

  return (
    <ReservationsDashboard
      initialReservations={data ?? []}
    />
  );
}