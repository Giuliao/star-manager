import { relations } from "drizzle-orm";
import { text, pgSchema, bigserial, bigint, AnyPgColumn } from "drizzle-orm/pg-core";

export const mySchema = pgSchema('product');

export const users = mySchema.table('users', {
  id: bigserial({ mode: "number" }).primaryKey(),
  github_id: bigint({ mode: 'number' }).notNull(),
  name: text('name'),
  email: text('email'),
});

export type CreateUserType = typeof users.$inferInsert;

export const tags = mySchema.table('tags', {
  id: bigserial({ mode: "number" }).primaryKey(),
  name: text('name'),
});

export type CreateTagType = typeof tags.$inferInsert;

export const tagUserRelationTable = mySchema.table('tag_user_relations', {
  id: text().primaryKey(),
  parent_id: text().references((): AnyPgColumn => tagUserRelationTable.id, { onDelete: 'cascade' }),
  tag_id: bigint({ mode: "number" }).references(() => tags.id, { onDelete: 'cascade' }).notNull(),
  user_id: bigint({ mode: "number" }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  parent_tag_id: bigint({ mode: "number" }),
  content: text('content').array().default([]),
  created_at: text('created_at').default(new Date().toISOString()).notNull(),
})

export const tagparentRelation = relations(tagUserRelationTable, ({ one }) => ({
  parentTag: one(tags, {
    fields: [tagUserRelationTable.parent_tag_id],
    references: [tags.id],
  })
}));


export type TagUserRelationType = typeof tagUserRelationTable.$inferInsert;
