import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ReviewForm } from "./ReviewForm";

interface ReviewModalProps {
  isOpen: boolean;
  bookingId: number;
  serviceId: number;
  providerId: number;
  customerId: number;
  customerName: string;
  serviceName: string;
  onClose: () => void;
  onSubmit: (data: {
    bookingId: number;
    serviceId: number;
    providerId: number;
    customerId: number;
    rating: number;
    reviewText: string;
    customerName: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
  hasExistingReview?: boolean;
}

export function ReviewModal({
  isOpen,
  bookingId,
  serviceId,
  providerId,
  customerId,
  customerName,
  serviceName,
  onClose,
  onSubmit,
  isSubmitting = false,
  hasExistingReview = false,
}: ReviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
        </DialogHeader>
        <ReviewForm
          bookingId={bookingId}
          serviceId={serviceId}
          providerId={providerId}
          customerId={customerId}
          customerName={customerName}
          serviceName={serviceName}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          hasExistingReview={hasExistingReview}
        />
      </DialogContent>
    </Dialog>
  );
}
