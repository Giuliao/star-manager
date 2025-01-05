ALTER TABLE "product"."tag_user_relations" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "product"."tag_user_relations" ADD COLUMN "parent_id" text;