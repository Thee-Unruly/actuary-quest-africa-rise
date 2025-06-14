
import { Calculator } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-6 h-6 text-white animate-pulse" />
        </div>
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    </div>
  );
};
