import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin";
import { getSql } from "@/lib/db";
import { checkReservationCapacity } from "@/lib/reservations/capacity";

const allowedTimes = new Set([
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM","10:30 PM","11:00 PM","11:30 PM","12:00 AM","12:30 AM","1:00 AM","1:30 AM"
]);
const allowedDurations = new Set([60,90,120,150,180]);

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const reservationDate = String(body.date ?? "").trim();
    const reservationTime = String(body.time ?? "").trim();
    const guests = Number(body.guests);
    const duration = Number(body.duration);
    const occasion = String(body.occasion ?? "").trim();
    const notes = String(body.notes ?? "").trim();
    const allowConflict = body.allowConflict === true;

    if (!name || !phone || !reservationDate || !reservationTime || !Number.isInteger(guests) || guests < 1 || guests > 64 || !Number.isInteger(duration) || !allowedDurations.has(duration)) {
      return NextResponse.json({ error: "Invalid reservation details." }, { status: 400 });
    }
    if (!allowedTimes.has(reservationTime)) {
      return NextResponse.json({ error: "Invalid reservation time." }, { status: 400 });
    }

    const sql = getSql();
    const confirmedReservations = await sql`
      SELECT id::text AS id, reservation_date::text AS reservation_date, reservation_time, duration_minutes, guests
      FROM reservations
      WHERE status = 'confirmed'
    `;

    const capacity = checkReservationCapacity({
      id: "new-manual-reservation",
      reservation_date: reservationDate,
      reservation_time: reservationTime,
      duration_minutes: duration,
      guests,
    }, confirmedReservations as never[]);

    if (capacity.hasConflict && !allowConflict) {
      return NextResponse.json({ error: "capacity_conflict", capacity }, { status: 409 });
    }

    const rows = await sql`
      INSERT INTO reservations (name, phone, reservation_date, reservation_time, duration_minutes, guests, occasion, notes, status, source)
      VALUES (${name}, ${phone}, ${reservationDate}::date, ${reservationTime}, ${duration}, ${guests}, ${occasion || null}, ${notes || null}, 'confirmed', 'manual')
      RETURNING id::text AS id, created_at::text AS created_at, name, phone, reservation_date::text AS reservation_date, reservation_time, duration_minutes, guests, occasion, notes, status, source
    `;

    return NextResponse.json({ success: true, reservation: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Manual reservation API error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
