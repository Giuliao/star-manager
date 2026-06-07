import "./load-env";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

await client.connect();

try {
  await client.query("BEGIN");

  await client.query(`
    INSERT INTO product.users (github_id, name, email)
    VALUES (999001, 'E2E User', 'e2e@example.com')
  `);

  await client.query(`
    INSERT INTO product.tags (name)
    VALUES ('Frontend'), ('AI')
  `);

  await client.query(`
    INSERT INTO product.tag_user_relations
      (id, tag_id, user_id, parent_tag_id, parent_id, content, created_at)
    VALUES
      ('e2e-tag-frontend', 1, 1, NULL, NULL, ARRAY['octo/alpha-ui'], '2026-01-01T00:00:00.000Z'),
      ('e2e-tag-ai', 2, 1, NULL, NULL, ARRAY[]::text[], '2026-01-01T00:00:01.000Z')
  `);

  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
