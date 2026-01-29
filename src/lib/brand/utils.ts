/**
 * ============================================================================
 * BRAND UTILITIES - CSS Variable Generator
 * ============================================================================
 */

import { THEME_COLORS, APP_INFO } from "./theme";

export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace(/^#/, "");

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hexToHSLString(hex: string): string {
  const { h, s, l } = hexToHSL(hex);
  return `${h} ${s}% ${l}%`;
}

function adjustLightness(hex: string, amount: number): string {
  const { h, s, l } = hexToHSL(hex);
  const newL = Math.max(0, Math.min(100, l + amount));
  return `${h} ${s}% ${newL}%`;
}

export function generateBrandVariables(): Record<string, string> {
  return {
    // Primary
    "--brand-primary-50": THEME_COLORS.primary[50],
    "--brand-primary-100": THEME_COLORS.primary[100],
    "--brand-primary-200": THEME_COLORS.primary[200],
    "--brand-primary": THEME_COLORS.primary.DEFAULT,
    "--brand-primary-light": THEME_COLORS.primary.light,
    "--brand-primary-dark": THEME_COLORS.primary.dark,
    "--brand-primary-foreground": THEME_COLORS.primary.foreground,

    // Secondary
    "--brand-secondary-50": THEME_COLORS.secondary[50],
    "--brand-secondary-100": THEME_COLORS.secondary[100],
    "--brand-secondary-200": THEME_COLORS.secondary[200],
    "--brand-secondary": THEME_COLORS.secondary.DEFAULT,
    "--brand-secondary-light": THEME_COLORS.secondary.light,
    "--brand-secondary-dark": THEME_COLORS.secondary.dark,
    "--brand-secondary-foreground": THEME_COLORS.secondary.foreground,

    // Accent
    "--brand-accent-50": THEME_COLORS.accent[50],
    "--brand-accent-100": THEME_COLORS.accent[100],
    "--brand-accent-200": THEME_COLORS.accent[200],
    "--brand-accent": THEME_COLORS.accent.DEFAULT,
    "--brand-accent-light": THEME_COLORS.accent.light,
    "--brand-accent-dark": THEME_COLORS.accent.dark,
    "--brand-accent-foreground": THEME_COLORS.accent.foreground,

    // Semantic
    "--brand-success": THEME_COLORS.success.DEFAULT,
    "--brand-success-light": THEME_COLORS.success.light,
    "--brand-success-dark": THEME_COLORS.success.dark,
    "--brand-warning": THEME_COLORS.warning.DEFAULT,
    "--brand-warning-light": THEME_COLORS.warning.light,
    "--brand-warning-dark": THEME_COLORS.warning.dark,
    "--brand-error": THEME_COLORS.error.DEFAULT,
    "--brand-error-light": THEME_COLORS.error.light,
    "--brand-error-dark": THEME_COLORS.error.dark,
    "--brand-info": THEME_COLORS.info.DEFAULT,
    "--brand-info-light": THEME_COLORS.info.light,
    "--brand-info-dark": THEME_COLORS.info.dark,

    // Dashboard
    "--dashboard-sidebar-bg": THEME_COLORS.dashboard.sidebarBg,
    "--dashboard-sidebar-bg-hover": THEME_COLORS.dashboard.sidebarBgHover,
    "--dashboard-sidebar-text": THEME_COLORS.dashboard.sidebarText,
    "--dashboard-sidebar-text-active": THEME_COLORS.dashboard.sidebarTextActive,
    "--dashboard-sidebar-accent": THEME_COLORS.dashboard.sidebarAccent,
    "--dashboard-sidebar-border": THEME_COLORS.dashboard.sidebarBorder,
  };
}

export function generateBaseUIVariables(): Record<string, string> {
  return {
    "--background": "220 40% 98%",
    "--foreground": hexToHSLString(THEME_COLORS.primary.dark),
    "--card": "0 0% 100%",
    "--card-foreground": hexToHSLString(THEME_COLORS.primary.dark),
    "--popover": "0 0% 100%",
    "--popover-foreground": hexToHSLString(THEME_COLORS.primary.dark),
    "--primary": hexToHSLString(THEME_COLORS.primary.DEFAULT),
    "--primary-foreground": "0 0% 100%",
    "--secondary": hexToHSLString(THEME_COLORS.secondary.DEFAULT),
    "--secondary-foreground": "0 0% 100%",
    "--accent": hexToHSLString(THEME_COLORS.accent.DEFAULT),
    "--accent-foreground": "230 20% 10%",
    "--muted": adjustLightness(THEME_COLORS.neutral[200], 6),
    "--muted-foreground": adjustLightness(THEME_COLORS.neutral[600], 6),
    "--destructive": hexToHSLString(THEME_COLORS.error.DEFAULT),
    "--destructive-foreground": "0 0% 98%",
    "--border": adjustLightness(THEME_COLORS.neutral[200], 0),
    "--input": adjustLightness(THEME_COLORS.neutral[200], 0),
    "--ring": hexToHSLString(THEME_COLORS.secondary.DEFAULT),
    "--radius": "0.6rem",
  };
}

export function generateDarkModeVariables(): Record<string, string> {
  return {
    "--background": "220 30% 8%",
    "--foreground": "220 20% 96%",
    "--card": "220 30% 12%",
    "--card-foreground": "220 20% 96%",
    "--popover": "220 30% 12%",
    "--popover-foreground": "220 20% 96%",
    "--primary": hexToHSLString(THEME_COLORS.primary.light),
    "--primary-foreground": "220 30% 8%",
    "--secondary": hexToHSLString(THEME_COLORS.secondary.light),
    "--secondary-foreground": "220 30% 8%",
    "--accent": hexToHSLString(THEME_COLORS.accent.light),
    "--accent-foreground": "230 20% 10%",
    "--muted": "220 20% 16%",
    "--muted-foreground": "220 12% 65%",
    "--destructive": "0 62% 40%",
    "--destructive-foreground": "0 0% 98%",
    "--border": "220 20% 18%",
    "--input": "220 20% 18%",
    "--ring": hexToHSLString(THEME_COLORS.secondary.light),
  };
}

export function generateCSSVariables(): Record<string, string> {
  return {
    ...generateBrandVariables(),
    ...generateBaseUIVariables(),
  };
}

export function generateDarkCSSVariables(): Record<string, string> {
  return {
    ...generateBrandVariables(),
    ...generateDarkModeVariables(),
  };
}

export function getColor(
  category:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error"
    | "info",
  shade: "DEFAULT" | "light" | "dark" | "foreground" = "DEFAULT",
): string {
  return THEME_COLORS[category][shade];
}

export function getAppInfo() {
  return APP_INFO;
}
