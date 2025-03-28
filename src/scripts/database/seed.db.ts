import DatabaseSeeding from "./databaseSeeding";

(async () => {
  const dbSeeding = new DatabaseSeeding();

  try {
    await dbSeeding.dbConnectionTest();
    await dbSeeding.seedCategoryTable();
    await dbSeeding.createMerchantsTable();
    await dbSeeding.seedMerchantTable();
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Error with Seeding DB");
  } finally {
    process.exit(0);
  }
})();
