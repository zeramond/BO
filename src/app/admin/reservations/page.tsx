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

  const data = await sql`
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
      status
    FROM reservations
    ORDER BY created_at DESC
  `;

  return (
    <ReservationsDashboard
      initialReservations={data as never[]}
    />
  );
}
