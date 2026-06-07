import "./load-env";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

await client.connect();

try {
  await client.query(`
    TRUNCATE TABLE
      product.tag_user_relations,
      product.tags,
      product.users
    RESTART IDENTITY CASCADE
  `);
} finally {
  await client.end();
}
