import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, User, Star } from "lucide-react";

interface Booking {
  id: number;
  serviceId: number;
  serviceTitle: string;
  providerName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  details: string;
  status: string;
  totalPrice: string;
  created_at: string;
  updated_at: string;
}

interface BookingsListProps {
  bookings: Booking[];
  currentUserId: number;
  userType: "provider" | "customer";
  onReviewClick?: (booking: Booking) => void;
  hasReviewedMap?: Record<number, boolean>;
}

export function BookingsList({
  bookings,
  currentUserId,
  userType,
  onReviewClick,
  hasReviewedMap = {},
}: BookingsListProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (bookings.length === 0) {
    return (
      <Card className="text-center p-8 bg-gray-50 border-gray-200">
        <p className="text-gray-600">No bookings yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{booking.serviceTitle}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {userType === "customer" ? booking.providerName : booking.customerName}
                </p>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{booking.preferredDate} at {booking.preferredTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{booking.location}</span>
              </div>
              {userType === "customer" && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{booking.providerName}</span>
                  </div>
                  <div className="text-sm text-gray-700 font-semibold">
                    {booking.totalPrice}
                  </div>
                </>
              )}
            </div>

            {booking.details && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{booking.details}</p>
              </div>
            )}

            {userType === "customer" && booking.status.toLowerCase() === "completed" && (
              <div className="pt-2 border-t border-gray-200">
                {hasReviewedMap[booking.id] ? (
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                    <Star className="w-4 h-4 fill-green-600 text-green-600" />
                    <span>You have reviewed this service</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => onReviewClick?.(booking)}
                    variant="outline"
                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Leave a Review
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
