"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "./button";

type ThemeToggleProps = {
  theme: string;
  toggleTheme: () => void;
};

const ThemeToggle = (props: ThemeToggleProps) => {
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      aria-label={
        props.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      onClick={props.toggleTheme}
      className="text-muted-foreground hover:text-foreground hover:cursor-pointer"
    >
      {props.theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;
