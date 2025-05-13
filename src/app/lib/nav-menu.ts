const navItemsBackend = [
  "Home",
  "categories",
  "merchants",
  "privacy policy",
];

export const navMenuBackend = navItemsBackend.map((n) => {
  const obj = { title: "", link: "" };
  n = n.toLowerCase();

  obj["title"] = n;
  obj["link"] = `${n.replace(" ", "-")}`;

  return obj;
});

export const navMenuFront = [];
