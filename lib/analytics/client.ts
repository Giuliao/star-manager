"use client";

import posthog from "posthog-js";
import {
  type AnalyticsEvent,
  type AnalyticsProperties,
  getAnalyticsDistinctId
} from "@/lib/analytics/events";
import type { SessionUser } from "@/types/user";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogUiHost =
  process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || "https://us.posthog.com";

let clickTrackingInitialized = false;

function isBrowserAnalyticsEnabled() {
  return Boolean(posthogKey && typeof window !== "undefined");
}

function getTrackedElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  return target.closest<HTMLElement>("[data-track]");
}

function getTrackedProperties(element: HTMLElement): AnalyticsProperties {
  return {
    track_id: element.dataset.trackId,
    area: element.dataset.trackArea,
    label: element.dataset.trackLabel,
    href:
      element instanceof HTMLAnchorElement
        ? element.href
        : element.closest<HTMLAnchorElement>("a")?.href
  };
}

function initAllowlistedClickTracking() {
  if (clickTrackingInitialized || typeof document === "undefined") {
    return;
  }

  clickTrackingInitialized = true;
  document.addEventListener("click", (event) => {
    const element = getTrackedElement(event.target);
    const eventName = element?.dataset.track;

    if (!element || !eventName) {
      return;
    }

    trackEvent(eventName as AnalyticsEvent, getTrackedProperties(element));
  });
}

export function initAnalytics() {
  if (!isBrowserAnalyticsEnabled()) {
    return;
  }

  if (!posthog.__loaded) {
    posthog.init(posthogKey!, {
      api_host: "/ingest",
      ui_host: posthogUiHost,
      defaults: "2026-01-30",
      autocapture: false,
      capture_pageview: "history_change",
      capture_exceptions: true,
      person_profiles: "identified_only",
      debug: process.env.NODE_ENV === "development",
    } as any);
  }

  initAllowlistedClickTracking();
}

export function identifyAnalyticsUser(user?: SessionUser | null) {
  if (!isBrowserAnalyticsEnabled() || !user?.dbId) {
    return;
  }

  posthog.identify(getAnalyticsDistinctId(user.dbId), {
    github_profile_id: user.profileId,
    name: user.name || undefined
  });
}

export function resetAnalyticsUser() {
  if (!isBrowserAnalyticsEnabled()) {
    return;
  }

  posthog.reset();
}

export function trackEvent(
  event: AnalyticsEvent | string,
  properties?: AnalyticsProperties
) {
  if (!isBrowserAnalyticsEnabled()) {
    return;
  }

  posthog.capture(event, properties);
}
