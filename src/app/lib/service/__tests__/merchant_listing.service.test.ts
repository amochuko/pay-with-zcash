import { Merchant } from "../../models/Merchant";
import MerchantListService from "../merchant_listing.service";

jest.mock("../merchant_listing.service");

describe("MerchantListService", () => {
  let ms: MerchantListService;

  beforeEach(() => {
    ms = new MerchantListService();
    jest.clearAllMocks();
  });

  it("should be initialized", () => {
    expect(ms).toBeDefined();
  });

  it("should add merchant to db", async () => {
    const merchant: Merchant = {
      name: "Swimming Pool",
      category_type: "Public Good",
      email_address: "swim@gmail.com",
      logo_url: "./local/pix.png",
      subtitle: "Everyday life is here",
      tags: ["game", "show"],
      upvote_count: 1,
      website_url: "https://swimming.pool",
    };

    await ms.add(merchant);

    expect(ms.add).toHaveBeenCalledTimes(1)
    expect(ms.add).toHaveBeenCalledWith(merchant);
  });
});
