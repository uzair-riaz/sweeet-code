"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-md bg-grey-light dark:bg-grey-dark hover:bg-gold-light dark:hover:bg-gold-dark transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-grey-dark" />
      ) : (
        <Sun className="h-5 w-5 text-gold-light" />
      )}
    </button>
  );
} 