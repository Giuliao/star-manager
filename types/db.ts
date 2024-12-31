import { users, tags } from '@/db/schema';

export type CreateUserType = typeof users.$inferInsert;
export type CreateTagType = typeof tags.$inferInsert;
