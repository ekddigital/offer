/**
 * ============================================================================
 * BRAND THEME CONFIGURATION - A.N.D. GROUP OF COMPANIES LLC
 * ============================================================================
 *
 * Single source of truth for all colors used in andoffer.
 * Edit colors here to update the entire UI consistently.
 *
 * E-commerce optimized color system with trust, clarity, and conversion focus.
 * ============================================================================
 */

export const THEME_COLORS = {
  /**
   * PRIMARY - Navy (Brand Anchor)
   */
  primary: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    DEFAULT: "#0B1220", // Brand core
    light: "#111827", // Cards/Nav
    dark: "#0B0F1A",
    foreground: "#FFFFFF",
  },

  /**
   * SECONDARY - Cyan (Primary CTA - High conversion)
   */
  secondary: {
    50: "#ECFEFF",
    100: "#CFFAFE",
    200: "#A5F3FC",
    DEFAULT: "#22D3EE", // Active state
    light: "#67E8F9", // Hover state
    dark: "#0891B2",
    foreground: "#0B1220",
  },

  /**
   * ACCENT - Teal (Price highlights, special elements)
   */
  accent: {
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    DEFAULT: "#0D9488",
    light: "#14B8A6",
    dark: "#0F766E",
    foreground: "#FFFFFF",
  },

  /**
   * SEMANTIC COLORS
   */
  success: {
    DEFAULT: "#22C55E", // Dark mode
    light: "#16A34A", // Light mode
    dark: "#15803D",
    foreground: "#FFFFFF",
  },
  warning: {
    DEFAULT: "#FACC15", // Dark mode / Rating stars
    light: "#CA8A04", // Light mode
    dark: "#A16207",
    foreground: "#0B1220",
  },
  error: {
    DEFAULT: "#EF4444", // Sale badges
    light: "#DC2626", // Light mode
    dark: "#B91C1C",
    foreground: "#FFFFFF",
  },
  info: {
    DEFAULT: "#38BDF8", // Dark mode
    light: "#0284C7", // Light mode
    dark: "#0369A1",
    foreground: "#FFFFFF",
  },

  /**
   * NEUTRAL PALETTE - Text, Borders, Backgrounds
   */
  neutral: {
    50: "#F8FAFC", // Light mode main bg
    100: "#F1F5F9", // Light mode alt section
    200: "#E5E7EB", // Light mode default border
    300: "#CBD5E1", // Light mode soft divider
    400: "#94A3B8", // Disabled text
    500: "#64748B", // Muted text light mode
    600: "#334155", // Secondary text light / input border dark
    700: "#1F2937", // Cards dark / secondary action dark
    800: "#111827", // Surface dark / elevated
    900: "#0B1220", // Main bg dark
    950: "#0B0F1A", // Deeper dark
  },

  /**
   * E-COMMERCE SPECIFIC
   */
  ecommerce: {
    priceHighlight: "#0D9488", // Teal for prices
    priceHighlightDark: "#99F6E4", // Light teal for dark mode
    saleBadge: "#EF4444", // Red for discounts
    saleBadgeText: "#FFFFFF",
    ratingStar: "#FACC15", // Gold for stars
    ratingEmpty: "#CBD5E1", // Gray for empty stars
  },

  /**
   * DASHBOARD (optional)
   */
  dashboard: {
    sidebarBg: "#0B1220",
    sidebarBgHover: "#111827",
    sidebarText: "#9CA3AF",
    sidebarTextActive: "#FFFFFF",
    sidebarAccent: "#A5F3FC",
    sidebarBorder: "#1F2937",
  },
} as const;

export const APP_INFO = {
  name: "AND Offer",
  shortName: "AND Offer",
  fullName: "A.N.D. GROUP OF COMPANIES LLC",
  tagline: "Premium sourcing for heavy equipment and electronics",
  version: "0.1.0",

  contact: {
    email: "contact@andgroupco.com",
    phone: "+86 185 0683 2159",
    phone2: "+231 889 233 833",
    address: {
      street: "Japan Freeway, Jacob Town",
      city: "Adjacent Lonestar, Paynesville",
      region: "Montserrado County",
      country: "Liberia",
    },
  },
} as const;

export type ThemeColors = typeof THEME_COLORS;
export type AppInfo = typeof APP_INFO;
