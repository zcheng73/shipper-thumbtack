import type { EntityConfig } from "../hooks/useEntity";

export const bookingEntityConfig: EntityConfig = {
  name: "Booking",
  orderBy: "created_at DESC",
  properties: {
    serviceId: { type: "integer", description: "Reference to service" },
    serviceTitle: { type: "string", description: "Service title" },
    providerName: { type: "string", description: "Provider name" },
    customerName: { type: "string", description: "Customer name" },
    customerEmail: { type: "string", description: "Customer email" },
    customerPhone: { type: "string", description: "Customer phone" },
    preferredDate: { type: "string", description: "Preferred service date" },
    preferredTime: { type: "string", description: "Preferred service time" },
    location: { type: "string", description: "Service location" },
    details: { type: "string", description: "Additional details" },
    status: {
      type: "string",
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
      description: "Booking status",
    },
    totalPrice: { type: "string", description: "Total price estimate" },
  },
  required: ["serviceId", "serviceTitle", "providerName", "customerName", "customerEmail"],
};
