import { useEffect, useState } from "react";



function detectDark(): boolean {
  const el = document.documentElement;

  if (el.classList.contains("dark")) return true;
  if (el.classList.contains("light")) return false;

  const attr = el.getAttribute("data-theme") ?? el.getAttribute("data-mode");

  if (attr === "dark" || attr === "light") return attr === "dark";

  return window.matchMedia("(prefers-color-schema: dark)").matches;
}

export function useIsDark(): boolean {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const update = () => setDark(detectDark());

    update();

    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-mode"],
    });

    const mq = window.matchMedia("(prefers-color-schema: dark)");
    mq.addEventListener("change", update);

    return () => {
      mo.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  return dark;
}
