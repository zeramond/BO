import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  checkReservationCapacity,
} from "@/lib/reservations/capacity";

const allowedTimes = new Set([
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
  "11:30 PM",
  "12:00 AM",
  "12:30 AM",
  "1:00 AM",
  "1:30 AM",
]);

const allowedDurations = new Set([
  60,
  90,
  120,
  150,
  180,
]);

export async function POST(request: Request) {
  const authClient =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (
    !user ||
    !user.email ||
    user.email.toLowerCase() !==
      process.env.ADMIN_EMAIL?.toLowerCase()
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    const reservationDate = String(
      body.date ?? ""
    ).trim();

    const reservationTime = String(
      body.time ?? ""
    ).trim();

    const guests = Number(body.guests);
    const duration = Number(body.duration);

    const occasion = String(
      body.occasion ?? ""
    ).trim();

    const notes = String(
      body.notes ?? ""
    ).trim();

    const allowConflict =
      body.allowConflict === true;

    if (
      !name ||
      !phone ||
      !reservationDate ||
      !reservationTime ||
      !Number.isInteger(guests) ||
      guests < 1 ||
      guests > 64 ||
      !Number.isInteger(duration) ||
      !allowedDurations.has(duration)
    ) {
      return NextResponse.json(
        { error: "Invalid reservation details." },
        { status: 400 }
      );
    }

    if (!allowedTimes.has(reservationTime)) {
      return NextResponse.json(
        { error: "Invalid reservation time." },
        { status: 400 }
      );
    }

    const supabase =
      createSupabaseAdminClient();

    /*
     * Check currently confirmed reservations
     * before creating the manual booking.
     */
    const {
      data: confirmedReservations,
      error: capacityError,
    } = await supabase
      .from("reservations")
      .select(`
        id,
        reservation_date,
        reservation_time,
        duration_minutes,
        guests
      `)
      .eq("status", "confirmed");

    if (capacityError) {
      console.error(
        "Capacity lookup error:",
        capacityError
      );

      return NextResponse.json(
        { error: "Unable to check capacity." },
        { status: 500 }
      );
    }

    const capacity =
      checkReservationCapacity(
        {
          id: "new-manual-reservation",
          reservation_date: reservationDate,
          reservation_time: reservationTime,
          duration_minutes: duration,
          guests,
        },
        confirmedReservations ?? []
      );

    /*
     * Warn first instead of silently overbooking.
     */
    if (
      capacity.hasConflict &&
      !allowConflict
    ) {
      return NextResponse.json(
        {
          error: "capacity_conflict",
          capacity,
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Manual reservations are created confirmed.
     */
    const { data, error } = await supabase
      .from("reservations")
      .insert({
        name,
        phone,
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        duration_minutes: duration,
        guests,
        occasion: occasion || null,
        notes: notes || null,
        status: "confirmed",
        source: "manual",
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Manual reservation insert error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to create reservation.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        reservation: data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Manual reservation API error:",
      error
    );

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}