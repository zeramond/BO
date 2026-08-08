export const TOTAL_LANES = 8;
export const PEOPLE_PER_LANE = 8;

export function getLanesRequired(guests: number) {
  return Math.ceil(guests / PEOPLE_PER_LANE);
}

export function parseReservationDateTime(
  date: string,
  time: string
) {
  const match = time.match(
    /^(\d{1,2}):(\d{2})\s(AM|PM)$/
  );

  if (!match) {
    throw new Error(`Invalid reservation time: ${time}`);
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3];

  if (period === "AM") {
    if (hours === 12) {
      hours = 0;
    }
  } else {
    if (hours !== 12) {
      hours += 12;
    }
  }

  const [year, month, day] = date
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    0,
    0
  );
}

export type CapacityReservation = {
  id: string;
  reservation_date: string;
  reservation_time: string;
  duration_minutes: number;
  guests: number;
};

export type CapacityResult = {
  hasConflict: boolean;
  lanesRequired: number;
  maximumLanesOccupied: number;
  minimumLanesAvailable: number;
};

export function checkReservationCapacity(
  requested: CapacityReservation,
  confirmedReservations: CapacityReservation[]
): CapacityResult {
  const requestedStart =
    parseReservationDateTime(
      requested.reservation_date,
      requested.reservation_time
    );

  const requestedEnd = new Date(
    requestedStart.getTime() +
      requested.duration_minutes * 60_000
  );

  const lanesRequired =
    getLanesRequired(requested.guests);

  /*
   * Each point represents a change in occupied lanes.
   * +x = lanes become occupied
   * -x = lanes become free
   */
  const events: {
    time: number;
    laneChange: number;
  }[] = [];

  for (const reservation of confirmedReservations) {
    if (reservation.id === requested.id) {
      continue;
    }

    const start =
      parseReservationDateTime(
        reservation.reservation_date,
        reservation.reservation_time
      );

    const end = new Date(
      start.getTime() +
        reservation.duration_minutes * 60_000
    );

    /*
     * No overlap.
     */
    if (
      start >= requestedEnd ||
      end <= requestedStart
    ) {
      continue;
    }

    /*
     * Only examine the portion that overlaps
     * the requested reservation.
     */
    const overlapStart = Math.max(
      start.getTime(),
      requestedStart.getTime()
    );

    const overlapEnd = Math.min(
      end.getTime(),
      requestedEnd.getTime()
    );

    const lanes =
      getLanesRequired(reservation.guests);

    events.push({
      time: overlapStart,
      laneChange: lanes,
    });

    events.push({
      time: overlapEnd,
      laneChange: -lanes,
    });
  }

  /*
   * If one reservation ends exactly when another
   * begins, process the ending first so they do not
   * count as overlapping.
   */
  events.sort((a, b) => {
    if (a.time !== b.time) {
      return a.time - b.time;
    }

    return a.laneChange - b.laneChange;
  });

  let occupied = 0;
  let maximumLanesOccupied = 0;

  for (const event of events) {
    occupied += event.laneChange;

    maximumLanesOccupied = Math.max(
      maximumLanesOccupied,
      occupied
    );
  }

  const minimumLanesAvailable =
    TOTAL_LANES - maximumLanesOccupied;

  return {
    hasConflict:
      lanesRequired > minimumLanesAvailable,

    lanesRequired,

    maximumLanesOccupied,

    minimumLanesAvailable,
  };
}