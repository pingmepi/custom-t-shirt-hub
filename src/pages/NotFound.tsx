import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if this is a design route
  const isDesignRoute = location.pathname.startsWith('/design/');

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-red-600">404</h1>
        <p className="text-xl text-gray-700 mb-2">Oops! Page not found</p>

        {isDesignRoute && (
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              The design you're looking for might have been deleted or doesn't exist.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>

          <Button asChild className="bg-brand-green hover:bg-brand-darkGreen flex items-center gap-2">
            <Link to="/">
              <Home size={16} />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
