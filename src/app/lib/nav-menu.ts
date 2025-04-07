const basePathBack = "dashboard";
const navItemsBackend = ["categories", "merchants", "settings"];

export const navMenuBackend = navItemsBackend.map((n) => {
  const obj = { title: "", link: "" };

  obj["title"] = n;
  obj["link"] = `${basePathBack}/${n}`;

  return obj;
});


export const navMenuFront = [];
