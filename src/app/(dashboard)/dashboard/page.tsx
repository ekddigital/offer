import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  Package,
  FolderTree,
  Building2,
  MessageSquare,
  Users,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch statistics
  const [
    productsCount,
    categoriesCount,
    suppliersCount,
    inquiriesCount,
    usersCount,
    recentProducts,
    recentInquiries,
  ] = await Promise.all([
    db.product.count(),
    db.category.count(),
    db.supplier.count(),
    db.inquiry.count(),
    session.user.role === "SUPER_ADMIN" || session.user.role === "ADMIN"
      ? db.user.count()
      : Promise.resolve(0),
    db.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    db.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const isAdmin =
    session.user.role === "SUPER_ADMIN" || session.user.role === "ADMIN";

  const stats = [
    {
      label: "Products",
      value: productsCount,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400",
      href: "/products",
    },
    {
      label: "Categories",
      value: categoriesCount,
      icon: FolderTree,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-600 dark:text-purple-400",
      href: "/categories",
    },
    {
      label: "Suppliers",
      value: suppliersCount,
      icon: Building2,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      textColor: "text-green-600 dark:text-green-400",
      href: "/suppliers",
    },
    {
      label: "Inquiries",
      value: inquiriesCount,
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-600 dark:text-orange-400",
      href: "/inquiries",
    },
  ];

  if (isAdmin) {
    stats.push({
      label: "Users",
      value: usersCount,
      icon: Users,
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-500/10",
      textColor: "text-cyan-600 dark:text-cyan-400",
      href: "/users",
    });
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-lg border-2 border-ecommerce-border bg-gradient-to-br from-[#A5F3FC]/10 to-[#22D3EE]/10 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {session.user.name || "User"}!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Here's an overview of your AND Offer dashboard
            </p>
          </div>
          <div className="rounded-full bg-gradient-to-br from-[#A5F3FC] to-[#22D3EE] p-3">
            <TrendingUp className="h-6 w-6 text-[#0B1220]" />
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Quick Statistics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <a
                key={stat.label}
                href={stat.href}
                className="group relative overflow-hidden rounded-lg border-2 border-ecommerce-border bg-card p-6 transition hover:border-ecommerce-secondary-border hover:bg-card/80"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-full ${stat.bgColor} p-3`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
                <div
                  className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.color} opacity-50 transition-opacity group-hover:opacity-100`}
                />
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <div className="rounded-lg border-2 border-ecommerce-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Products
            </h2>
            <a
              href="/products"
              className="text-sm font-medium text-[#22D3EE] hover:text-[#67E8F9]"
            >
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <a
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="flex items-center gap-3 rounded-md border border-border bg-background/50 p-3 transition hover:bg-accent"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-gradient-to-br from-[#A5F3FC]/20 to-[#22D3EE]/20">
                    <Package className="h-5 w-5 text-[#22D3EE]" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">
                      {product.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {product.category?.name || "Uncategorized"}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-[#22D3EE]">
                    ${product.price?.toFixed(2) ?? "0.00"}
                  </div>
                </a>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No products yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="rounded-lg border-2 border-ecommerce-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Inquiries
            </h2>
            <a
              href="/inquiries"
              className="text-sm font-medium text-[#22D3EE] hover:text-[#67E8F9]"
            >
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="rounded-md border border-border bg-background/50 p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-foreground">
                        {inquiry.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {inquiry.email}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        inquiry.status === "NEW"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-green-500/10 text-green-600 dark:text-green-400"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {inquiry.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No inquiries yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border-2 border-ecommerce-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/products/new"
            className="flex items-center gap-3 rounded-lg border-2 border-ecommerce-border bg-background px-4 py-3 transition hover:border-ecommerce-secondary-border hover:bg-ecommerce-secondary-hover"
          >
            <div className="rounded-full bg-gradient-to-br from-[#A5F3FC] to-[#22D3EE] p-2">
              <Package className="h-4 w-4 text-[#0B1220]" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Add Product
            </span>
          </a>
          <a
            href="/categories"
            className="flex items-center gap-3 rounded-lg border-2 border-ecommerce-border bg-background px-4 py-3 transition hover:border-ecommerce-secondary-border hover:bg-ecommerce-secondary-hover"
          >
            <div className="rounded-full bg-purple-500/10 p-2">
              <FolderTree className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Manage Categories
            </span>
          </a>
          <a
            href="/suppliers"
            className="flex items-center gap-3 rounded-lg border-2 border-ecommerce-border bg-background px-4 py-3 transition hover:border-ecommerce-secondary-border hover:bg-ecommerce-secondary-hover"
          >
            <div className="rounded-full bg-green-500/10 p-2">
              <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium text-foreground">
              View Suppliers
            </span>
          </a>
          <a
            href="/inquiries"
            className="flex items-center gap-3 rounded-lg border-2 border-ecommerce-border bg-background px-4 py-3 transition hover:border-ecommerce-secondary-border hover:bg-ecommerce-secondary-hover"
          >
            <div className="rounded-full bg-orange-500/10 p-2">
              <MessageSquare className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Check Inquiries
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
