import type { EntityConfig } from "../hooks/useEntity";

export const reviewEntityConfig: EntityConfig = {
  name: "Review",
  orderBy: "created_at DESC",
  properties: {
    bookingId: { type: "integer", description: "Associated booking ID" },
    serviceId: { type: "integer", description: "Associated service ID" },
    providerId: { type: "integer", description: "Service provider user ID" },
    customerId: { type: "integer", description: "Customer user ID" },
    rating: { type: "integer", description: "Star rating from 1-5" },
    reviewText: { type: "string", description: "Customer review text" },
    customerName: { type: "string", description: "Customer name for display" },
  },
  required: ["bookingId", "serviceId", "providerId", "customerId", "rating"],
};
