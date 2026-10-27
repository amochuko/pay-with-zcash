import { Merchant } from "../../types/merchant.types";
import { POST_STATUS_ENUM } from "../../typings";
import MerchantRepo from "../merchant.repo";

jest.mock("../merchant.service");

describe("MerchantRepo", () => {
  let ms: typeof MerchantRepo;

  beforeEach(() => {
    ms = MerchantRepo;
    jest.clearAllMocks();
  });

  it("should be initialized", () => {
    expect(ms).toBeDefined();
  });

  it.skip("should add merchant to db", async () => {
    const merchant: Omit<Merchant, "merchant_id"> = {
      merchant_name: "Swimming Pool",
      category_id: "Public Good",
      email_address: "swim@gmail.com",
      description: "hello world",
      logo_img_id: "w9e999e",
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
