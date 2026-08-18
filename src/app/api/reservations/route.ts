import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getSql } from "@/lib/db";

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

const allowedDurations = new Set([60, 90, 120, 150, 180]);

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.RESERVATION_NOTIFICATION_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!process.env.DATABASE_URL || !turnstileSecretKey) {
      console.error("Missing Neon or Turnstile environment variables.");

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
    const website = String(body.website ?? "").trim();
    const turnstileToken = String(body.turnstileToken ?? "").trim();

    if (website) {
      console.warn("Honeypot blocked a reservation submission.");

      return NextResponse.json(
        { success: true },
        { status: 201 },
      );
    }

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

    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Human verification is required." },
        { status: 400 },
      );
    }

    const verificationData = new FormData();
    verificationData.append("secret", turnstileSecretKey);
    verificationData.append("response", turnstileToken);

    const verificationResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: verificationData,
      },
    );

    if (!verificationResponse.ok) {
      console.error("Turnstile verification request failed.");

      return NextResponse.json(
        { error: "Unable to verify request." },
        { status: 503 },
      );
    }

    const verificationResult = await verificationResponse.json();

    if (!verificationResult.success) {
      console.warn(
        "Turnstile rejected reservation:",
        verificationResult["error-codes"],
      );

      return NextResponse.json(
        { error: "Human verification failed." },
        { status: 403 },
      );
    }

    const sql = getSql();

    const rows = await sql`
      INSERT INTO reservations (
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
      )
      VALUES (
        ${name},
        ${phone},
        ${reservationDate}::date,
        ${reservationTime},
        ${duration},
        ${guests},
        ${occasion || null},
        ${notes || null},
        'pending',
        'website'
      )
      RETURNING id::text AS id
    `;

    const reservationId = String(rows[0]?.id ?? "");

    if (!reservationId) {
      throw new Error("Reservation insert did not return an ID.");
    }

    if (resendApiKey && notificationEmail && fromEmail) {
      try {
        const resend = new Resend(resendApiKey);

        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: notificationEmail,
          subject: `New Reservation Request — ${name}`,
          html: `
            <div style="font-family: Arial, Helvetica, sans-serif; max-width: 620px; margin: 0 auto; color: #111111;">
              <h1 style="margin-bottom: 8px;">New BO Bowling Reservation</h1>
              <p style="color: #666666; margin-top: 0;">
                A new reservation request has been submitted through the website.
              </p>
              <div style="margin-top: 30px; padding: 24px; border: 1px solid #e5e5e5; border-radius: 14px; background: #fafafa;">
                <p><strong>Name:</strong><br />${escapeHtml(name)}</p>
                <p><strong>Phone:</strong><br />${escapeHtml(phone)}</p>
                <p><strong>Date:</strong><br />${escapeHtml(reservationDate)}</p>
                <p><strong>Time:</strong><br />${escapeHtml(reservationTime)}</p>
                <p><strong>Duration:</strong><br />${duration} minutes</p>
                <p><strong>Guests:</strong><br />${guests}</p>
                <p><strong>Occasion:</strong><br />${escapeHtml(occasion || "General Visit")}</p>
                <p><strong>Notes:</strong><br />${escapeHtml(notes || "None")}</p>
              </div>
              <p style="margin-top: 24px; color: #666666; font-size: 13px;">
                Reservation ID: ${reservationId}
              </p>
              <p style="color: #888888; font-size: 12px;">
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
        console.error("Reservation notification email failed:", emailError);
      }
    } else {
      console.warn(
        "Resend environment variables are missing. Reservation saved without email notification.",
      );
    }

    return NextResponse.json(
      {
        success: true,
        reservationId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Reservation API error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
