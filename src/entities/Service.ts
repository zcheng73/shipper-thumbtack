import type { EntityConfig } from "../hooks/useEntity";

export const serviceEntityConfig: EntityConfig = {
  name: "Service",
  orderBy: "created_at DESC",
  properties: {
    title: { type: "string", description: "Service title" },
    category: {
      type: "string",
      enum: [
        "home-improvement",
        "cleaning",
        "plumbing",
        "electrical",
        "painting",
        "landscaping",
        "moving",
        "handyman",
        "photography",
        "event-planning",
        "tutoring",
        "personal-training",
      ],
      description: "Service category",
    },
    description: { type: "string", description: "Service description" },
    providerName: { type: "string", description: "Service provider name" },
    providerRating: { type: "number", description: "Provider rating (0-5)" },
    reviewCount: { type: "integer", description: "Number of reviews" },
    priceRange: { type: "string", description: "Price range (e.g., $50-$100)" },
    imageUrl: { type: "string", description: "Service image URL" },
    location: { type: "string", description: "Service location" },
    availability: {
      type: "string",
      enum: ["available", "busy", "unavailable"],
      default: "available",
      description: "Provider availability",
    },
  },
  required: ["title", "category", "providerName", "priceRange"],
};
