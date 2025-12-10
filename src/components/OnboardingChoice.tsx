import { Briefcase, ShoppingBag } from "lucide-react";

type OnboardingChoiceProps = {
  onSelectUserType: (userType: "provider" | "customer") => void;
};

export default function OnboardingChoice({ onSelectUserType }: OnboardingChoiceProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Tasksmith
          </h1>
          <p className="text-xl text-gray-600">
            Choose how you'd like to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Provider Card */}
          <button
            onClick={() => onSelectUserType("provider")}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-all duration-300">
              <Briefcase className="w-8 h-8 text-blue-600 group-hover:text-white transition-all duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              I'm a Service Provider
            </h2>
            <p className="text-gray-600 mb-6">
              Offer your professional services, connect with customers, and grow your business on our platform.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Create your professional profile
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Set your own rates and schedule
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Get discovered by local customers
              </li>
            </ul>
            <div className="mt-6 text-blue-600 font-semibold group-hover:text-blue-700">
              Get Started as Provider →
            </div>
          </button>

          {/* Customer Card */}
          <button
            onClick={() => onSelectUserType("customer")}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left group"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-all duration-300">
              <ShoppingBag className="w-8 h-8 text-purple-600 group-hover:text-white transition-all duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              I Need Services
            </h2>
            <p className="text-gray-600 mb-6">
              Find trusted professionals for home improvements, repairs, events, and more in your area.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Browse verified professionals
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Read reviews and ratings
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Book services instantly
              </li>
            </ul>
            <div className="mt-6 text-purple-600 font-semibold group-hover:text-purple-700">
              Get Started as Customer →
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
