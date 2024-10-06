"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Theme as RadixTheme } from "@radix-ui/themes";

type Theme = "light" | "dark" | "system";

const ThemeContext = createContext<
  | {
      theme: Theme;
      setTheme: (theme: Theme) => void;
      actualTheme: "light" | "dark";
    }
  | undefined
>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    updateActualTheme();
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        updateActualTheme();
      }
    };
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [theme]);

  const updateActualTheme = () => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setActualTheme(systemTheme);
    } else {
      setActualTheme(theme as "light" | "dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      <RadixTheme
        appearance={actualTheme}
        accentColor="indigo"
        grayColor="slate"
        radius="full"
        scaling="100%"
      >
        {children}
      </RadixTheme>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
