"use client";

import { cn } from "@/app/lib/utils";
import { JWTPayload } from "jose";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logOut } from "../actions/auth.action";
import navLinks from "../data/navLinks.json";
import { clientEnv } from "../lib/client-env";
import ThemeToggle from "./theme-toggle";

type HeaderProps = {
  session: JWTPayload | null;
};

export default function Header(props: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");

  const setThemeAttribute = (themeName: string) => {
    document.documentElement.setAttribute("data-theme", themeName);
  };

  useEffect(() => {
    // check saved theme preference from localstorage or default light
    const savedTheme =
      localStorage.getItem(clientEnv.NEXT_PUBLIC_THEME_NAME) || "light";
    setTheme(savedTheme);

    setThemeAttribute(savedTheme);
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    localStorage.setItem(clientEnv.NEXT_PUBLIC_THEME_NAME, newTheme); // save theme to local storage

    setThemeAttribute(newTheme);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center  h-16">
        <Link href={"/"} className="flex items-center gap-3 flex-1">
          <Image
            width={256}
            height={256}
            src={
              theme === "dark"
                ? "/images/pay-with-zcash-logo-dark.png"
                : "/images/pay-with-zcash-logo-light.png"
            }
            alt="pay with zcash"
            className="h-16 w-16 object-contain"
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

          {props.session?.userId ? (
            <button
              type="submit"
              onClick={logOut}
              className="px-3 py-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-secondary"
              title="Logout"
            >
              Logout
            </button>
          ) : null}
        </nav>

        <div className=" md:flex items-center gap-3">
          <ThemeToggle theme={theme} toggleTheme={handleToggleTheme} />
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center">
          <button
            className="md:hidden p-2 text:muted-foreground hover:cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
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

          {props.session?.userId ? (
            <button
              type="submit"
              onClick={logOut}
              className="px-3 py-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-secondary"
              title="Logout"
            >
              Logout
            </button>
          ) : null}
        </nav>
      )}
    </header>
  );
}
