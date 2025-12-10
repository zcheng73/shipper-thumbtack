import { useState } from "react";
import { Search, MapPin, Check, Star } from "lucide-react";

type CustomerOnboardingProps = {
  onComplete: (data: {
    name: string;
    email: string;
    phone: string;
    preferredCategories: string[];
    location: string;
  }) => void;
  onSkip: () => void;
};

const SERVICE_CATEGORIES = [
  { id: "home-improvement", name: "Home Improvement", icon: "🏠" },
  { id: "cleaning", name: "Cleaning", icon: "🧹" },
  { id: "plumbing", name: "Plumbing", icon: "🔧" },
  { id: "electrical", name: "Electrical", icon: "⚡" },
  { id: "painting", name: "Painting", icon: "🎨" },
  { id: "landscaping", name: "Landscaping", icon: "🌳" },
  { id: "moving", name: "Moving", icon: "📦" },
  { id: "handyman", name: "Handyman", icon: "🔨" },
  { id: "photography", name: "Photography", icon: "📸" },
  { id: "events", name: "Event Planning", icon: "🎉" },
  { id: "tutoring", name: "Tutoring", icon: "📚" },
  { id: "fitness", name: "Personal Training", icon: "💪" },
];

export default function CustomerOnboarding({ onComplete, onSkip }: CustomerOnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredCategories: [] as string[],
    location: "",
  });

  const toggleCategory = (categoryId: string) => {
    setFormData({
      ...formData,
      preferredCategories: formData.preferredCategories.includes(categoryId)
        ? formData.preferredCategories.filter((id) => id !== categoryId)
        : [...formData.preferredCategories, categoryId],
    });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email;
      case 2:
        return formData.location;
      case 3:
        return true; // Optional step
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= num
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > num ? <Check className="w-5 h-5" /> : num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-24 h-1 mx-2 transition-all duration-300 ${
                      step > num ? "bg-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Step {step} of 3
          </p>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <Star className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Tasksmith
              </h2>
              <p className="text-gray-600">
                Find trusted professionals for any task
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Where are you located?
              </h2>
              <p className="text-gray-600">
                We'll show you local professionals in your area
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code or City
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="90210 or Los Angeles, CA"
              />
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-purple-800">
                <strong>💡 Tip:</strong> We'll use this to match you with nearby service providers and give you accurate pricing estimates.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <Search className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What services interest you?
              </h2>
              <p className="text-gray-600">
                Optional: Help us personalize your experience
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SERVICE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                    formData.preferredCategories.includes(category.id)
                      ? "border-purple-600 bg-purple-50 text-purple-900"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                    {formData.preferredCategories.includes(category.id) && (
                      <Check className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={onSkip}
                className="text-purple-600 hover:text-purple-700 font-medium transition-all"
              >
                Skip this step
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Back
            </button>
          )}
          <div className={step === 1 ? "w-full" : ""}>
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  step === 1 ? "w-full" : ""
                } ${
                  isStepValid()
                    ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
