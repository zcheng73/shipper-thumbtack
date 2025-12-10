import { useState } from "react";
import { Upload, Briefcase, DollarSign, Check } from "lucide-react";

type ProviderOnboardingProps = {
  onComplete: (data: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    serviceCategories: string[];
    description: string;
    hourlyRate: number;
    experience: string;
  }) => void;
};

const SERVICE_CATEGORIES = [
  { id: "home-improvement", name: "Home Improvement" },
  { id: "cleaning", name: "Cleaning Services" },
  { id: "plumbing", name: "Plumbing" },
  { id: "electrical", name: "Electrical" },
  { id: "painting", name: "Painting" },
  { id: "landscaping", name: "Landscaping" },
  { id: "moving", name: "Moving" },
  { id: "handyman", name: "Handyman" },
  { id: "photography", name: "Photography" },
  { id: "events", name: "Event Planning" },
  { id: "tutoring", name: "Tutoring" },
  { id: "fitness", name: "Personal Training" },
];

export default function ProviderOnboarding({ onComplete }: ProviderOnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    serviceCategories: [] as string[],
    description: "",
    hourlyRate: 0,
    experience: "",
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormData({
      ...formData,
      serviceCategories: formData.serviceCategories.includes(categoryId)
        ? formData.serviceCategories.filter((id) => id !== categoryId)
        : [...formData.serviceCategories, categoryId],
    });
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
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
        return formData.name && formData.email && formData.phone;
      case 2:
        return formData.serviceCategories.length > 0;
      case 3:
        return formData.description && formData.hourlyRate > 0 && formData.experience;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= num
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > num ? <Check className="w-5 h-5" /> : num}
                </div>
                {num < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      step > num ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Step {step} of 4
          </p>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Tasksmith
              </h2>
              <p className="text-gray-600">
                Let's set up your service provider profile
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="John Smith"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo (Optional)
              </label>
              <div className="flex items-center space-x-4">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <label className="cursor-pointer px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Service Categories */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your Services
              </h2>
              <p className="text-gray-600">
                Select the categories you provide services in
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SERVICE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                    formData.serviceCategories.includes(category.id)
                      ? "border-blue-600 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    {formData.serviceCategories.includes(category.id) && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Details & Pricing */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                About Your Services
              </h2>
              <p className="text-gray-600">
                Tell customers about your experience and pricing
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Tell customers about your skills, certifications, and what makes you great..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.hourlyRate || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hourlyRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <select
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select experience level</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Review & Complete */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Review Your Profile
              </h2>
              <p className="text-gray-600">
                Make sure everything looks good before continuing
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300" />
                )}
                <div>
                  <h3 className="font-bold text-lg">{formData.name}</h3>
                  <p className="text-sm text-gray-600">{formData.email}</p>
                  <p className="text-sm text-gray-600">{formData.phone}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.serviceCategories.map((catId) => {
                    const category = SERVICE_CATEGORIES.find(
                      (c) => c.id === catId
                    );
                    return (
                      <span
                        key={catId}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {category?.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-gray-700">{formData.description}</p>
              </div>

              <div className="border-t pt-4 flex justify-between">
                <div>
                  <h4 className="font-semibold">Hourly Rate</h4>
                  <p className="text-lg text-blue-600 font-bold">
                    ${formData.hourlyRate}/hr
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Experience</h4>
                  <p className="text-lg text-gray-700">
                    {formData.experience} years
                  </p>
                </div>
              </div>
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
            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  step === 1 ? "w-full" : ""
                } ${
                  isStepValid()
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
