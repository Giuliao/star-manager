import type { User } from "next-auth";


export type SessionUser = User & {
  dbId: number;
  profileId: number;
}
