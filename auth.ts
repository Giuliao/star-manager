import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { eq } from "drizzle-orm";
import type { DbType } from "@/db"
import { users, type CreateUserType } from "@/db/schema";
import type { SessionUser } from '@/types/user';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async session({ session, token }) {
      (session.user as any) = {
        ...session.user,
        profileId: token.profileId,
        dbId: token.dbId,
      } as SessionUser;

      (session as any).accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, account, user }) {
      if (user) {
        token.profileId = (user as any)?.profileId;
        token.dbId = (user as any)?.dbId;
      }

      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async signIn({ user, profile }: any) {
      user.profileId = profile.id;
      const { db } = await import("@/db");
      const userInfo = await handleUserCreate({ ...user, profileId: profile.id }, db);
      user.dbId = (userInfo as CreateUserType).id;
      return true;
    }
  }
});

async function handleUserCreate(user: SessionUser, db: DbType) {
  if (!user.id) {
    return;
  }

  let result;

  try {
    result = await db.query.users.findFirst({ where: eq(users.github_id, user.profileId as number) });
    if (!result) {
      result = (await db.insert(users).values({
        github_id: user.profileId as number,
        name: user.name,
        email: user.email,
      }).returning())?.[0];
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}
