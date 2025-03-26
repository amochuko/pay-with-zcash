import sql from "../../database/sqlConnection";
import { Merchant } from "../../models/Merchant";
import { POST_STATUS_ENUM } from "../../typings";
import merchantService from "../merchant.service";

jest.mock("../merchant.service");
jest.mock("../../database/sqlConnection");

describe("MerchantService", () => {
  let ms: typeof merchantService;

  beforeEach(() => {
    ms = merchantService;
    jest.clearAllMocks();
  });

  it("should be initialized", () => {
    expect(ms).toBeDefined();
  });

  it("should create table", async () => {
    // await ms.seed();
    // expect(sql).toHaveBeenCalled();
  });

  xit("should add merchant to db", async () => {
    const merchant: Merchant = {
      name: "Swimming Pool",
      category_id: "Public Good",
      email_address: "swim@gmail.com",
      description: 'hello world',
      post_status: POST_STATUS_ENUM.DRAFT,
      logo_url: "./local/pix.png",
      subtitle: "Everyday life is here",
      tags: ["game", "show"],
      upvote_count: 1,
      website_url: "https://swimming.pool",
    };

    await ms.create(merchant);

    expect(ms.create).toHaveBeenCalledTimes(1);
    expect(ms.create).toHaveBeenCalledWith(merchant);
  });
});
