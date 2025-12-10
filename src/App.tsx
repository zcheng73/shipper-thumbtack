import { useState, useEffect } from "react";
import { useEntity } from "./hooks/useEntity";
import { serviceEntityConfig, bookingEntityConfig, userEntityConfig, reviewEntityConfig } from "./entities";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Star, Search, MapPin, Calendar, Clock, User, Mail, Phone, CheckCircle2 } from "lucide-react";
import OnboardingChoice from "./components/OnboardingChoice";
import ProviderOnboarding from "./components/ProviderOnboarding";
import CustomerOnboarding from "./components/CustomerOnboarding";
import { ReviewModal } from "./components/ReviewModal";
import { ReviewDisplay } from "./components/ReviewDisplay";

type Service = {
  id: number;
  title: string;
  category: string;
  description: string;
  providerName: string;
  providerRating: number;
  reviewCount: number;
  priceRange: string;
  imageUrl: string;
  location: string;
  availability: string;
  created_at: string;
  updated_at: string;
};

type Booking = {
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
};

type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  userType: "provider" | "customer";
  avatar: string;
  serviceCategories: string;
  description: string;
  hourlyRate: number;
  experience: string;
  preferredCategories: string;
  location: string;
  onboardingCompleted: string;
  created_at: string;
  updated_at: string;
};

type Review = {
  id: number;
  bookingId: number;
  serviceId: number;
  providerId: number;
  customerId: number;
  rating: number;
  reviewText: string;
  customerName: string;
  created_at: string;
  updated_at: string;
};

const categories = [
  { id: "home-improvement", name: "Home Improvement", icon: "🏠" },
  { id: "cleaning", name: "Cleaning", icon: "✨" },
  { id: "plumbing", name: "Plumbing", icon: "🔧" },
  { id: "electrical", name: "Electrical", icon: "⚡" },
  { id: "painting", name: "Painting", icon: "🎨" },
  { id: "landscaping", name: "Landscaping", icon: "🌳" },
  { id: "moving", name: "Moving", icon: "📦" },
  { id: "handyman", name: "Handyman", icon: "🛠️" },
  { id: "photography", name: "Photography", icon: "📸" },
  { id: "event-planning", name: "Event Planning", icon: "🎉" },
  { id: "tutoring", name: "Tutoring", icon: "📚" },
  { id: "personal-training", name: "Personal Training", icon: "💪" },
];

function App() {
  const { items: services, loading, create: createService } = useEntity<Service>(serviceEntityConfig);
  const { create: createBooking } = useEntity<Booking>(bookingEntityConfig);
  const { items: users, create: createUser } = useEntity<UserProfile>(userEntityConfig);
  const { items: reviews, create: createReview } = useEntity<Review>(reviewEntityConfig);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    preferredDate: "",
    preferredTime: "",
    location: "",
    details: "",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // Onboarding state
  const [onboardingStep, setOnboardingStep] = useState<"choice" | "provider" | "customer" | "complete" | "none">("none");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (users.length > 0) {
      const user = users[0];
      setCurrentUser(user);
      setOnboardingStep("none"); // Skip onboarding if user exists
    } else {
      setOnboardingStep("choice"); // Show onboarding only if no user exists
    }
  }, [users]);

  useEffect(() => {
    if (services.length === 0 && !loading && onboardingStep === "complete") {
      initializeSampleData();
    }
  }, [services, loading, onboardingStep]);

  const initializeSampleData = async () => {
    const sampleServices = [
      {
        title: "Professional House Cleaning",
        category: "cleaning",
        description: "Deep cleaning service for homes and apartments. We bring all supplies and equipment.",
        providerName: "Crystal Clean Services",
        providerRating: 4.9,
        reviewCount: 127,
        priceRange: "$80-$150",
        imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
        location: "San Francisco, CA",
        availability: "available",
      },
      {
        title: "Emergency Plumbing Repair",
        category: "plumbing",
        description: "24/7 emergency plumbing services. Licensed and insured plumbers available.",
        providerName: "QuickFix Plumbing",
        providerRating: 4.8,
        reviewCount: 203,
        priceRange: "$100-$300",
        imageUrl: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800",
        location: "San Francisco, CA",
        availability: "available",
      },
      {
        title: "Interior & Exterior Painting",
        category: "painting",
        description: "Professional painting services for residential and commercial properties.",
        providerName: "ColorPro Painters",
        providerRating: 4.7,
        reviewCount: 89,
        priceRange: "$200-$500",
        imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800",
        location: "San Francisco, CA",
        availability: "available",
      },
      {
        title: "Electrical Installation & Repair",
        category: "electrical",
        description: "Certified electricians for all your electrical needs. Same-day service available.",
        providerName: "BrightSpark Electric",
        providerRating: 5.0,
        reviewCount: 156,
        priceRange: "$75-$250",
        imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
        location: "San Francisco, CA",
        availability: "available",
      },
      {
        title: "Garden & Lawn Care",
        category: "landscaping",
        description: "Complete landscaping services including mowing, trimming, and garden design.",
        providerName: "GreenThumb Landscaping",
        providerRating: 4.6,
        reviewCount: 72,
        priceRange: "$60-$200",
        imageUrl: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800",
        location: "San Francisco, CA",
        availability: "available",
      },
      {
        title: "Professional Moving Service",
        category: "moving",
        description: "Full-service moving company with packing, loading, and unloading services.",
        providerName: "SwiftMove Solutions",
        providerRating: 4.8,
        reviewCount: 194,
        priceRange: "$150-$600",
        imageUrl: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800",
        location: "San Francisco, CA",
        availability: "available",
      },
      {
        title: "Handyman Services",
        category: "handyman",
        description: "General handyman services for repairs, installations, and maintenance.",
        providerName: "FixIt Right Handyman",
        providerRating: 4.7,
        reviewCount: 143,
        priceRange: "$50-$150",
        imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
        location: "San Francisco, CA",
        availability: "available",
      },
      {
        title: "Event Photography",
        category: "photography",
        description: "Professional photography for weddings, parties, and corporate events.",
        providerName: "Moments Captured Photography",
        providerRating: 5.0,
        reviewCount: 98,
        priceRange: "$300-$1000",
        imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800",
        location: "San Francisco, CA",
        availability: "available",
      },
    ];

    for (const service of sampleServices) {
      await createService(service);
    }
  };

  const handleSelectUserType = (userType: "provider" | "customer") => {
    setOnboardingStep(userType);
  };

  const handleProviderOnboardingComplete = async (data: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    serviceCategories: string[];
    description: string;
    hourlyRate: number;
    experience: string;
  }) => {
    await createUser({
      ...data,
      userType: "provider",
      serviceCategories: JSON.stringify(data.serviceCategories),
      preferredCategories: "[]",
      location: "",
      onboardingCompleted: "true",
    });
    setOnboardingStep("complete");
  };

  const handleCustomerOnboardingComplete = async (data: {
    name: string;
    email: string;
    phone: string;
    preferredCategories: string[];
    location: string;
  }) => {
    await createUser({
      ...data,
      userType: "customer",
      avatar: "",
      serviceCategories: "[]",
      description: "",
      hourlyRate: 0,
      experience: "",
      preferredCategories: JSON.stringify(data.preferredCategories),
      onboardingCompleted: "true",
    });
    setOnboardingStep("complete");
  };

  const handleCustomerSkip = async () => {
    setOnboardingStep("complete");
  };

  // Show onboarding ONLY if no user exists and in choice/provider/customer step
  if (users.length === 0 && onboardingStep === "choice") {
    return <OnboardingChoice onSelectUserType={handleSelectUserType} />;
  }

  if (users.length === 0 && onboardingStep === "provider") {
    return <ProviderOnboarding onComplete={handleProviderOnboardingComplete} />;
  }

  if (users.length === 0 && onboardingStep === "customer") {
    return <CustomerOnboarding onComplete={handleCustomerOnboardingComplete} onSkip={handleCustomerSkip} />;
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setBookingForm({
      customerName: currentUser?.name || "",
      customerEmail: currentUser?.email || "",
      customerPhone: currentUser?.phone || "",
      preferredDate: "",
      preferredTime: "",
      location: service.location,
      details: "",
    });
    setBookingSuccess(false);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    await createBooking({
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      providerName: selectedService.providerName,
      ...bookingForm,
      status: "pending",
      totalPrice: selectedService.priceRange,
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedService(null);
      setBookingSuccess(false);
    }, 2000);
  };

  const handleSubmitReview = async (reviewData: {
    bookingId: number;
    serviceId: number;
    providerId: number;
    customerId: number;
    rating: number;
    reviewText: string;
    customerName: string;
  }) => {
    setIsSubmittingReview(true);
    try {
      await createReview(reviewData);
      setReviewModalOpen(false);
      setSelectedBookingForReview(null);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getServiceReviews = (serviceId: number) => {
    return reviews.filter((review) => review.serviceId === serviceId);
  };

  const getAverageRating = (serviceId: number) => {
    const serviceReviews = getServiceReviews(serviceId);
    if (serviceReviews.length === 0) return 0;
    const sum = serviceReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / serviceReviews.length;
  };

  const hasReviewedService = (
    serviceId: number,
    customerId: number
  ) => {
    return reviews.some(
      (review) => review.serviceId === serviceId && review.customerId === customerId
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">T</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tasksmith
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {currentUser && (
                <div className="flex items-center gap-2">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Accomplish your to-do list
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Hire skilled local professionals for any service you need
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-xl p-2 flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="What do you need help with?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 px-8">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse by category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                selectedCategory === category.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium text-gray-900">{category.name}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {selectedCategory
              ? `${categories.find((c) => c.id === selectedCategory)?.name} Services`
              : "Popular Services"}
          </h3>
          <p className="text-gray-600">{filteredServices.length} services available</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No services found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <Badge variant={service.availability === "available" ? "default" : "secondary"}>
                      {service.availability}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{service.providerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900">
                        {getAverageRating(service.id) > 0
                          ? getAverageRating(service.id).toFixed(1)
                          : service.providerRating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({getServiceReviews(service.id).length || service.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{service.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold text-blue-600">{service.priceRange}</span>
                      <Button
                        onClick={() => handleBookService(service)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Booking Dialog */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {bookingSuccess ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600">
                Your booking request has been sent to {selectedService?.providerName}.
                They will contact you shortly to confirm the details.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Book {selectedService?.title}</DialogTitle>
                <DialogDescription>
                  Fill in your details and preferred schedule. {selectedService?.providerName} will contact you to confirm.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmitBooking} className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{selectedService?.providerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{selectedService?.providerRating} ({selectedService?.reviewCount} reviews)</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">{selectedService?.priceRange}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Your Name *</Label>
                    <Input
                      id="customerName"
                      required
                      value={bookingForm.customerName}
                      onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email *</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <Input
                        id="customerEmail"
                        type="email"
                        required
                        value={bookingForm.customerEmail}
                        onChange={(e) => setBookingForm({ ...bookingForm, customerEmail: e.target.value })}
                        placeholder="john@example.com"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <Input
                        id="customerPhone"
                        type="tel"
                        value={bookingForm.customerPhone}
                        onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <Input
                        id="location"
                        value={bookingForm.location}
                        onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                        placeholder="Service address"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <Input
                        id="preferredDate"
                        type="date"
                        value={bookingForm.preferredDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Time</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <Input
                        id="preferredTime"
                        type="time"
                        value={bookingForm.preferredTime}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Additional Details</Label>
                  <Textarea
                    id="details"
                    value={bookingForm.details}
                    onChange={(e) => setBookingForm({ ...bookingForm, details: e.target.value })}
                    placeholder="Describe what you need help with..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedService(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Confirm Booking
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        bookingId={selectedBookingForReview?.id || 0}
        serviceId={selectedBookingForReview?.serviceId || 0}
        providerId={users.find((u) => u.name === selectedBookingForReview?.providerName)?.id || 0}
        customerId={currentUser?.id || 0}
        customerName={currentUser?.name || ""}
        serviceName={selectedBookingForReview?.serviceTitle || ""}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedBookingForReview(null);
        }}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmittingReview}
        hasExistingReview={selectedBookingForReview ? hasReviewedService(selectedBookingForReview.serviceId, currentUser?.id || 0) : false}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Tasksmith</h4>
              <p className="text-gray-400 text-sm">
                Connecting you with skilled professionals for any service you need.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Popular Services</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Home Cleaning</li>
                <li>Plumbing</li>
                <li>Electrical</li>
                <li>Moving</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Professionals</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Sign Up</li>
                <li>How It Works</li>
                <li>Pricing</li>
                <li>Resources</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 Tasksmith. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
