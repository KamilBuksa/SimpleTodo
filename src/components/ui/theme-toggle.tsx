import React, { useState, useEffect } from "react";
import { Button } from "./button";

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);

    // Apply theme to document
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    // Update localStorage
    localStorage.setItem("theme", newTheme ? "dark" : "light");

    // Apply theme to document with smooth transition
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg animate-fade-slide-down"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <span className="flex items-center gap-2">
          <span className="animate-bounce-gentle">☀️</span> Light
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="animate-bounce-gentle">🌙</span> Dark
        </span>
      )}
    </Button>
  );
};
