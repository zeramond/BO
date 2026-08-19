"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

import { trackEvent } from "@/lib/analytics";

type TrackedReserveLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  children: ReactNode;
  placement: string;
};

export default function TrackedReserveLink({
  children,
  onClick,
  placement,
  ...props
}: TrackedReserveLinkProps) {
  return (
    <a
      {...props}
      href="/reserve"
      onClick={(event) => {
        trackEvent("reserve_cta_click", {
          cta_placement: placement,
          destination: "/reserve",
        });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
