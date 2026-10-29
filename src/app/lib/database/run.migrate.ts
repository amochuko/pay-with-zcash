import logger from "../logger";
import { serverEnv } from "../server-env";
import { runDBMigration } from "./db-migration";

runDBMigration(serverEnv.MIGRATION_PATH)
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error("Migration error:", err);
    
    process.exit(1);
  });
