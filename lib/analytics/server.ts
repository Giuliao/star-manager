import { PostHog } from "posthog-node";
import {
  type AnalyticsEvent,
  type AnalyticsProperties
} from "@/lib/analytics/events";

const posthogKey =
  process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost =
  process.env.POSTHOG_HOST ||
  process.env.NEXT_PUBLIC_POSTHOG_HOST ||
  "https://us.i.posthog.com";

let client: PostHog | undefined;

function getPostHogClient() {
  if (!posthogKey) {
    return undefined;
  }

  if (!client) {
    client = new PostHog(posthogKey, {
      host: posthogHost,
      flushAt: 1,
      flushInterval: 0
    });
  }

  return client;
}

export async function captureServerEvent(
  event: AnalyticsEvent,
  distinctId?: string,
  properties?: AnalyticsProperties
) {
  const posthog = getPostHogClient();

  if (!posthog || !distinctId) {
    return;
  }

  try {
    posthog.capture({
      distinctId,
      event,
      properties
    });
    await posthog.flush();
  } catch (error) {
    console.warn("Failed to capture analytics event", error);
  }
}
