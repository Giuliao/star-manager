"use client";

import { useEffect } from "react";
import {
  identifyAnalyticsUser,
  trackEvent
} from "@/lib/analytics/client";
import { AnalyticsEvents } from "@/lib/analytics/events";
import type { SessionUser } from "@/types/user";

type Props = {
  user?: SessionUser | null;
};

export function AnalyticsUserIdentity({ user }: Props) {
  useEffect(() => {
    if (!user?.dbId) {
      return;
    }

    identifyAnalyticsUser(user);
    trackEvent(AnalyticsEvents.ConsoleOpened);
  }, [user?.dbId, user?.profileId, user?.name]);

  return null;
}
