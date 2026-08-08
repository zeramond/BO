import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.RESERVATION_NOTIFICATION_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!supabaseUrl || !supabaseSecretKey) {
      console.error("Missing Supabase environment variables.");

      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 },
      );
    }

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const reservationDate = String(body.date ?? "").trim();
    const reservationTime = String(body.time ?? "").trim();
    const guests = Number(body.guests);
    const duration = Number(body.duration);
    const occasion = String(body.occasion ?? "").trim();
    const notes = String(body.notes ?? "").trim();

    if (
      !name ||
      !phone ||
      !reservationDate ||
      !reservationTime ||
      !Number.isInteger(guests) ||
      guests < 1 ||
      !Number.isInteger(duration) ||
      !allowedDurations.has(duration)
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (guests > 64) {
      return NextResponse.json(
        { error: "Guest count is too high." },
        { status: 400 },
      );
    }

    if (!allowedTimes.has(reservationTime)) {
      return NextResponse.json(
        { error: "Invalid reservation time." },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    /*
     * 1. SAVE RESERVATION TO DATABASE
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
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase reservation error:", error);

      return NextResponse.json(
        { error: "Unable to save reservation." },
        { status: 500 },
      );
    }

    /*
     * 2. SEND STAFF EMAIL
     *
     * Reservation is already safely stored before
     * attempting the email.
     */
    if (resendApiKey && notificationEmail && fromEmail) {
      try {
        const resend = new Resend(resendApiKey);

        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: notificationEmail,
          subject: `New Reservation Request — ${name}`,
          html: `
            <div
              style="
                font-family: Arial, Helvetica, sans-serif;
                max-width: 620px;
                margin: 0 auto;
                color: #111111;
              "
            >
              <h1 style="margin-bottom: 8px;">
                New BO Bowling Reservation
              </h1>

              <p style="color: #666666; margin-top: 0;">
                A new reservation request has been submitted through the website.
              </p>

              <div
                style="
                  margin-top: 30px;
                  padding: 24px;
                  border: 1px solid #e5e5e5;
                  border-radius: 14px;
                  background: #fafafa;
                "
              >
                <p>
                  <strong>Name:</strong><br />
                  ${escapeHtml(name)}
                </p>

                <p>
                  <strong>Phone:</strong><br />
                  ${escapeHtml(phone)}
                </p>

                <p>
                  <strong>Date:</strong><br />
                  ${escapeHtml(reservationDate)}
                </p>

                <p>
                  <strong>Time:</strong><br />
                  ${escapeHtml(reservationTime)}
                </p>
                <p>
  <strong>Duration:</strong><br />
  ${duration} minutes
</p>

                <p>
                  <strong>Guests:</strong><br />
                  ${guests}
                </p>

                <p>
                  <strong>Occasion:</strong><br />
                  ${escapeHtml(occasion || "General Visit")}
                </p>

                <p>
                  <strong>Notes:</strong><br />
                  ${escapeHtml(notes || "None")}
                </p>
              </div>

              <p
                style="
                  margin-top: 24px;
                  color: #666666;
                  font-size: 13px;
                "
              >
                Reservation ID: ${data.id}
              </p>

              <p
                style="
                  color: #888888;
                  font-size: 12px;
                "
              >
                This request has been saved to the BO Bowling reservation database.
              </p>
            </div>
          `,
        });

        if (emailResult.error) {
          console.error(
            "Reservation notification email error:",
            emailResult.error,
          );
        }
      } catch (emailError) {
        /*
         * IMPORTANT:
         * We do not tell the customer their reservation failed
         * because the database save already succeeded.
         */
        console.error("Reservation notification email failed:", emailError);
      }
    } else {
      console.warn(
        "Resend environment variables are missing. Reservation saved without email notification.",
      );
    }

    /*
     * 3. RETURN SUCCESS
     */
    return NextResponse.json(
      {
        success: true,
        reservationId: data.id,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Reservation API error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

/*
 * Prevent submitted customer text from being interpreted
 * as HTML inside the notification email.
 */
function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
