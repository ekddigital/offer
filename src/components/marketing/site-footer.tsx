import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  {
    title: "Portal",
    links: [
      { label: "Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Suppliers", href: "/suppliers" },
      { label: "Inquiries", href: "/inquiries" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "WhatsApp Group", href: "/contact" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand - spans 2 columns on medium screens */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo-dark.png"
                  alt="AND Offer Logo"
                  width={40}
                  height={40}
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/logo.png"
                  alt="AND Offer Logo"
                  width={40}
                  height={40}
                  className="hidden object-contain dark:block"
                />
              </div>
              <div className="leading-tight">
                <span className="text-xl font-bold text-brand-primary dark:text-foreground">
                  AND Offer
                </span>
                <p className="text-xs text-muted-foreground">
                  by A.N.D. GROUP OF COMPANIES
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Direct sourcing platform for heavy equipment, industrial
              machinery, and electronics from trusted Chinese suppliers.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              Head Office
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Japan Freeway, Jacob Town</p>
              <p>Adjacent Lonestar, Paynesville</p>
              <p>Montserrado County, Liberia</p>
            </div>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p>+86 185 0683 2159</p>
              <p>+231 889 233 833</p>
              <p>contact@andgroupco.com</p>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} A.N.D. GROUP OF COMPANIES LLC. All
            rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              WhatsApp
            </a>
            <a
              href="mailto:support@offer.andgroupco.com"
              className="transition hover:text-foreground"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
