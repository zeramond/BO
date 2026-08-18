import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth/admin";
import { getSql } from "@/lib/db";
import ScheduleDashboard from "./ScheduleDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ScheduleReservation = {
  id: string;
  name: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  duration_minutes: number;
  guests: number;
  occasion: string | null;
  notes: string | null;
  status: string;
  source: string | null;
};

export default async function SchedulePage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const sql = getSql();

  const data = await sql`
    SELECT
      id::text AS id,
      name,
      phone,
      reservation_date::text AS reservation_date,
      reservation_time,
      duration_minutes,
      guests,
      occasion,
      notes,
      status,
      source
    FROM reservations
    WHERE status = 'confirmed'
    ORDER BY reservation_date ASC
  `;

  return (
    <ScheduleDashboard
      reservations={data as unknown as ScheduleReservation[]}
    />
  );
}
