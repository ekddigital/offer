import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ====================================================================
        // BRAND COLORS - Dynamic CSS Variables from theme.ts
        // Use: bg-brand-primary, text-brand-secondary, border-brand-accent, etc.
        // ====================================================================
        brand: {
          // Primary colors (Navy) - with light shades for subtle backgrounds
          primary: {
            50: "var(--brand-primary-50)",
            100: "var(--brand-primary-100)",
            200: "var(--brand-primary-200)",
            DEFAULT: "var(--brand-primary)",
            light: "var(--brand-primary-light)",
            dark: "var(--brand-primary-dark)",
            foreground: "var(--brand-primary-foreground)",
          },
          // Secondary colors (Royal Blue) - with light shades for subtle backgrounds
          secondary: {
            50: "var(--brand-secondary-50)",
            100: "var(--brand-secondary-100)",
            200: "var(--brand-secondary-200)",
            DEFAULT: "var(--brand-secondary)",
            light: "var(--brand-secondary-light)",
            dark: "var(--brand-secondary-dark)",
            foreground: "var(--brand-secondary-foreground)",
          },
          // Accent colors (Amber) - with light shades for subtle backgrounds
          accent: {
            50: "var(--brand-accent-50)",
            100: "var(--brand-accent-100)",
            200: "var(--brand-accent-200)",
            DEFAULT: "var(--brand-accent)",
            light: "var(--brand-accent-light)",
            dark: "var(--brand-accent-dark)",
            foreground: "var(--brand-accent-foreground)",
          },
          // Semantic colors
          success: {
            DEFAULT: "var(--brand-success)",
            light: "var(--brand-success-light)",
            dark: "var(--brand-success-dark)",
          },
          warning: {
            DEFAULT: "var(--brand-warning)",
            light: "var(--brand-warning-light)",
            dark: "var(--brand-warning-dark)",
          },
          error: {
            DEFAULT: "var(--brand-error)",
            light: "var(--brand-error-light)",
            dark: "var(--brand-error-dark)",
          },
          info: {
            DEFAULT: "var(--brand-info)",
            light: "var(--brand-info-light)",
            dark: "var(--brand-info-dark)",
          },
        },
        // Dashboard-specific colors
        dashboard: {
          sidebar: {
            bg: "var(--dashboard-sidebar-bg)",
            "bg-hover": "var(--dashboard-sidebar-bg-hover)",
            text: "var(--dashboard-sidebar-text)",
            "text-active": "var(--dashboard-sidebar-text-active)",
            accent: "var(--dashboard-sidebar-accent)",
            border: "var(--dashboard-sidebar-border)",
          },
        },
        // E-commerce specific colors
        ecommerce: {
          price: "var(--ecommerce-price-highlight)",
          "price-dark": "var(--ecommerce-price-highlight-dark)",
          sale: "var(--ecommerce-sale-badge)",
          "sale-text": "var(--ecommerce-sale-badge-text)",
          star: "var(--ecommerce-rating-star)",
          "star-empty": "var(--ecommerce-rating-empty)",
        },
        // ====================================================================
        // SHADCN/UI COLORS - Theme-aware (light/dark mode)
        // ====================================================================
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Custom keyframes for animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-out",
        "slide-out-to-left": "slide-out-to-left 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
