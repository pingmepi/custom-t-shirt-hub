
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { useFeaturedDesigns } from "@/hooks/use-designs";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const FeaturedDesigns = () => {
  const { data: featuredDesigns, isLoading, error } = useFeaturedDesigns();
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("designFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  useEffect(() => {
    // Save favorites to localStorage whenever it changes
    localStorage.setItem("designFavorites", JSON.stringify(favorites));
  }, [favorites]);
  
  const toggleFavorite = (designId: string) => {
    if (favorites.includes(designId)) {
      setFavorites(favorites.filter(id => id !== designId));
      toast({ title: "Removed from favorites" });
    } else {
      setFavorites([...favorites, designId]);
      toast({ title: "Added to favorites" });
    }
  };

  if (error) {
    console.error("Error loading featured designs:", error);
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-brand-gray">T-shirt Printing for Everyone</h2>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDesigns?.slice(0, 4).map((design) => (
              <div key={design.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={design.image_url} 
                    alt={design.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-green hover:bg-brand-darkGreen">
                      View Details
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{design.title}</h3>
                    <span className="text-brand-green font-bold">$29.99</span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-brand-green hover:text-brand-darkGreen"
                      onClick={() => toggleFavorite(design.id)}
                    >
                      <Heart className={favorites.includes(design.id) ? "h-4 w-4 fill-red-500 text-red-500" : "h-4 w-4"} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link to="/designs">
            <Button className="bg-brand-green hover:bg-brand-darkGreen text-white">
              View All Designs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDesigns;
