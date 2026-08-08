"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  checkReservationCapacity,
  getLanesRequired,
} from "@/lib/reservations/capacity";

type ExistingReservation = {
  id: string;
  reservation_date: string;
  reservation_time: string;
  duration_minutes: number;
  guests: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  reservations: ExistingReservation[];
  defaultDate: string;
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

export default function ManualReservationModal({
  open,
  onClose,
  reservations,
  defaultDate,
}: Props) {
  const router = useRouter();

  const [date, setDate] =
    useState(defaultDate);

  const [time, setTime] =
    useState("");

  const [duration, setDuration] =
    useState(60);

  const [guests, setGuests] =
    useState(1);

  const [submitting, setSubmitting] =
    useState(false);

  const capacity = useMemo(() => {
    if (!date || !time || guests < 1) {
      return null;
    }

    return checkReservationCapacity(
      {
        id: "manual-new",
        reservation_date: date,
        reservation_time: time,
        duration_minutes: duration,
        guests,
      },
      reservations
    );
  }, [
    date,
    time,
    duration,
    guests,
    reservations,
  ]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    let allowConflict = false;

    if (capacity?.hasConflict) {
      const confirmed =
        window.confirm(
          `Lane capacity conflict.\n\n` +
            `This reservation requires ${capacity.lanesRequired} lanes, ` +
            `but only ${capacity.minimumLanesAvailable} are available during part of this period.\n\n` +
            `Create this reservation anyway?`
        );

      if (!confirmed) {
        return;
      }

      allowConflict = true;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/admin/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: formData.get("name"),
            phone: formData.get("phone"),
            date,
            time,
            duration,
            guests,
            occasion:
              formData.get("occasion"),
            notes: formData.get("notes"),
            allowConflict,
          }),
        }
      );

      /*
       * Capacity may have changed since
       * the modal initially checked it.
       */
      if (response.status === 409) {
        const result =
          await response.json();

        const newCapacity =
          result.capacity;

        const confirmAnyway =
          window.confirm(
            `The schedule changed and this reservation now conflicts.\n\n` +
              `It requires ${newCapacity.lanesRequired} lanes, ` +
              `but only ${newCapacity.minimumLanesAvailable} are available.\n\n` +
              `Create it anyway?`
          );

        if (!confirmAnyway) {
          return;
        }

        const retry = await fetch(
          "/api/admin/reservations",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name:
                formData.get("name"),
              phone:
                formData.get("phone"),
              date,
              time,
              duration,
              guests,
              occasion:
                formData.get(
                  "occasion"
                ),
              notes:
                formData.get("notes"),
              allowConflict: true,
            }),
          }
        );

        if (!retry.ok) {
          throw new Error(
            "Unable to create reservation."
          );
        }
      } else if (!response.ok) {
        throw new Error(
          "Unable to create reservation."
        );
      }

      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        "The reservation could not be created."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const lanesNeeded =
    getLanesRequired(guests);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111111] p-6 text-white shadow-2xl md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-300">
              BO BOWLING
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              Add Reservation
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manually add a confirmed booking.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 transition hover:text-white"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Name">
              <input
                name="name"
                required
                className={inputClass}
              />
            </FormField>

            <FormField label="Phone">
              <input
                name="phone"
                type="tel"
                required
                className={inputClass}
              />
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Date">
              <input
                name="date"
                type="date"
                required
                value={date}
                onChange={(event) =>
                  setDate(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </FormField>

            <FormField label="Time">
              <select
                name="time"
                required
                value={time}
                onChange={(event) =>
                  setTime(
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Select a time
                </option>

                {reservationTimes.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  )
                )}
              </select>
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Guests">
              <input
                name="guests"
                type="number"
                min="1"
                max="64"
                required
                value={guests}
                onChange={(event) =>
                  setGuests(
                    Number(
                      event.target.value
                    )
                  )
                }
                className={inputClass}
              />
            </FormField>

            <FormField label="Duration">
              <select
                name="duration"
                value={duration}
                onChange={(event) =>
                  setDuration(
                    Number(
                      event.target.value
                    )
                  )
                }
                className={inputClass}
              >
                {reservationDurations.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </FormField>
          </div>

          <FormField label="Occasion">
            <select
              name="occasion"
              defaultValue="General Visit"
              className={inputClass}
            >
              <option>
                General Visit
              </option>

              <option>
                Birthday
              </option>

              <option>
                Corporate Event
              </option>

              <option>
                School / University
              </option>

              <option>
                Group Event
              </option>

              <option>
                Other
              </option>
            </select>
          </FormField>

          <FormField label="Notes">
            <textarea
              name="notes"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </FormField>

          {/* LIVE CAPACITY CHECK */}
          {capacity && (
            <div
              className={`rounded-xl border p-4 ${
                capacity.hasConflict
                  ? "border-red-400/20 bg-red-400/10"
                  : "border-green-400/20 bg-green-400/10"
              }`}
            >
              {capacity.hasConflict ? (
                <>
                  <p className="font-semibold text-red-300">
                    ⚠ Capacity Conflict
                  </p>

                  <p className="mt-1 text-sm text-red-200/70">
                    Requires{" "}
                    {lanesNeeded}{" "}
                    {lanesNeeded === 1
                      ? "lane"
                      : "lanes"}
                    , but only{" "}
                    {
                      capacity.minimumLanesAvailable
                    }{" "}
                    are available during
                    part of this booking.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-green-300">
                    ✓ Capacity Available
                  </p>

                  <p className="mt-1 text-sm text-green-200/70">
                    Requires{" "}
                    {lanesNeeded}{" "}
                    {lanesNeeded === 1
                      ? "lane"
                      : "lanes"}
                    . At least{" "}
                    {
                      capacity.minimumLanesAvailable
                    }{" "}
                    lanes are currently
                    available.
                  </p>
                </>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-full bg-white px-6 py-3.5 font-semibold text-black transition hover:scale-[1.01] disabled:opacity-50"
            >
              {submitting
                ? "Creating..."
                : "Create Reservation"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 px-6 py-3.5 text-gray-300 transition hover:bg-white hover:text-black"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#191919] px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/50";

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-300">
        {label}
      </label>

      {children}
    </div>
  );
}