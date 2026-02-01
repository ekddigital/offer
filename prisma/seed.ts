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
        emailVerified: new Date(), // Email is verified
        isActive: true, // Account is active
      },
    });
    console.log("✅ Created SUPER_ADMIN:", superAdmin.email);
  } else {
    // Update existing admin to ensure they're verified and active
    await db.user.update({
      where: { email: superAdminEmail },
      data: {
        emailVerified: new Date(),
        isActive: true,
      },
    });
    console.log(
      "ℹ️  SUPER_ADMIN already exists and verified:",
      superAdminEmail,
    );
  }

  // Create categories
  const categories = [
    {
      name: "Transportation Products",
      slug: "transportation-products",
      description:
        "Vehicles, heavy equipment, trucks, excavators, and logistics materials",
      sortOrder: 1,
    },
    {
      name: "Electronic Products",
      slug: "electronic-products",
      description:
        "Smartphones, tablets, laptops, computers, and electronic devices",
      sortOrder: 2,
    },
    {
      name: "Housing Products",
      slug: "housing-products",
      description:
        "Building materials, furniture, fixtures, and home improvement supplies",
      sortOrder: 3,
    },
    {
      name: "Construction Supply",
      slug: "construction-supply",
      description:
        "Safety gear, tools, and building materials for large projects",
      sortOrder: 4,
    },
    {
      name: "Industrial Equipment",
      slug: "industrial-equipment",
      description: "Machinery, tools, and equipment for industrial operations",
      sortOrder: 5,
    },
    {
      name: "Consumer Goods",
      slug: "consumer-goods",
      description:
        "General consumer products, household items, and personal accessories",
      sortOrder: 6,
    },
    {
      name: "Medical & Healthcare",
      slug: "medical-healthcare",
      description:
        "Medical equipment, healthcare supplies, and wellness products",
      sortOrder: 7,
    },
    {
      name: "Textile & Apparel",
      slug: "textile-apparel",
      description: "Clothing, fabrics, textiles, and fashion accessories",
      sortOrder: 8,
    },
  ];

  for (const categoryData of categories) {
    const existingCategory = await db.category.findUnique({
      where: { slug: categoryData.slug },
    });

    if (!existingCategory) {
      const category = await db.category.create({
        data: categoryData,
      });
      console.log("✅ Created category:", category.name);
    } else {
      console.log("ℹ️  Category already exists:", categoryData.name);
    }
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
