"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";

const mapsUrl = "https://maps.app.goo.gl/fBZoQBFcasWKdwHo9";

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

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    setMinDate(`${year}-${month}-${day}`);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const reservation = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      date: formData.get("date"),
      time: formData.get("time"),
      guests: Number(formData.get("guests")),
      occasion: formData.get("occasion"),
      notes: formData.get("notes"),
      duration: Number(formData.get("duration")),
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
        throw new Error("Reservation submission failed");
      }

      form.reset();
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <section
      id="contact"
      className="relative min-h-screen overflow-hidden px-6 py-28 text-white md:px-8 md:py-36"
    >
      {/* BACKGROUND */}
      <Image
        src="/images/lanes_wide4.jpg"
        alt="BO Bowling lanes"
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/40" />

      {/* AMBIENT GLOW */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[600px] w-[600px] rounded-full bg-fuchsia-600/10 blur-[160px]" />

      <div className="relative z-10 mx-auto grid min-h-[75vh] max-w-7xl items-center gap-16 lg:grid-cols-[1fr_0.9fr]">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="mb-6 text-xs uppercase tracking-[0.45em] text-fuchsia-300 sm:text-sm">
            BO BOWLING · SOHAR
          </p>

          <h2 className="text-6xl font-bold leading-[0.95] sm:text-7xl md:text-8xl">
            Your Lane
            <br />
            Is Waiting.
          </h2>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-300">
            Tell us what you have in mind and our team will contact you with availability, pricing, and the best options for your group.
          </p>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex rounded-full border border-white/30 bg-black/20 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition duration-300 hover:border-white hover:bg-white hover:text-black"
          >
            Get Directions
          </a>
        </motion.div>

        {/* RESERVATION FORM */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 1,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="rounded-[28px] border border-white/10 bg-black/45 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
              Booking & Pricing Inquiry
            </p>

            <h3 className="mt-3 text-3xl font-semibold">Tell Us What You’re Planning</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm text-gray-300"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-fuchsia-400/60 focus:bg-white/[0.09]"
              />
            </div>

            {/* PHONE */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm text-gray-300"
              >
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+968"
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-fuchsia-400/60 focus:bg-white/[0.09]"
              />
            </div>

            {/* DATE + TIME */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Preferred Date
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  min={minDate}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/60 focus:bg-white/[0.09]"
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Preferred Time
                </label>

                <select
                  id="time"
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

            {/* GUESTS + DURATION */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="guests"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Number of Guests
                </label>

                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="64"
                  required
                  placeholder="4"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-fuchsia-400/60 focus:bg-white/[0.09]"
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Reservation Duration
                </label>

                <select
                  id="duration"
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

            {/* OCCASION */}
            <div>
              <label
                htmlFor="occasion"
                className="mb-2 block text-sm text-gray-300"
              >
                Occasion
              </label>

              <select
                id="occasion"
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

            {/* NOTES */}
            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm text-gray-300"
              >
                Additional Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Anything else we should know?"
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-fuchsia-400/60 focus:bg-white/[0.09]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-white px-8 py-4 font-semibold text-black transition duration-300 hover:scale-[1.02] hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <p className="text-center text-xs leading-5 text-gray-500">
  No commitment required. This is only an inquiry — our team will contact
  you with pricing, availability, and booking options.
</p>
              {submitting ? "Sending Request..." : "Send Reservation Request"}
            </button>
            {submitted && (
              <div className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-center text-sm text-green-300">
                ✓ Reservation request sent. Our team will contact you to confirm
                availability.
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-center text-sm text-red-300">
                Something went wrong. Please try again.
              </div>
            )}

            <p className="text-center text-xs leading-5 text-gray-500">
              This is a reservation request. Our team will contact you to
              confirm availability.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
