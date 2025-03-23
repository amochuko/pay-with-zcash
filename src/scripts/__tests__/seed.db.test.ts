import DatabaseSeeding from "../../app/lib/database/databaseSeeding";

// Mock the DatabaseSeeding class methods
jest.mock("../../app/lib/database/databaseSeeding");

describe("Database Seeding Script", () => {
  let dbSeeding: jest.Mocked<DatabaseSeeding>;

  beforeEach(() => {
    dbSeeding = new DatabaseSeeding() as jest.Mocked<DatabaseSeeding>;
  });

  afterEach(() => {
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
        if (err instanceof Error) {
          throw err;
        }

        throw new Error("Error with Seeding DB");
      } finally {
        dbSeeding.closeConnection(10);
      }
    })();

    // Assert:
    expect(dbSeeding.dbConnectionTest).toHaveBeenCalledTimes(1);
    expect(dbSeeding.closeConnection).toHaveBeenCalledTimes(1);
    expect(dbSeeding.closeConnection).toHaveBeenCalledWith(10);
  });

  it('should throw an error when dbConnectionTest fails', async () => {

    // Arrange: Mock dbConnectionTest to throw an error
    dbSeeding.dbConnectionTest.mockRejectedValueOnce(new Error('Connection failed'))

    // Act
    await expect(async() => {
        try {
            await dbSeeding.dbConnectionTest();
        } catch (err) {
            if(err instanceof Error){
                throw err;
            }

            throw new Error('Error with Seeding DB');
        }finally{
            dbSeeding.closeConnection(10);

        }
    }).rejects.toThrow('Connection failed')

    // Assert
    expect(dbSeeding.closeConnection).toHaveBeenCalledTimes(1)
  })
});
