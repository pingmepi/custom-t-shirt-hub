
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, ShoppingCart, Trash2, Edit, Filter, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchSampleImages } from "@/api/sample-images";
import { SampleImage } from "@/types/sample-images";
import { Skeleton } from "@/components/ui/skeleton";

type FilterType = "all" | "my-designs" | "templates";

const DesignsListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Fetch sample images from Supabase
  const { data: sampleImages, isLoading, error } = useQuery({
    queryKey: ['sample-images'],
    queryFn: fetchSampleImages,
  });
  
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
  
  const filteredDesigns = sampleImages?.filter(design => {
    if (searchQuery && !design.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (activeFilter === "my-designs") {
      // In a real app with authentication, this would filter to only show the user's designs
      return false; // Not implemented for this demo without auth
    }
    
    if (activeFilter === "templates") {
      return true; // All sample images are considered templates
    }
    
    return true;
  }) || [];

  if (error) {
    console.error("Error loading designs:", error);
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Designs</h1>
          <p className="text-lg text-gray-600">
            Find inspiration or start with one of our templates
          </p>
        </div>
        <Link to="/design">
          <Button className="mt-4 md:mt-0 bg-brand-green hover:bg-brand-darkGreen">
            Create New Design
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="search"
            placeholder="Search designs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            className={activeFilter === "all" ? "bg-brand-green hover:bg-brand-darkGreen" : ""}
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button
            variant={activeFilter === "my-designs" ? "default" : "outline"}
            className={activeFilter === "my-designs" ? "bg-brand-green hover:bg-brand-darkGreen" : ""}
            onClick={() => setActiveFilter("my-designs")}
          >
            My Designs
          </Button>
          <Button
            variant={activeFilter === "templates" ? "default" : "outline"}
            className={activeFilter === "templates" ? "bg-brand-green hover:bg-brand-darkGreen" : ""}
            onClick={() => setActiveFilter("templates")}
          >
            Templates
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-80 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={design.image_url} 
                  alt={design.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                    <Button className="bg-white text-brand-gray hover:bg-gray-100">
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button className="bg-white text-brand-gray hover:bg-gray-100">
                      <Edit className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(design.id)}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
                >
                  <Heart 
                    className={favorites.includes(design.id) ? "text-red-500 fill-red-500" : "text-gray-500"} 
                    size={20} 
                  />
                </button>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{design.title}</h3>
                  <span className="text-brand-green font-bold">${(29.99).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {design.description || 'Custom T-Shirt Design'}
                  </span>
                  <div className="flex space-x-2">
                    {activeFilter === "my-designs" && (
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 p-1">
                        <Trash2 size={18} />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-brand-green hover:bg-brand-lightGreen p-1">
                      <ShoppingCart size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isLoading && filteredDesigns.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-900">No designs found</h3>
          <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
          <Button 
            variant="outline" 
            className="mt-4 border-brand-green text-brand-green hover:bg-brand-lightGreen"
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default DesignsListPage;
