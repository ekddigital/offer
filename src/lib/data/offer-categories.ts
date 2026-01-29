import { z } from "zod";

const offerCategorySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tone: z.string().min(1),
  highlights: z.array(z.string()).min(1),
});

const offerCategoriesSchema = z.array(offerCategorySchema).min(1);

export type OfferCategory = z.infer<typeof offerCategorySchema>;

export const offerCategories = offerCategoriesSchema.parse([
  {
    title: "Transport Materials",
    description:
      "Excavators, trucks, cranes, and logistics equipment sourced directly from China.",
    tone: "bg-brand-primary-50",
    highlights: ["Industrial suppliers", "Bulk pricing", "Fast shipping"],
  },
  {
    title: "Mobile & Electronics",
    description: "iPhone 17 series, accessories, and smart devices at scale.",
    tone: "bg-brand-secondary-50",
    highlights: ["Authentic supply", "Warranty support", "Volume discounts"],
  },
  {
    title: "Construction Supply",
    description:
      "Safety gear, tools, and building materials for large projects.",
    tone: "bg-brand-accent-50",
    highlights: ["Certified materials", "Global freight", "Project bundles"],
  },
  {
    title: "Emerging Offers",
    description:
      "New partnerships and exclusive enterprise bundles coming soon.",
    tone: "bg-card",
    highlights: ["Early access", "Pilot programs", "Custom sourcing"],
  },
]);
