import fs from "node:fs";
import path from "node:path";
import squirrel_selected_merchants_with_logo_url_sorted from "./data/squirrel_selected_merchants_with_logo_url_sorted.json";

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

(() => {
  sortDataInAscendingOrder();
})();
