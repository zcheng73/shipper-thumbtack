import type { EntityConfig } from "../hooks/useEntity";

export const userEntityConfig: EntityConfig = {
  name: "User",
  orderBy: "created_at DESC",
  properties: {
    name: { type: "string", description: "User full name" },
    email: { type: "string", description: "User email address" },
    phone: { type: "string", description: "User phone number" },
    userType: {
      type: "string",
      enum: ["provider", "customer"],
      description: "Type of user account",
    },
    avatar: { type: "string", description: "Avatar image URL or data URI" },
    // Provider-specific fields
    serviceCategories: { type: "string", description: "JSON array of service category IDs" },
    description: { type: "string", description: "Provider bio/description" },
    hourlyRate: { type: "number", description: "Provider hourly rate" },
    experience: { type: "string", description: "Years of experience" },
    // Customer-specific fields
    preferredCategories: { type: "string", description: "JSON array of preferred category IDs" },
    location: { type: "string", description: "User location/zip code" },
    onboardingCompleted: { type: "string", default: "false", description: "Onboarding status" },
  },
  required: ["name", "email", "userType"],
};
