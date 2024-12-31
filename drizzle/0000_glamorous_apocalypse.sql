CREATE SCHEMA "product";
--> statement-breakpoint
CREATE TABLE "product"."tag_user_relations" (
	"tag_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"parent_tag_id" bigint,
	"content" text[] DEFAULT '{}'
);
--> statement-breakpoint
CREATE TABLE "product"."tags" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "product"."users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"github_id" bigint NOT NULL,
	"name" text,
	"email" text
);
--> statement-breakpoint
ALTER TABLE "product"."tag_user_relations" ADD CONSTRAINT "tag_user_relations_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "product"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product"."tag_user_relations" ADD CONSTRAINT "tag_user_relations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "product"."users"("id") ON DELETE cascade ON UPDATE no action;