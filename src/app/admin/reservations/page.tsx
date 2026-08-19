import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth/admin";
import { getSql } from "@/lib/db";
import ReservationsDashboard from "./ReservationsDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ReservationsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const sql = getSql();

  const [data, clock] = await Promise.all([
    sql`
      SELECT
        id::text AS id,
        created_at::text AS created_at,
        name,
        phone,
        reservation_date::text AS reservation_date,
        reservation_time,
        duration_minutes,
        guests,
        occasion,
        notes,
        status,
        source,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        landing_page,
        referrer,
        confirmed_at::text AS confirmed_at,
        completed_at::text AS completed_at
      FROM reservations
      ORDER BY created_at DESC
    `,
    sql`SELECT (now() - interval '7 days')::text AS week_start`,
  ]);

  const weekStart = String(clock[0]?.week_start ?? "");

  return (
    <ReservationsDashboard
      initialReservations={data as never[]}
      weekStart={weekStart}
    />
  );
}
