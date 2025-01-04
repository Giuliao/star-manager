"use server";
import { eq, and } from "drizzle-orm";
import { db } from '@/db';
import {
  type CreateTagType,
  type TagUserRelationType,
  tags,
  tagUserRelationTable
} from '@/db/schema';

export async function queryTagByName(name: string) {
  return await db.query.tags.findFirst({ where: eq(tags.name, name) });
}

export async function createTag(tag: CreateTagType) {
  return await db.insert(tags).values(tag).returning();
}

export async function createUserTag(param: TagUserRelationType) {
  return await db.insert(tagUserRelationTable).values(param).returning();
}


export async function listUserTagById(id: number) {
  return await db.select().from(tagUserRelationTable)
    .where(eq(tagUserRelationTable.user_id, id))
    .leftJoin(tags, eq(tags.id, tagUserRelationTable.tag_id));
}

export type UserTagListType = Awaited<ReturnType<typeof listUserTagById>>;


export async function updateUserTagById(userId: number, tagId: number, tag: Partial<TagUserRelationType>) {
  return await db.update(tagUserRelationTable)
    .set(tag)
    .where(and(eq(tagUserRelationTable.tag_id, tagId), eq(tagUserRelationTable.user_id, userId))).returning();
}
