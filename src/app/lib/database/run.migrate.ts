import { env } from "../env";
import { runDBMigration } from "./db-migration";

runDBMigration(env.migrationPath)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  });
