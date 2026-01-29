import Link from "next/link";

const footerLinks = [
  {
    title: "Products",
    links: [
      { label: "Transport Materials", href: "/offers/transport" },
      { label: "Mobile & Electronics", href: "/offers/electronics" },
      { label: "Construction Supply", href: "/offers/construction" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Suppliers", href: "/suppliers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-sm font-bold text-white">
                A
              </div>
              <span className="text-lg font-bold text-brand-primary dark:text-foreground">
                ANDOffer
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              A.N.D. GROUP OF COMPANIES LLC — Direct sourcing from China&apos;s industrial partners.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-sm font-semibold">{group.title}</h4>
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
          <p>© {new Date().getFullYear()} A.N.D. GROUP OF COMPANIES LLC. All rights reserved.</p>
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
