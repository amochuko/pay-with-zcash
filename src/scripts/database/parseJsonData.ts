import fs from "node:fs";
import path from "node:path";
import { writeLogoToDisk } from "../../app/lib/utils/writeLogoToDisk";
import categories_with_id from "./data/categories_with_id.json";
import squirrel_selected_merchants_with_logo_url_sorted from "./data/squirrel_selected_merchants_with_logo_url_sorted.json";
import updatedMerchants from "./data/updatedMerchants_Thu Mar 27 2025 18:42:07 GMT+0100 (West Africa Standard Time).json";
import { Merchant } from "@/app/lib/models/Merchant";

async function saveLogoToDiskAndUpdateRelativeUrl() {
  const updatedMerchantsWithLogoRelativePath: any[] = [];

  for (const merchant of updatedMerchants) {
    const m = merchant as unknown as Merchant;

    const logoRelativePath = await writeLogoToDisk(m);

    if (logoRelativePath) {
      const { ...rest } = merchant;

      updatedMerchantsWithLogoRelativePath.push({
        ...rest,
        logo_url_relative_path: logoRelativePath,
      });
    }
  }

  console.log(updatedMerchantsWithLogoRelativePath);

  writeFileToJson(
    JSON.stringify(updatedMerchantsWithLogoRelativePath),
    `updatedMerchantsWithLogoRelativePath_${new Date()}`
  );
}

function updateMerchantCategoryID() {
  const updatedMerchants: any[] = [];

  squirrel_selected_merchants_with_logo_url_sorted.forEach((merchant) => {
    const matchedCategory = categories_with_id.find(
      (cat) =>
        cat.category_name.toLowerCase() === merchant.category.toLowerCase()
    );

    if (matchedCategory) {
      const { name, ...rest } = merchant;

      updatedMerchants.push({
        ...rest,
        category_id: matchedCategory.category_id,
        merchant_name: name,
      });
    }
  });

  writeFileToJson(
    JSON.stringify(updatedMerchants),
    `updatedMerchants_${new Date()}`
  );
}

function sortDataInAscendingOrder() {
  const newObjArr: unknown[] = [];

  squirrel_selected_merchants_with_logo_url_sorted
    .sort((a: any, b: any) => {
      const aA = a.category.toLowerCase();
      const bB = b.category.toLowerCase();

      if (aA < bB) {
        return -1;
      } else if (aA > bB) {
        return 1;
      }

      return 0;
    })
    .forEach((itm) => {
      const res: Record<string, unknown> = {
        ...itm,
        category: itm.category ? itm.category.toLowerCase() : itm.category,
        name: itm.name ? itm.name.toLowerCase() : itm.name,
        tags: itm.tags,
        email_address: itm.email_address ? itm.email_address : "",
      };

      newObjArr.push(res);
    });

  writeFileToJson(
    JSON.stringify(newObjArr),
    "squirrel_selected_merchants_with_logo_url_sorted"
  );
}

function writeFileToJson(data: string, filename: string) {
  fs.writeFile(
    path.join(__dirname, "/data", `${filename}.json`),
    data,
    (err) => {
      if (err) {
        console.error(err);
        throw err;
      }
    }
  );
}

(async () => {
  // sortDataInAscendingOrder();
  // updateMerchantCategoryID();
  saveLogoToDiskAndUpdateRelativeUrl();
})();
