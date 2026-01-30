"use client";

import { useEffect } from "react";
import { generateCSSVariables, generateDarkCSSVariables } from "@/lib/brand";

/**
 * BrandProvider
 * Injects CSS variables based on brand theme and listens for theme changes.
 */
export function BrandProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    const applyVariables = () => {
      const isDark = root.classList.contains("dark");
      const cssVariables = isDark
        ? generateDarkCSSVariables()
        : generateCSSVariables();

      Object.entries(cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    };

    // Initial application
    applyVariables();

    // Watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          applyVariables();
        }
      });
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Watch for system theme preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      applyVariables();
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    }

    return () => {
      observer.disconnect();
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      }
    };
  }, []);

  return <>{children}</>;
}

export default BrandProvider;
