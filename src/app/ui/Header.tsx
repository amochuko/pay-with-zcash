"use client";

import { cn } from "@/app/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./theme-toggle";
import { env } from "../lib/env";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/listings", label: "Directory" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/docs", label: "API Docs" },
  { to: "/examples", label: "Code Examples" },
  { to: "/keys", label: "API Keys" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");

  const setThemeAttribute = (themeName: string) => {
    document.documentElement.setAttribute("data-theme", themeName);
  };

  useEffect(() => {
    // check saved theme preference from localstorage or default light
    const savedTheme = localStorage.getItem(env.THEME_NAME!) || "light";
    setTheme(savedTheme);

    setThemeAttribute(savedTheme);
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    localStorage.setItem(env.THEME_NAME!, newTheme); // save theme to local storage

    setThemeAttribute(newTheme);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between h-16">
        <Link href={"/"} className="flex items-center gap-3 group:">
          <Image
            width={256}
            height={256}
            src={
              theme === "dark"
                ? "/images/pay-with-zcash-dark.png"
                : "/images/pay-with-zcash-light.png"
            }
            alt="pay with zcash"
            className="h-15 w-15 object-contain"
            quality={100}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle theme={theme} toggleTheme={handleToggleTheme} />
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center">
          <button
            className="md:hidden p-2 text:muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <span className="h-5 w-5">X</span>
            ) : (
              <span className="h-5 w-5">Menu</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border/50 bg-background p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
