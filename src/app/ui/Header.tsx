"use client";

import { cn } from "@/app/lib/utils";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./theme-toggle";

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

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href={"/"} className="flex items-center gap-3 group:">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:glow-gold transition-all">
            {/* <Shield className="h-5 w-5 text-primary" /> */}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">
              Zcash<span className="text-primary">API</span>
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">
              Developer Portal
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={cn(
                "pw-3 py-2 rounded-md text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
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
                location.pathname === link.to
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
