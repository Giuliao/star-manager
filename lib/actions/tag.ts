"use server";
import { eq } from "drizzle-orm";
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
