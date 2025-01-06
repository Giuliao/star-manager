"use server";
import { v4 as uuidv4 } from 'uuid';
import { eq, and, asc } from "drizzle-orm";
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

export async function createUserTag(param: Omit<TagUserRelationType, "id">) {
  return await db.insert(tagUserRelationTable).values({
    id: uuidv4(),
    ...param
  }).returning();
}

export type CreateUserTagType = Awaited<ReturnType<typeof createUserTag>>;

export async function listUserTagById(id: number) {
  return await db.select().from(tagUserRelationTable)
    .where(eq(tagUserRelationTable.user_id, id))
    .leftJoin(tags, eq(tags.id, tagUserRelationTable.tag_id)).orderBy(asc(tagUserRelationTable.created_at));
}

export type UserTagListType = Awaited<ReturnType<typeof listUserTagById>>;


export async function updateUserTagById(userId: number, id: string, tag: Partial<TagUserRelationType>) {
  return await db.update(tagUserRelationTable)
    .set(tag)
    .where(and(eq(tagUserRelationTable.id, id), eq(tagUserRelationTable.user_id, userId))).returning();
}

export async function deleteUserTagById(userId: number, id: string) {
  return await db.delete(tagUserRelationTable)
    .where(
      and(eq(tagUserRelationTable.id, id), eq(tagUserRelationTable.user_id, userId))
    )
    .returning();
}
