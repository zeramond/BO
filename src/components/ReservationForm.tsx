"use client";

import Script from "next/script";
import { FormEvent, useRef, useState } from "react";

import { trackEvent } from "@/lib/analytics";

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
    };
  }
}

const reservationTimes = [
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
];

const reservationDurations = [
  { label: "1 Hour", value: 60 },
  { label: "1.5 Hours", value: 90 },
  { label: "2 Hours", value: 120 },
  { label: "2.5 Hours", value: 150 },
  { label: "3 Hours", value: 180 },
];

type ReservationFormProps = {
  location?: "homepage" | "reserve_page";
};

export default function ReservationForm({
  location = "homepage",
}: ReservationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [minDate] = useState(() => getOmanDate(new Date()));
  const formStarted = useRef(false);

  const handleFormStart = () => {
    if (formStarted.current) {
      return;
    }

    formStarted.current = true;
    trackEvent("reservation_form_start", {
      form_name: "bowling_reservation",
      form_location: location,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const reservation = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      date: formData.get("date"),
      time: formData.get("time"),
      duration: Number(formData.get("duration")),
      guests: Number(formData.get("guests")),
      occasion: formData.get("occasion"),
      notes: formData.get("notes"),
      website: formData.get("website"),
      turnstileToken: formData.get("cf-turnstile-response"),
      formLocation: location,
    };

    setSubmitting(true);
    setSubmitted(false);
    setError(false);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Reservation submission failed");
      }

      form.reset();
      setSubmitted(true);
      trackEvent("generate_lead", {
        form_name: "bowling_reservation",
        form_location: location,
        service: "bowling",
      });
    } catch (submissionError) {
      console.error(submissionError);
      setError(true);
      trackEvent("reservation_submit_error", {
        form_name: "bowling_reservation",
        form_location: location,
      });
    } finally {
      setSubmitting(false);
      window.turnstile?.reset();
    }
  };

  return (
    <div
      id="reservation-form"
      className="scroll-mt-28 rounded-[28px] border border-white/10 bg-black/55 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
    >
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
          Bowling Pricing & Availability
        </p>

        <h2 className="mt-3 text-3xl font-semibold">
          Check Pricing & Availability
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          From 10.5 OMR per lane/hour. Send your preferred time and our team
          will respond within one hour during opening hours.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        onFocusCapture={handleFormStart}
        className="space-y-5"
      >
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor={`website-${location}`}>Website</label>
          <input
            id={`website-${location}`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor={`name-${location}`}
            className="mb-2 block text-sm text-gray-300"
          >
            Full Name
          </label>
          <input
            id={`name-${location}`}
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-fuchsia-400/60 focus:bg-white/[0.09]"
          />
        </div>

        <div>
          <label
            htmlFor={`phone-${location}`}
            className="mb-2 block text-sm text-gray-300"
          >
            Phone Number
          </label>
          <input
            id={`phone-${location}`}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+968"
            className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-fuchsia-400/60 focus:bg-white/[0.09]"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`date-${location}`}
              className="mb-2 block text-sm text-gray-300"
            >
              Preferred Date
            </label>
            <input
              id={`date-${location}`}
              name="date"
              type="date"
              min={minDate}
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/60 focus:bg-white/[0.09]"
            />
          </div>

          <div>
            <label
              htmlFor={`time-${location}`}
              className="mb-2 block text-sm text-gray-300"
            >
              Preferred Time
            </label>
            <select
              id={`time-${location}`}
              name="time"
              required
              defaultValue=""
              className="w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/60"
            >
              <option value="" disabled>
                Select a time
              </option>
              {reservationTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`guests-${location}`}
              className="mb-2 block text-sm text-gray-300"
            >
              Number of Guests
            </label>
            <input
              id={`guests-${location}`}
              name="guests"
              type="number"
              min="1"
              max="64"
              required
              inputMode="numeric"
              placeholder="4"
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-fuchsia-400/60 focus:bg-white/[0.09]"
            />
          </div>

          <div>
            <label
              htmlFor={`duration-${location}`}
              className="mb-2 block text-sm text-gray-300"
            >
              Reservation Duration
            </label>
            <select
              id={`duration-${location}`}
              name="duration"
              required
              defaultValue="60"
              className="w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/60"
            >
              {reservationDurations.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor={`occasion-${location}`}
            className="mb-2 block text-sm text-gray-300"
          >
            Occasion
          </label>
          <select
            id={`occasion-${location}`}
            name="occasion"
            defaultValue="General Visit"
            className="w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/60"
          >
            <option>General Visit</option>
            <option>Birthday</option>
            <option>Corporate Event</option>
            <option>School / University</option>
            <option>Group Event</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor={`notes-${location}`}
            className="mb-2 block text-sm text-gray-300"
          >
            Additional Notes
          </label>
          <textarea
            id={`notes-${location}`}
            name="notes"
            rows={4}
            placeholder="Anything else we should know?"
            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-fuchsia-400/60 focus:bg-white/[0.09]"
          />
        </div>

        <div className="flex justify-center py-2">
          <div
            className="cf-turnstile"
            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            data-theme="dark"
            data-size="flexible"
          />
        </div>

        <p className="text-center text-xs leading-5 text-gray-500">
          No commitment required. Your booking is confirmed only after our team
          contacts you with availability and final details.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-white px-8 py-4 font-semibold text-black transition duration-300 hover:scale-[1.02] hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending Request..." : "Check Pricing & Availability"}
        </button>

        {submitted && (
          <div
            role="status"
            className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-center text-sm text-green-300"
          >
            ✓ Request received. Our team will respond within one hour during
            opening hours to confirm pricing and availability.
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-center text-sm text-red-300"
          >
            Something went wrong. Please try again or contact us on WhatsApp.
          </div>
        )}
      </form>
    </div>
  );
}

function getOmanDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Muscat",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}
