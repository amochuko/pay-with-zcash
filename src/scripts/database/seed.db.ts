import DatabaseSeeding from "./databaseSeeding";

(async () => {
  const dbSeeding = new DatabaseSeeding();

  try {
    await dbSeeding.dbConnectionTest();
    await dbSeeding.seedCategoryTable();
  } catch (err) {
    console.log({ err });

    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Error with Seeding DB");
  } finally {
    dbSeeding.closeConnection(10);
    process.exit(0);
  }
})();
