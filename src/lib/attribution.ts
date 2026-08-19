const STORAGE_KEY = "bo_reservation_attribution";

export type ReservationAttribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  landingPage: string;
  referrer: string;
};

const emptyAttribution: ReservationAttribution = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  landingPage: "",
  referrer: "",
};

export function captureAttribution(): ReservationAttribution {
  if (typeof window === "undefined") {
    return emptyAttribution;
  }

  const stored = readStoredAttribution();
  const search = new URLSearchParams(window.location.search);
  const referrer = getExternalReferrer();

  const attribution: ReservationAttribution = {
    utmSource: stored.utmSource || clean(search.get("utm_source"), 200),
    utmMedium: stored.utmMedium || clean(search.get("utm_medium"), 200),
    utmCampaign:
      stored.utmCampaign || clean(search.get("utm_campaign"), 200),
    utmTerm: stored.utmTerm || clean(search.get("utm_term"), 200),
    utmContent: stored.utmContent || clean(search.get("utm_content"), 200),
    landingPage:
      stored.landingPage ||
      clean(`${window.location.pathname}${window.location.search}`, 1000),
    referrer: stored.referrer || clean(referrer, 1000),
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Browsers can disable session storage; attribution remains best effort.
  }

  return attribution;
}

function readStoredAttribution(): ReservationAttribution {
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY);

    if (!value) {
      return emptyAttribution;
    }

    const parsed = JSON.parse(value) as Partial<ReservationAttribution>;

    return {
      utmSource: clean(parsed.utmSource, 200),
      utmMedium: clean(parsed.utmMedium, 200),
      utmCampaign: clean(parsed.utmCampaign, 200),
      utmTerm: clean(parsed.utmTerm, 200),
      utmContent: clean(parsed.utmContent, 200),
      landingPage: clean(parsed.landingPage, 1000),
      referrer: clean(parsed.referrer, 1000),
    };
  } catch {
    return emptyAttribution;
  }
}

function getExternalReferrer() {
  if (!document.referrer) {
    return "";
  }

  try {
    const referrer = new URL(document.referrer);
    return referrer.origin === window.location.origin ? "" : referrer.href;
  } catch {
    return "";
  }
}

function clean(value: unknown, limit: number) {
  return String(value ?? "").trim().slice(0, limit);
}
