ALTER TABLE "product"."tag_user_relations" ADD CONSTRAINT "tag_user_relations_parent_id_tag_user_relations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "product"."tag_user_relations"("id") ON DELETE cascade ON UPDATE no action;