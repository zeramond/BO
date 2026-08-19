"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import {
  checkReservationCapacity,
  getLanesRequired,
} from "@/lib/reservations/capacity";
import Link from "next/link";

type Status = "pending" | "confirmed" | "completed" | "cancelled";

type Reservation = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  duration_minutes: number;
  guests: number;
  occasion: string | null;
  notes: string | null;
  status: Status;
  source: "website" | "manual";
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  landing_page: string | null;
  referrer: string | null;
  confirmed_at: string | null;
  completed_at: string | null;
};

type Props = {
  initialReservations: Reservation[];
  weekStart: string;
};

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

export default function ReservationsDashboard({
  initialReservations,
  weekStart,
}: Props) {
  const router = useRouter();

  const [reservations, setReservations] = useState(initialReservations);

  const [filter, setFilter] = useState<"all" | Status>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDuration, setEditDuration] = useState(60);

  const filteredReservations = useMemo(() => {
    if (filter === "all") {
      return reservations;
    }

    return reservations.filter((reservation) => reservation.status === filter);
  }, [filter, reservations]);

  const counts = {
    pending: reservations.filter(
      (reservation) => reservation.status === "pending",
    ).length,
    confirmed: reservations.filter(
      (reservation) => reservation.status === "confirmed",
    ).length,
    completed: reservations.filter(
      (reservation) => reservation.status === "completed",
    ).length,
    cancelled: reservations.filter(
      (reservation) => reservation.status === "cancelled",
    ).length,
  };

  const weekStartTime = new Date(weekStart).getTime();
  const weeklyCounts = {
    submissions: reservations.filter(
      (reservation) =>
        new Date(reservation.created_at).getTime() >= weekStartTime,
    ).length,
    confirmed: reservations.filter(
      (reservation) =>
        reservation.confirmed_at &&
        new Date(reservation.confirmed_at).getTime() >= weekStartTime,
    ).length,
    completed: reservations.filter(
      (reservation) =>
        reservation.completed_at &&
        new Date(reservation.completed_at).getTime() >= weekStartTime,
    ).length,
  };

  const confirmedReservations = reservations.filter(
    (reservation) => reservation.status === "confirmed",
  );

  const getCapacityInfo = (reservation: Reservation) => {
    return checkReservationCapacity(
      {
        id: reservation.id,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        duration_minutes: reservation.duration_minutes,
        guests: reservation.guests,
      },
      confirmedReservations.map((confirmed) => ({
        id: confirmed.id,
        reservation_date: confirmed.reservation_date,
        reservation_time: confirmed.reservation_time,
        duration_minutes: confirmed.duration_minutes,
        guests: confirmed.guests,
      })),
    );
  };

  const updateStatus = async (id: string, status: Status) => {
    if (status === "confirmed") {
      const reservation = reservations.find(
        (reservation) => reservation.id === id,
      );

      if (reservation) {
        const capacity = getCapacityInfo(reservation);

        if (capacity.hasConflict) {
          const confirmAnyway = window.confirm(
            `Lane capacity conflict.\n\n` +
              `This reservation requires ${capacity.lanesRequired} lanes, ` +
              `but only ${capacity.minimumLanesAvailable} are available during part of the requested period.\n\n` +
              `Do you want to confirm it anyway?`,
          );

          if (!confirmAnyway) {
            return;
          }
        }
      }
    }

    setUpdatingId(id);

    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Unable to update reservation.");
      }

      const result = await response.json();

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id
            ? { ...reservation, ...result.reservation }
            : reservation,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("The reservation status could not be updated.");
    } finally {
      setUpdatingId(null);
    }
  };

  const startEditing = (reservation: Reservation) => {
    setEditingId(reservation.id);
    setEditDate(reservation.reservation_date);
    setEditTime(reservation.reservation_time);
    setEditDuration(reservation.duration_minutes);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditDate("");
    setEditTime("");
  };

  const saveDateTime = async (id: string) => {
    if (!editDate || !editTime) {
      alert("Please select both a date and time.");
      return;
    }

    setUpdatingId(id);

    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: editDate,
          time: editTime,
          duration: editDuration,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update reservation date and time.");
      }

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id
            ? {
                ...reservation,
                reservation_date: editDate,
                reservation_time: editTime,
                duration_minutes: editDuration,
              }
            : reservation,
        ),
      );

      cancelEditing();
    } catch (error) {
      console.error(error);
      alert("The reservation date and time could not be updated.");
    } finally {
      setUpdatingId(null);
    }
  };

  const logout = async () => {
    await authClient.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#080808] px-5 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-fuchsia-300">
              BO BOWLING
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Reservations
            </h1>
            <p className="mt-3 text-gray-500">
              Manage website reservation requests.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/schedule"
              className="rounded-full border border-fuchsia-400/30 px-5 py-2 text-sm text-fuchsia-300 transition hover:bg-fuchsia-400 hover:text-black"
            >
              Schedule
            </Link>
            <button
              onClick={logout}
              className="rounded-full border border-white/20 px-5 py-2 text-sm transition hover:bg-white hover:text-black"
            >
              Log Out
            </button>
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300">
                Last 7 Days
              </p>
              <h2 className="mt-2 text-xl font-semibold">Reservation Funnel</h2>
            </div>
            <p className="text-sm text-gray-500">
              Reserve-page visits are available in GA4.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="Form submissions" value={weeklyCounts.submissions} />
            <Metric label="Confirmed" value={weeklyCounts.confirmed} />
            <Metric label="Completed" value={weeklyCounts.completed} />
          </div>
        </section>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CountCard label="Pending" count={counts.pending} onClick={() => setFilter("pending")} />
          <CountCard label="Confirmed" count={counts.confirmed} onClick={() => setFilter("confirmed")} />
          <CountCard label="Completed" count={counts.completed} onClick={() => setFilter("completed")} />
          <CountCard label="Cancelled" count={counts.cancelled} onClick={() => setFilter("cancelled")} />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full px-5 py-2 text-sm capitalize transition ${
                  filter === status
                    ? "bg-white text-black"
                    : "border border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>

        <div className="mt-8 space-y-4">
          {filteredReservations.length === 0 && (
            <div className="rounded-2xl border border-white/10 p-10 text-center text-gray-500">
              No reservations found.
            </div>
          )}

          {filteredReservations.map((reservation) => (
            <article
              key={reservation.id}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold">{reservation.name}</h2>
                    <StatusBadge status={reservation.status} />
                  </div>

                  <p className="mt-2 text-gray-400">{reservation.phone}</p>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <Detail label="Date" value={reservation.reservation_date} />
                    <Detail label="Time" value={reservation.reservation_time} />
                    <Detail label="Guests" value={String(reservation.guests)} />
                    <Detail label="Occasion" value={reservation.occasion || "General Visit"} />
                    <Detail label="Duration" value={formatDuration(reservation.duration_minutes)} />
                    <Detail label="Lead source" value={formatLeadSource(reservation)} />
                    {reservation.utm_campaign && (
                      <Detail label="Campaign" value={reservation.utm_campaign} />
                    )}
                  </div>

                  {(() => {
                    if (reservation.status === "completed") {
                      return (
                        <div className="mt-6 rounded-xl border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-3">
                          <p className="font-semibold text-fuchsia-300">
                            ✓ Completed Reservation
                          </p>
                          <p className="mt-1 text-sm text-fuchsia-200/70">
                            This visit is included in the completed-reservation funnel count.
                          </p>
                        </div>
                      );
                    }

                    const capacity = getCapacityInfo(reservation);
                    const lanesNeeded = getLanesRequired(reservation.guests);
                    const lanesAvailable =
                      reservation.status === "confirmed"
                        ? Math.max(0, capacity.minimumLanesAvailable - lanesNeeded)
                        : capacity.minimumLanesAvailable;

                    if (reservation.status === "confirmed") {
                      return (
                        <div className="mt-6 rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-3">
                          <p className="font-semibold text-blue-300">✓ Confirmed Reservation</p>
                          <p className="mt-1 text-sm text-blue-200/70">
                            Uses {lanesNeeded} {lanesNeeded === 1 ? "lane" : "lanes"}. At least {lanesAvailable} of 8 lanes remain available during this period.
                          </p>
                        </div>
                      );
                    }

                    if (capacity.hasConflict) {
                      return (
                        <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
                          <p className="font-semibold text-red-300">⚠ Lane Capacity Conflict</p>
                          <p className="mt-1 text-sm text-red-200/70">
                            This reservation requires {lanesNeeded} {lanesNeeded === 1 ? "lane" : "lanes"}, but only {capacity.minimumLanesAvailable} are available during part of this reservation.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3">
                        <p className="font-semibold text-green-300">✓ Capacity Available</p>
                        <p className="mt-1 text-sm text-green-200/70">
                          Requires {lanesNeeded} {lanesNeeded === 1 ? "lane" : "lanes"}. At least {capacity.minimumLanesAvailable} of 8 lanes are currently available during this period.
                        </p>
                      </div>
                    );
                  })()}

                  {reservation.notes && (
                    <div className="mt-6">
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-600">Notes</p>
                      <p className="mt-2 max-w-3xl text-gray-300">{reservation.notes}</p>
                    </div>
                  )}

                  {editingId === reservation.id && (
                    <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5">
                      <p className="text-sm font-semibold">Update Date & Time</p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">Date</label>
                          <input
                            type="date"
                            value={editDate}
                            onChange={(event) => setEditDate(event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-white outline-none focus:border-fuchsia-400/50"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">Time</label>
                          <select
                            value={editTime}
                            onChange={(event) => setEditTime(event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-white outline-none focus:border-fuchsia-400/50"
                          >
                            {reservationTimes.map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">Duration</label>
                          <select
                            value={editDuration}
                            onChange={(event) => setEditDuration(Number(event.target.value))}
                            className="w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-white outline-none focus:border-fuchsia-400/50"
                          >
                            {reservationDurations.map((duration) => (
                              <option key={duration.value} value={duration.value}>{duration.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          onClick={() => saveDateTime(reservation.id)}
                          disabled={updatingId === reservation.id}
                          className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] disabled:opacity-50"
                        >
                          {updatingId === reservation.id ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                          onClick={cancelEditing}
                          disabled={updatingId === reservation.id}
                          className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-gray-300 transition hover:border-white hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 lg:flex-col">
                  <StatusButton label="Confirm" disabled={updatingId === reservation.id} active={reservation.status === "confirmed"} onClick={() => updateStatus(reservation.id, "confirmed")} />
                  <StatusButton label="Complete" disabled={updatingId === reservation.id} active={reservation.status === "completed"} onClick={() => updateStatus(reservation.id, "completed")} />
                  <StatusButton label="Pending" disabled={updatingId === reservation.id} active={reservation.status === "pending"} onClick={() => updateStatus(reservation.id, "pending")} />
                  <StatusButton label="Cancel" disabled={updatingId === reservation.id} active={reservation.status === "cancelled"} onClick={() => updateStatus(reservation.id, "cancelled")} />
                  <button
                    onClick={() => startEditing(reservation)}
                    className="mt-2 min-w-24 rounded-full border border-fuchsia-400/30 px-5 py-2 text-sm text-fuchsia-300 transition hover:bg-fuchsia-400 hover:text-black lg:mt-3"
                  >
                    Edit Date & Time
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function CountCard({ label, count, onClick }: { label: string; count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left transition hover:bg-white/[0.07]">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-4xl font-semibold">{count}</p>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-5 py-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-gray-600">{label}</p>
      <p className="mt-1 text-white">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const styles = {
    pending: "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    confirmed: "border-green-400/20 bg-green-400/10 text-green-300",
    completed: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-300",
    cancelled: "border-red-400/20 bg-red-400/10 text-red-300",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

function StatusButton({ label, active, disabled, onClick }: { label: string; active: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || active}
      className={`min-w-24 rounded-full px-5 py-2 text-sm transition ${
        active
          ? "bg-white text-black"
          : "border border-white/15 text-gray-300 hover:bg-white hover:text-black"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {label}
    </button>
  );
}

function formatDuration(minutes: number) {
  if (minutes === 60) return "1 Hour";
  if (minutes === 90) return "1.5 Hours";
  if (minutes === 120) return "2 Hours";
  if (minutes === 150) return "2.5 Hours";
  if (minutes === 180) return "3 Hours";
  return `${minutes} Minutes`;
}

function formatLeadSource(reservation: Reservation) {
  if (reservation.source === "manual") {
    return "Manual entry";
  }

  if (reservation.utm_source) {
    return reservation.utm_medium
      ? `${reservation.utm_source} / ${reservation.utm_medium}`
      : reservation.utm_source;
  }

  if (reservation.referrer) {
    try {
      return new URL(reservation.referrer).hostname;
    } catch {
      return "Referral";
    }
  }

  return "Website · direct";
}
