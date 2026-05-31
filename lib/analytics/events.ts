export const AnalyticsEvents = {
  ConsoleOpened: "console opened",
  StarSelected: "star selected",
  SearchSubmitted: "star search submitted",
  SidebarOpened: "sidebar opened",
  TagFilterSelected: "tag filter selected",
  TagFilterRemoved: "tag filter removed",
  TagCreated: "tag created",
  TagEdited: "tag edited",
  TagDeleted: "tag deleted",
  TagPickerOpened: "tag picker opened",
  TagAssigned: "tag assigned",
  TagRemoved: "tag removed",
  ReadmeViewed: "readme viewed",
  AiSummaryRequested: "ai summary requested",
  AiSummaryStreamStarted: "ai summary stream started",
  AiSummaryCompleted: "ai summary completed",
  AiSummaryFailed: "ai summary failed",
  GithubStarsSyncStarted: "github stars sync started",
  GithubStarsSyncCompleted: "github stars sync completed",
  GithubStarsSyncFailed: "github stars sync failed",
  AuthLoginClicked: "auth login clicked",
  ConsoleCtaClicked: "console cta clicked"
} as const;

export type AnalyticsEvent =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

export function getAnalyticsDistinctId(userId?: number | string | null) {
  if (userId === undefined || userId === null || userId === "") {
    return undefined;
  }

  return `user:${userId}`;
}
