import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/ui/user-menu";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/inquiries", label: "Inquiries" },
  { href: "/users", label: "Users", adminOnly: true },
  { href: "/settings", label: "Settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const isAdminOrAbove =
    session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-border bg-card/95 backdrop-blur lg:flex">
          <div className="flex items-center gap-3 border-b border-border px-6 py-5">
            <BrandLogo size={36} />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">AND Offer</p>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4 text-sm">
            {/* Back to Home Link */}
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg border-2 border-ecommerce-border bg-ecommerce-secondary-hover px-3 py-2 font-medium text-foreground transition hover:bg-ecommerce-primary hover:text-ecommerce-primary-text"
            >
              ← Back to Home
            </Link>
            <div className="h-2" />
            {navItems
              .filter((item) => !item.adminOnly || isAdminOrAbove)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg border-2 border-border px-3 py-2 font-medium text-foreground/80 transition hover:border-ecommerce-border hover:bg-ecommerce-secondary-hover hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
          </nav>
          <div className="border-t border-border px-4 py-4 text-sm text-muted-foreground">
            <p className="text-xs">
              Logged in as {session?.user?.name || "User"}
            </p>
          </div>
        </aside>

        {/* Content */}
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card/90 px-6 backdrop-blur">
            <div className="flex items-center gap-3 lg:hidden">
              <BrandLogo size={32} />
              <span className="text-sm font-semibold text-foreground">
                Dashboard
              </span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />
              {session?.user && (
                <UserMenu
                  user={session.user}
                  links={navItems.filter(
                    (item) => !item.adminOnly || isAdminOrAbove,
                  )}
                />
              )}
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
