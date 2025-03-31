
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, ShoppingCart, Trash2, Edit, Filter } from "lucide-react";

const MOCK_DESIGNS = [
  {
    id: "1",
    name: "Minimalist Logo",
    preview_url: "/tshirt-mockup-1.png",
    price: 24.99,
    created_at: "2023-10-15",
  },
  {
    id: "2",
    name: "Vintage Typography",
    preview_url: "/tshirt-mockup-2.png",
    price: 29.99,
    created_at: "2023-10-12",
  },
  {
    id: "3",
    name: "Abstract Pattern",
    preview_url: "/tshirt-mockup-3.png",
    price: 27.99,
    created_at: "2023-10-08",
  },
  {
    id: "4",
    name: "Nature Inspired",
    preview_url: "/tshirt-mockup-4.png",
    price: 26.99,
    created_at: "2023-10-05",
  },
  {
    id: "5",
    name: "Geometric Shapes",
    preview_url: "/tshirt-mockup-5.png",
    price: 29.99,
    created_at: "2023-10-01",
  },
  {
    id: "6",
    name: "Bold Statement",
    preview_url: "/tshirt-mockup-6.png",
    price: 32.99,
    created_at: "2023-09-25",
  },
];

type FilterType = "all" | "my-designs" | "templates";

const DesignsListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const toggleFavorite = (designId: string) => {
    if (favorites.includes(designId)) {
      setFavorites(favorites.filter(id => id !== designId));
    } else {
      setFavorites([...favorites, designId]);
    }
  };
  
  const filteredDesigns = MOCK_DESIGNS.filter(design => {
    if (searchQuery && !design.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (activeFilter === "my-designs") {
      // In a real app, this would filter to only show the user's designs
      return ['1', '3', '5'].includes(design.id);
    }
    
    if (activeFilter === "templates") {
      // In a real app, this would filter to only show template designs
      return ['2', '4', '6'].includes(design.id);
    }
    
    return true;
  });

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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDesigns.map((design) => (
          <div key={design.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
            <div className="relative h-80 overflow-hidden">
              <img 
                src={design.preview_url} 
                alt={design.name} 
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
                <h3 className="font-semibold text-lg">{design.name}</h3>
                <span className="text-brand-green font-bold">${design.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Created: {new Date(design.created_at).toLocaleDateString()}
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
      
      {filteredDesigns.length === 0 && (
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
