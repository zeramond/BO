import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin";
import { getSql } from "@/lib/db";

const allowedStatuses = new Set(["pending", "confirmed", "completed", "cancelled"]);
const allowedTimes = new Set([
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM","10:30 PM","11:00 PM","11:30 PM","12:00 AM","12:30 AM","1:00 AM","1:30 AM"
]);
const allowedDurations = new Set([60, 90, 120, 150, 180]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  let status: string | null = null;
  let reservationDate: string | null = null;
  let reservationTime: string | null = null;
  let duration: number | null = null;

  if (body.status !== undefined) {
    const value = String(body.status);
    if (!allowedStatuses.has(value)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    status = value;
  }

  if (body.date !== undefined) {
    const value = String(body.date).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return NextResponse.json({ error: "Invalid reservation date." }, { status: 400 });
    }
    reservationDate = value;
  }

  if (body.time !== undefined) {
    const value = String(body.time).trim();
    if (!allowedTimes.has(value)) {
      return NextResponse.json({ error: "Invalid reservation time." }, { status: 400 });
    }
    reservationTime = value;
  }

  if (body.duration !== undefined) {
    const value = Number(body.duration);
    if (!Number.isInteger(value) || !allowedDurations.has(value)) {
      return NextResponse.json({ error: "Invalid reservation duration." }, { status: 400 });
    }
    duration = value;
  }

  if (status === null && reservationDate === null && reservationTime === null && duration === null) {
    return NextResponse.json({ error: "No changes supplied." }, { status: 400 });
  }

  try {
    const sql = getSql();
    const rows = await sql`
      UPDATE reservations
      SET
        status = COALESCE(${status}, status),
        reservation_date = COALESCE(${reservationDate}::date, reservation_date),
        reservation_time = COALESCE(${reservationTime}, reservation_time),
        duration_minutes = COALESCE(${duration}, duration_minutes),
        confirmed_at = CASE
          WHEN ${status} = 'confirmed' THEN COALESCE(confirmed_at, now())
          ELSE confirmed_at
        END,
        completed_at = CASE
          WHEN ${status} = 'completed' THEN COALESCE(completed_at, now())
          ELSE completed_at
        END
      WHERE id::text = ${id}
      RETURNING
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
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, reservation: rows[0] });
  } catch (error) {
    console.error("Reservation update error:", error);
    return NextResponse.json({ error: "Unable to update reservation." }, { status: 500 });
  }
}
