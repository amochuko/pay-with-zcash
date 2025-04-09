const basePathBack = "dashboard";
const navItemsBackend = ["categories", "merchants", "settings", 'privacy policy'];

export const navMenuBackend = navItemsBackend.map((n) => {
  const obj = { title: "", link: "" };

  obj["title"] = n;
  obj["link"] = `${basePathBack}/${n.replace(' ', '-')}`;

  return obj;
});


export const navMenuFront = [];
