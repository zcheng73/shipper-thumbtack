import { Star, User } from "lucide-react";
import { Card } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface Review {
  id: number;
  rating: number;
  reviewText: string;
  customerName: string;
  created_at: string;
}

interface ReviewDisplayProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function ReviewDisplay({
  reviews,
  averageRating,
  totalReviews,
}: ReviewDisplayProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-100 text-green-800";
    if (rating >= 3.5) return "bg-blue-100 text-blue-800";
    if (rating >= 2.5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="space-y-6">
      {/* Average Rating Summary */}
      {totalReviews > 0 && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Rating</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-lg text-gray-600">/5</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`transition-colors ${
                        star <= Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
            <Badge className={`px-4 py-2 text-sm font-semibold ${getRatingColor(averageRating)}`}>
              {averageRating >= 4.5 ? "Excellent" : averageRating >= 3.5 ? "Good" : averageRating >= 2.5 ? "Fair" : "Needs Improvement"}
            </Badge>
          </div>
        </Card>
      )}

      {/* Individual Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="p-5 bg-white border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.customerName}`} />
                  <AvatarFallback>
                    <User size={20} />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`transition-colors ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {review.reviewText && (
                    <p className="text-gray-700 mt-3 leading-relaxed">
                      {review.reviewText}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-gray-50 border-gray-200">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        </Card>
      )}
    </div>
  );
}
