import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const allowedStatuses = new Set([
  "pending",
  "confirmed",
  "cancelled",
]);

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

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
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
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json();

  const updates: {
    status?: string;
    reservation_date?: string;
    reservation_time?: string;
  } = {};

  if (body.status !== undefined) {
    const status = String(body.status);

    if (!allowedStatuses.has(status)) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 }
      );
    }

    updates.status = status;
  }

  if (body.date !== undefined) {
    const date = String(body.date).trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Invalid reservation date." },
        { status: 400 }
      );
    }

    updates.reservation_date = date;
  }

  if (body.time !== undefined) {
    const time = String(body.time).trim();

    if (!allowedTimes.has(time)) {
      return NextResponse.json(
        { error: "Invalid reservation time." },
        { status: 400 }
      );
    }

    updates.reservation_time = time;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No changes supplied." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("reservations")
    .update(updates)
    .eq("id", id)
    .select(
      `
        id,
        reservation_date,
        reservation_time,
        status
      `
    )
    .single();

  if (error) {
    console.error("Reservation update error:", error);

    return NextResponse.json(
      { error: "Unable to update reservation." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    reservation: data,
  });
}