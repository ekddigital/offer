"use client";

import { useEffect } from "react";
import { generateCSSVariables, generateDarkCSSVariables } from "@/lib/brand";

/**
 * BrandProvider
 * Injects CSS variables based on brand theme.
 */
export function BrandProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    const getIsDark = () =>
      root.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const applyVariables = () => {
      const isDark = getIsDark();
      const cssVariables = isDark
        ? generateDarkCSSVariables()
        : generateCSSVariables();

      Object.entries(cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      return cssVariables;
    };

    let currentVars = applyVariables();

    const cleanup = () => {
      Object.keys(currentVars).forEach((key) => {
        root.style.removeProperty(key);
      });
    };

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      cleanup();
      currentVars = applyVariables();
    };

    if (media.addEventListener) {
      media.addEventListener("change", handleMediaChange);
    } else {
      media.addListener(handleMediaChange);
    }

    const observer = new MutationObserver(() => {
      cleanup();
      currentVars = applyVariables();
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", handleMediaChange);
      } else {
        media.removeListener(handleMediaChange);
      }
      observer.disconnect();
      cleanup();
    };
  }, []);

  return <>{children}</>;
}

export default BrandProvider;
