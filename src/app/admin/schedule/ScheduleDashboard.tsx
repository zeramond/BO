"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  getLanesRequired,
  parseReservationDateTime,
} from "@/lib/reservations/capacity";
import ManualReservationModal from "./ManualReservationModal";

type Reservation = {
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

type Props = {
  reservations: Reservation[];
};

export default function ScheduleDashboard({
  reservations,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(
    getTodayString()
  );
  const [showAddReservation, setShowAddReservation] =
  useState(false);

  const reservationsForDate = useMemo(() => {
    return reservations
      .filter(
        (reservation) =>
          reservation.reservation_date === selectedDate
      )
      .sort((a, b) => {
        const aTime = parseReservationDateTime(
          a.reservation_date,
          a.reservation_time
        ).getTime();

        const bTime = parseReservationDateTime(
          b.reservation_date,
          b.reservation_time
        ).getTime();

        return aTime - bTime;
      });
  }, [reservations, selectedDate]);

  const totalLanesBooked =
    reservationsForDate.reduce(
      (total, reservation) =>
        total +
        getLanesRequired(reservation.guests),
      0
    );

  const changeDate = (days: number) => {
    setSelectedDate((current) =>
      shiftDate(current, days)
    );
  };

  return (
    <main className="min-h-screen bg-[#080808] px-5 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-fuchsia-300">
              BO BOWLING
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Schedule
            </h1>

            <p className="mt-3 text-gray-500">
              Confirmed reservations and lane usage.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/reservations"
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-gray-300 transition hover:bg-white hover:text-black"
            >
              Reservations
            </Link>

            <button
  type="button"
  onClick={() =>
    setShowAddReservation(true)
  }
  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:scale-105"
>
  + Add Reservation
</button>
          </div>
        </header>

        {/* DATE NAVIGATION */}
        <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
              Viewing
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              {formatDisplayDate(selectedDate)}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => changeDate(-1)}
              className="rounded-full border border-white/15 px-5 py-2 text-sm transition hover:bg-white hover:text-black"
            >
              ← Previous
            </button>

            <button
              onClick={() =>
                setSelectedDate(getTodayString())
              }
              className="rounded-full border border-white/15 px-5 py-2 text-sm transition hover:bg-white hover:text-black"
            >
              Today
            </button>

            <button
              onClick={() => changeDate(1)}
              className="rounded-full border border-white/15 px-5 py-2 text-sm transition hover:bg-white hover:text-black"
            >
              Next →
            </button>
            <input
  type="date"
  value={selectedDate}
  onChange={(event) => setSelectedDate(event.target.value)}
  className="rounded-full border border-white/15 bg-[#171717] px-4 py-2 text-sm text-white outline-none transition focus:border-fuchsia-400/50"
/>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Reservations"
            value={String(
              reservationsForDate.length
            )}
          />

          <SummaryCard
            label="Total Guests"
            value={String(
              reservationsForDate.reduce(
                (total, reservation) =>
                  total + reservation.guests,
                0
              )
            )}
          />

          <SummaryCard
            label="Lanes Across Bookings"
            value={String(totalLanesBooked)}
          />
        </div>

        {/* SCHEDULE */}
        <div className="mt-8">
          {reservationsForDate.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
              <p className="text-xl font-semibold">
                No confirmed reservations
              </p>

              <p className="mt-2 text-gray-500">
                There are no confirmed bookings for
                this date.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservationsForDate.map(
                (reservation) => {
                  const lanes =
                    getLanesRequired(
                      reservation.guests
                    );

                  const endTime =
                    getReservationEndTime(
                      reservation
                    );

                  return (
                    <article
                      key={reservation.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"
                    >
                      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-semibold">
                              {reservation.name}
                            </h3>

                            <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs text-green-300">
                              Confirmed
                            </span>

                            {reservation.source ===
                              "manual" && (
                              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs text-blue-300">
                                Manual
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-gray-400">
                            {reservation.phone}
                          </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                          <Detail
                            label="Time"
                            value={`${reservation.reservation_time} – ${endTime}`}
                          />

                          <Detail
                            label="Duration"
                            value={formatDuration(
                              reservation.duration_minutes
                            )}
                          />

                          <Detail
                            label="Guests"
                            value={String(
                              reservation.guests
                            )}
                          />

                          <Detail
                            label="Lanes"
                            value={`${lanes} ${
                              lanes === 1
                                ? "lane"
                                : "lanes"
                            }`}
                          />

                          <Detail
                            label="Occasion"
                            value={
                              reservation.occasion ||
                              "General Visit"
                            }
                          />
                        </div>
                      </div>

                      {reservation.notes && (
                        <div className="mt-6 border-t border-white/10 pt-5">
                          <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
                            Notes
                          </p>

                          <p className="mt-2 text-gray-300">
                            {reservation.notes}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
      <ManualReservationModal
  open={showAddReservation}
  onClose={() =>
    setShowAddReservation(false)
  }
  defaultDate={selectedDate}
  reservations={reservations.map(
    (reservation) => ({
      id: reservation.id,
      reservation_date:
        reservation.reservation_date,
      reservation_time:
        reservation.reservation_time,
      duration_minutes:
        reservation.duration_minutes,
      guests: reservation.guests,
    })
  )}
/>
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-4xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
        {label}
      </p>

      <p className="mt-1 whitespace-nowrap text-white">
        {value}
      </p>
    </div>
  );
}

function getReservationEndTime(
  reservation: Reservation
) {
  const start = parseReservationDateTime(
    reservation.reservation_date,
    reservation.reservation_time
  );

  const end = new Date(
    start.getTime() +
      reservation.duration_minutes * 60_000
  );

  return end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(minutes: number) {
  if (minutes === 60) return "1 Hour";
  if (minutes === 90) return "1.5 Hours";
  if (minutes === 120) return "2 Hours";
  if (minutes === 150) return "2.5 Hours";
  if (minutes === 180) return "3 Hours";

  return `${minutes} Minutes`;
}

function getTodayString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function shiftDate(
  dateString: string,
  days: number
) {
  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  const date = new Date(
    year,
    month - 1,
    day + days,
    12
  );

  const newYear = date.getFullYear();
  const newMonth = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const newDay = String(
    date.getDate()
  ).padStart(2, "0");

  return `${newYear}-${newMonth}-${newDay}`;
}

function formatDisplayDate(
  dateString: string
) {
  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  const date = new Date(
    year,
    month - 1,
    day,
    12
  );

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}