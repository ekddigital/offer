import "dotenv/config";
import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  // Create SUPER_ADMIN user
  const superAdminEmail = "admin@andgroupco.com";
  const existingSuperAdmin = await db.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existingSuperAdmin) {
    const pwdHash = await bcrypt.hash("admin123456", 12);
    const superAdmin = await db.user.create({
      data: {
        email: superAdminEmail,
        name: "Super Admin",
        pwdHash,
        role: "SUPER_ADMIN",
      },
    });
    console.log("✅ Created SUPER_ADMIN:", superAdmin.email);
  } else {
    console.log("ℹ️  SUPER_ADMIN already exists:", superAdminEmail);
  }

  // Create sample category
  const categorySlug = "transport-materials";
  const existingCategory = await db.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!existingCategory) {
    const category = await db.category.create({
      data: {
        name: "Transport Materials",
        slug: categorySlug,
        description:
          "Heavy equipment, trucks, excavators, and logistics materials",
        sortOrder: 1,
      },
    });
    console.log("✅ Created category:", category.name);
  } else {
    console.log("ℹ️  Category already exists:", categorySlug);
  }

  // Create sample supplier
  const supplierName = "Shanghai Heavy Industries";
  const existingSupplier = await db.supplier.findFirst({
    where: { name: supplierName },
  });

  if (!existingSupplier) {
    const supplier = await db.supplier.create({
      data: {
        name: supplierName,
        country: "CN",
        email: "contact@shanghai-heavy.cn",
        phone: "+86 21 1234 5678",
        active: true,
      },
    });
    console.log("✅ Created supplier:", supplier.name);
  } else {
    console.log("ℹ️  Supplier already exists:", supplierName);
  }

  console.log("✨ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
