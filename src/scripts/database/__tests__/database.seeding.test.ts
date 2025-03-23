import sql from "../../../app/lib/database/sqlConnection";
import DatabaseSeeding from "../databaseSeeding";

jest.mock("../../../app/lib/database/sqlConnection", () => ({
  __esModule: true,
  query: jest.fn().mockResolvedValue(1),
}));

// Mock the DatabaseSeeding class methods
jest.mock("../databaseSeeding");

describe("Database Seeding Script", () => {
  let dbSeeding: jest.Mocked<DatabaseSeeding>;

  beforeEach(async () => {
    dbSeeding = new DatabaseSeeding() as jest.Mocked<DatabaseSeeding>;
  });

  afterEach(async () => {
    jest.clearAllMocks(); // clear all mocks after each test
  });

  it("should call dbConnectionTest and closeConnection on success", async () => {
    // Arrange: Mock the methods for success case
    dbSeeding.dbConnectionTest.mockResolvedValueOnce(undefined); // no error on connection test
    dbSeeding.closeConnection.mockResolvedValueOnce(undefined); // simulate closing connection

    // Act: run the logic
    await (async () => {
      try {
        await dbSeeding.dbConnectionTest();
      } catch (err) {
        throwErrow(err, "Error with Seeding DB");
      } finally {
        dbSeeding.closeConnection(10);
      }
    })();

    // Assert:
    expect(dbSeeding.dbConnectionTest).toHaveBeenCalledTimes(1);
    expect(dbSeeding.closeConnection).toHaveBeenCalledTimes(1);
    expect(dbSeeding.closeConnection).toHaveBeenCalledWith(10);
  });

  it("should throw an error when dbConnectionTest fails", async () => {
    // Arrange: Mock dbConnectionTest to throw an error
    dbSeeding.dbConnectionTest.mockRejectedValueOnce(
      new Error("Connection failed")
    );

    // Act
    await expect(async () => {
      try {
        await dbSeeding.dbConnectionTest();
      } catch (err) {
        if (err instanceof Error) {
          throw err;
        }

        throw new Error("Error with Seeding DB");
      } finally {
        dbSeeding.closeConnection(10);
      }
    }).rejects.toThrow("Connection failed");

    // Assert
    expect(dbSeeding.closeConnection).toHaveBeenCalledTimes(1);
  });

  describe.only("createCategoryTable", () => {
    it("should create a category table successfully", async () => {
      const res = await dbSeeding.createCategoryTable();

      // Assert
      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("DROP TABLE IF EXISTS categories")
      );

      expect(res).toBe(1);
    });

    it("should throw an error if sql fails", async () => {});
  });
});

function throwErrow(err: unknown | Error | string, msg: string) {
  console.log(err);

  if (err instanceof Error) {
    throw err;
  }

  throw new Error(msg);
}
