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
    // E-commerce specific colors
    "--ecommerce-price-highlight": THEME_COLORS.ecommerce.priceHighlight,
    "--ecommerce-price-highlight-dark":
      THEME_COLORS.ecommerce.priceHighlightDark,
    "--ecommerce-sale-badge": THEME_COLORS.ecommerce.saleBadge,
    "--ecommerce-sale-badge-text": THEME_COLORS.ecommerce.saleBadgeText,
    "--ecommerce-rating-star": THEME_COLORS.ecommerce.ratingStar,
    "--ecommerce-rating-empty": THEME_COLORS.ecommerce.ratingEmpty,
  };
}

export function generateBaseUIVariables(): Record<string, string> {
  return {
    // ☀️ LIGHT MODE - Clean, Trust-Focused, Sales-Friendly
    // Backgrounds
    "--background": "210 40% 98%", // #F8FAFC - Main background
    "--foreground": hexToHSLString(THEME_COLORS.neutral[900]), // #0B1220 - Primary text
    "--card": "0 0% 100%", // #FFFFFF - Cards
    "--card-foreground": hexToHSLString(THEME_COLORS.neutral[900]),
    "--popover": "0 0% 100%",
    "--popover-foreground": hexToHSLString(THEME_COLORS.neutral[900]),

    // Primary actions (Buy / Checkout)
    "--primary": hexToHSLString(THEME_COLORS.primary.DEFAULT), // #0B1220
    "--primary-foreground": "0 0% 100%",

    // Secondary actions
    "--secondary": hexToHSLString(THEME_COLORS.secondary.DEFAULT), // #22D3EE
    "--secondary-foreground": hexToHSLString(THEME_COLORS.secondary.foreground),

    // Accent (Price highlights)
    "--accent": hexToHSLString(THEME_COLORS.accent.DEFAULT), // #0D9488
    "--accent-foreground": "0 0% 100%",

    // Muted / Borders
    "--muted": "214 32% 95%", // #F1F5F9 - Alt section
    "--muted-foreground": hexToHSLString(THEME_COLORS.neutral[500]), // #64748B
    "--border": "220 13% 86%", // #D1D5DB - Default border (higher contrast)
    "--input": "220 13% 80%", // #C0C7D2 - Input border (clearer)
    "--ring": hexToHSLString(THEME_COLORS.info.light), // #0284C7 - Focus

    // Destructive
    "--destructive": hexToHSLString(THEME_COLORS.error.light), // #DC2626
    "--destructive-foreground": "0 0% 100%",

    "--radius": "0.6rem",
  };
}

export function generateDarkModeVariables(): Record<string, string> {
  return {
    // 🌙 DARK MODE - Modern, Premium E-commerce
    // Backgrounds
    "--background": "216 50% 7%", // #0B1220 - Main background
    "--foreground": "0 0% 100%", // #FFFFFF - Primary text
    "--card": "215 28% 12%", // #111827 - Cards/sections
    "--card-foreground": "210 20% 98%", // #F9FAFB
    "--popover": "215 28% 12%",
    "--popover-foreground": "210 20% 98%",

    // Primary actions (Buy / Add to Cart - Cyan)
    "--primary": hexToHSLString(THEME_COLORS.secondary[200]), // #A5F3FC - Button bg
    "--primary-foreground": hexToHSLString(THEME_COLORS.primary.DEFAULT), // #0B1220

    // Secondary actions
    "--secondary": hexToHSLString(THEME_COLORS.neutral[700]), // #1F2937
    "--secondary-foreground": "210 20% 90%", // #E5E7EB

    // Accent (Price highlights - Light teal)
    "--accent": hexToHSLString(THEME_COLORS.ecommerce.priceHighlightDark), // #99F6E4
    "--accent-foreground": hexToHSLString(THEME_COLORS.primary.DEFAULT),

    // Muted / Borders
    "--muted": "217 33% 17%", // #1F2937 - Elevated surfaces
    "--muted-foreground": "218 11% 65%", // #9CA3AF - Muted text
    "--border": "215 25% 28%", // #334155 - Default border (visible)
    "--input": "215 25% 32%", // #3B4A5C - Input border (clearer)
    "--ring": hexToHSLString(THEME_COLORS.secondary[200]), // #A5F3FC - Focus

    // Destructive
    "--destructive": hexToHSLString(THEME_COLORS.error.DEFAULT), // #EF4444
    "--destructive-foreground": "0 0% 100%",
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
