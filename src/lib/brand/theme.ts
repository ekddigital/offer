/**
 * ============================================================================
 * BRAND THEME CONFIGURATION - A.N.D. GROUP OF COMPANIES LLC
 * ============================================================================
 *
 * Single source of truth for all colors used in andoffer.
 * Edit colors here to update the entire UI consistently.
 *
 * Color strategy:
 * - Primary: Navy (parent company core identity)
 * - Secondary: Royal blue (energy + commerce)
 * - Accent: Amber (premium CTA / highlights)
 * ============================================================================
 */

export const THEME_COLORS = {
  /**
   * PRIMARY - Navy (parent company identity)
   */
  primary: {
    50: "#EEF3FA",
    100: "#D9E3F4",
    200: "#B3C7EA",
    DEFAULT: "#0B1F3A",
    light: "#132B4A",
    dark: "#081425",
    foreground: "#FFFFFF",
  },

  /**
   * SECONDARY - Royal Blue (commerce + trust)
   */
  secondary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    DEFAULT: "#1D4ED8",
    light: "#3B6EF0",
    dark: "#1E40AF",
    foreground: "#FFFFFF",
  },

  /**
   * ACCENT - Amber (premium highlights)
   */
  accent: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    DEFAULT: "#F59E0B",
    light: "#FBBF24",
    dark: "#D97706",
    foreground: "#111827",
  },

  /**
   * SEMANTIC COLORS
   */
  success: {
    DEFAULT: "#10B981",
    light: "#34D399",
    dark: "#059669",
    foreground: "#FFFFFF",
  },
  warning: {
    DEFAULT: "#F59E0B",
    light: "#FBBF24",
    dark: "#D97706",
    foreground: "#111827",
  },
  error: {
    DEFAULT: "#EF4444",
    light: "#F87171",
    dark: "#DC2626",
    foreground: "#FFFFFF",
  },
  info: {
    DEFAULT: "#0EA5E9",
    light: "#38BDF8",
    dark: "#0284C7",
    foreground: "#FFFFFF",
  },

  /**
   * NEUTRALS - UI backgrounds / borders / text
   */
  neutral: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
    950: "#020617",
  },

  /**
   * DASHBOARD (optional)
   */
  dashboard: {
    sidebarBg: "#0A1A32",
    sidebarBgHover: "#102444",
    sidebarText: "#B6C7E0",
    sidebarTextActive: "#FFFFFF",
    sidebarAccent: "#1D4ED8",
    sidebarBorder: "#102444",
  },
} as const;

export const APP_INFO = {
  name: "A.N.D. Offerings",
  shortName: "AndOffer",
  fullName: "A.N.D. GROUP OF COMPANIES LLC",
  tagline: "Unified portal for all company products and services",
  version: "0.1.0",

  contact: {
    email: "contact@andgroupco.com",
    phone: "+1 (000) 000-0000",
    address: "Global",
  },
} as const;

export type ThemeColors = typeof THEME_COLORS;
export type AppInfo = typeof APP_INFO;
