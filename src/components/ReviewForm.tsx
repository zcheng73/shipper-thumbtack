import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { AlertCircle, Star } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface ReviewFormProps {
  bookingId: number;
  serviceId: number;
  providerId: number;
  customerId: number;
  customerName: string;
  serviceName: string;
  onSubmit: (data: {
    bookingId: number;
    serviceId: number;
    providerId: number;
    customerId: number;
    rating: number;
    reviewText: string;
    customerName: string;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  hasExistingReview?: boolean;
}

export function ReviewForm({
  bookingId,
  serviceId,
  providerId,
  customerId,
  customerName,
  serviceName,
  onSubmit,
  onCancel,
  isSubmitting = false,
  hasExistingReview = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }

    if (reviewText.trim().length < 10) {
      setError("Review must be at least 10 characters long");
      return;
    }

    try {
      await onSubmit({
        bookingId,
        serviceId,
        providerId,
        customerId,
        rating,
        reviewText: reviewText.trim(),
        customerName,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    }
  };

  if (hasExistingReview) {
    return (
      <Card className="p-6 bg-blue-50 border-blue-200">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have already reviewed this service. Each customer can leave one review per booking.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Rate Your Experience</h3>
          <p className="text-sm text-gray-600 mb-4">Service: {serviceName}</p>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform duration-200 hover:scale-110"
              >
                <Star
                  size={32}
                  className={`transition-colors duration-200 ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Rating: {rating} out of 5 stars
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Your Review (optional but appreciated)
          </label>
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this service provider... (minimum 10 characters)"
            className="min-h-24 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {reviewText.length} characters
          </p>
        </div>

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
