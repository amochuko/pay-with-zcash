import CategoryService from "../category.service";

// Mock modules
jest.mock("../category.service");

describe("CategoryService", () => {
  let cs: CategoryService;

  beforeEach(() => {
    cs = new CategoryService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should have a defined object", () => {
    expect(cs).toBeDefined();
  });

  it("should have being called once", async () => {
    await cs.create("Shoppings");

    expect(cs.create).toHaveBeenCalledTimes(1);
  });

  it.todo("should successfully insert a category");
  it.todo("should successfully delete a category");
  it.todo("should successfully update a category");
});
