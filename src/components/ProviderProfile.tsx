import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ReviewDisplay } from "./ReviewDisplay";
import { Star, Mail, Phone, MapPin, Award } from "lucide-react";

interface ProviderProfileProps {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  description: string;
  serviceCategories: string[];
  experience: string;
  hourlyRate: number;
  reviews: Array<{
    id: number;
    rating: number;
    reviewText: string;
    customerName: string;
    created_at: string;
  }>;
  averageRating: number;
}

export function ProviderProfile({
  name,
  email,
  phone,
  location,
  avatar,
  description,
  serviceCategories,
  experience,
  hourlyRate,
  reviews,
  averageRating,
}: ProviderProfileProps) {
  const totalReviews = reviews.length;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <Avatar className="h-32 w-32">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="text-2xl">{name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>

              {/* Rating Summary */}
              {totalReviews > 0 && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={`${
                          star <= Math.round(averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-blue-900">
                    {averageRating.toFixed(1)}/5
                  </span>
                  <span className="text-gray-600">
                    {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                  </span>
                </div>
              )}

              {description && (
                <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>
              )}

              <div className="space-y-2">
                {email && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{email}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{phone}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">${hourlyRate}</p>
            <p className="text-sm text-gray-600 mt-1">Hourly Rate</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3 fill-yellow-500" />
            <p className="text-3xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Average Rating</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6 text-center">
            <span className="text-3xl font-bold text-gray-900 block">{totalReviews}</span>
            <p className="text-sm text-gray-600 mt-1">Customer Reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Services */}
      {serviceCategories.length > 0 && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Services Offered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {serviceCategories.map((category) => (
                <Badge
                  key={category}
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experience */}
      {experience && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{experience}</p>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      <ReviewDisplay
        reviews={reviews}
        averageRating={averageRating}
        totalReviews={totalReviews}
      />
    </div>
  );
}
