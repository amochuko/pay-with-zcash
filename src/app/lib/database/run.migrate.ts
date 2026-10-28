import { migrationEnv } from "../migration-env";
import { runDBMigration } from "./db-migration";

runDBMigration(String(migrationEnv.MIGRATION_PATH))
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  });
