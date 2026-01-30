import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

export default async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image
              src="/logo-dark.png"
              alt="AND Offer Logo"
              width={40}
              height={40}
              className="object-contain dark:hidden"
              priority
            />
            <Image
              src="/logo.png"
              alt="AND Offer Logo"
              width={40}
              height={40}
              className="hidden object-contain dark:block"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AND Offer</h1>
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/70 transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session?.user ? (
            <>
              <span className="text-sm text-foreground/70">
                {session.user.name || session.user.email}
              </span>
              {(session.user.role === "SUPER_ADMIN" ||
                session.user.role === "ADMIN" ||
                session.user.role === "STAFF") && (
                <Link
                  href="/products"
                  className="text-sm font-medium text-foreground/70 transition hover:text-foreground"
                >
                  Dashboard
                </Link>
              )}
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-sm font-medium text-foreground/70 transition hover:text-foreground"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="rounded-lg border-2 border-ecommerce-border bg-transparent px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-ecommerce-secondary-hover hover:border-ecommerce-secondary-border"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg border-2 border-ecommerce-primary bg-ecommerce-primary px-5 py-2.5 text-sm font-semibold text-ecommerce-primary-text shadow-md transition hover:bg-ecommerce-primary-hover hover:border-ecommerce-primary-hover hover:shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
