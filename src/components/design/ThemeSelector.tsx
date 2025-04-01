import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Theme } from "@/lib/types";
import { Check, Palette, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fetchThemes, fetchThemeCategories, trackThemeSelections } from "@/services/themesService";
import { useAuth } from "@/hooks/useAuth";

interface ThemeSelectorProps {
  onThemesSelected: (themes: string[]) => void;
}

const ThemeSelector = ({ onThemesSelected }: ThemeSelectorProps) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [allThemes, setAllThemes] = useState<Theme[]>([]); // Store all themes for the "All" category
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadThemesAndCategories = async () => {
      try {
        setLoading(true);
        
        // Load categories and themes in parallel
        const [fetchedCategories, fetchedThemes] = await Promise.all([
          fetchThemeCategories(),
          fetchThemes()
        ]);
        
        setCategories(fetchedCategories);
        setThemes(fetchedThemes);
        setAllThemes(fetchedThemes); // Store all themes for reference
        setError(null);
      } catch (err) {
        console.error("Error loading themes or categories:", err);
        setError("Failed to load themes. Please try again.");
        // Use fallback themes if loading fails
        setThemes(FALLBACK_THEMES);
        setAllThemes(FALLBACK_THEMES);
        
        toast({
          title: "Error loading themes",
          description: "Using fallback themes instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadThemesAndCategories();
  }, [toast]);

  // When category changes, load filtered themes
  useEffect(() => {
    const loadFilteredThemes = async () => {
      setLoading(true);
      
      try {
        if (activeCategory === 'All') {
          // If "All" is selected, use the stored allThemes
          setThemes(allThemes);
        } else {
          // Otherwise fetch themes for the selected category
          const fetchedThemes = await fetchThemes(activeCategory);
          setThemes(fetchedThemes);
        }
        setError(null);
      } catch (err) {
        console.error(`Error loading themes for category ${activeCategory}:`, err);
        // If there's an error when fetching a specific category, 
        // and we're not in the "All" category, show an error toast
        if (activeCategory !== 'All') {
          toast({
            title: "Error loading themes",
            description: `Failed to load themes for ${activeCategory} category.`,
            variant: "destructive"
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadFilteredThemes();
  }, [activeCategory, allThemes, toast]);

  const toggleTheme = (themeId: string) => {
    setSelectedThemes(prev => {
      if (prev.includes(themeId)) {
        return prev.filter(id => id !== themeId);
      } else {
        // Limit selection to maximum 3 themes
        if (prev.length >= 3) {
          toast({
            title: "Maximum themes selected",
            description: "You can select up to 3 themes. Remove a theme to add another.",
            variant: "default"
          });
          return prev;
        }
        return [...prev, themeId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedThemes.length === 0) {
      toast({
        title: "No theme selected",
        description: "Using default minimal theme instead.",
      });
      
      // Use minimal theme as default if available
      const minimalTheme = themes.find(t => t.name.toLowerCase() === "minimal");
      const defaultThemeId = minimalTheme ? minimalTheme.id : themes[0]?.id;
      
      if (defaultThemeId) {
        // Track theme selection if user is logged in
        if (user) {
          await trackThemeSelections([defaultThemeId]);
        }
        onThemesSelected([defaultThemeId]);
      } else {
        onThemesSelected(["minimal"]);
      }
    } else {
      // Track theme selection if user is logged in
      if (user) {
        await trackThemeSelections(selectedThemes);
      }
      
      onThemesSelected(selectedThemes);
      toast({
        title: "Themes selected",
        description: `Selected ${selectedThemes.length} themes for your design.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-brand-green h-8 w-8 mr-2" />
          <span className="text-lg text-gray-600">Loading themes...</span>
        </div>
      </div>
    );
  }

  if (error && themes.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          <h3 className="text-xl font-semibold mb-2">Failed to Load Themes</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-2">
          <Palette className="h-5 w-5 text-brand-green mr-2" />
          <h2 className="text-xl font-semibold">Choose Your Design Themes</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Select up to 3 themes that best match the style you're looking for.
        </p>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">FILTER BY CATEGORY</h3>
          <ToggleGroup type="single" value={activeCategory} onValueChange={(value) => value && setActiveCategory(value)}>
            {categories.map(category => (
              <ToggleGroupItem 
                key={category} 
                value={category}
                variant="outline"
                className="text-sm"
              >
                {category}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {themes.map((theme) => (
            <Card 
              key={theme.id}
              className={`cursor-pointer transition-all ${
                selectedThemes.includes(theme.id) 
                  ? 'ring-2 ring-brand-green' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => toggleTheme(theme.id)}
            >
              <CardContent className="p-3">
                <div 
                  className="aspect-square relative mb-2 rounded-md overflow-hidden"
                  style={{
                    background: theme.primary_color || "#f3f4f6",
                    backgroundImage: theme.image_url ? `url(${theme.image_url})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!theme.image_url && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(45deg, ${theme.primary_color || '#f3f4f6'}, ${theme.secondary_color || theme.primary_color || '#e5e7eb'})`,
                      }}
                    >
                      <span className="text-white text-xs font-medium opacity-90">{theme.name}</span>
                    </div>
                  )}
                  {selectedThemes.includes(theme.id) && (
                    <div className="absolute inset-0 bg-brand-green bg-opacity-30 flex items-center justify-center">
                      <Check className="text-white" size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-center font-medium text-sm">{theme.name}</p>
                  {theme.description && (
                    <p className="text-xs text-gray-500 text-center mt-1 truncate">{theme.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedThemes.length === 0 ? (
              <span>No themes selected</span>
            ) : (
              <span><b>{selectedThemes.length}</b> theme{selectedThemes.length !== 1 ? 's' : ''} selected</span>
            )}
          </div>
          <Button 
            onClick={handleContinue}
            className="bg-brand-green hover:bg-brand-darkGreen"
            disabled={loading}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

// Fallback themes in case the API fails
const FALLBACK_THEMES: Theme[] = [
  { 
    id: "travel", 
    name: "Travel", 
    description: "Capture your wanderlust",
    image_url: "/placeholder.svg", 
    primary_color: "#00B4D8", 
    secondary_color: "#0077B6",
    category: "Artistic" 
  },
  { 
    id: "music", 
    name: "Music", 
    description: "Express your rhythm",
    image_url: "/placeholder.svg", 
    primary_color: "#9D4EDD", 
    secondary_color: "#7B2CBF",
    category: "Artistic" 
  },
  { 
    id: "sports", 
    name: "Sports", 
    description: "Show your active side",
    image_url: "/placeholder.svg", 
    primary_color: "#FB5607", 
    secondary_color: "#FC9E4F",
    category: "Minimal" 
  },
  { 
    id: "nature", 
    name: "Nature", 
    description: "Connect with the outdoors",
    image_url: "/placeholder.svg", 
    primary_color: "#80B918", 
    secondary_color: "#55A630",
    category: "Nature" 
  },
  { 
    id: "abstract", 
    name: "Abstract", 
    description: "Bold geometric patterns",
    image_url: "/placeholder.svg", 
    primary_color: "#FF006E", 
    secondary_color: "#8338EC",
    category: "Abstract" 
  },
  { 
    id: "vintage", 
    name: "Vintage", 
    description: "Classic retro aesthetics",
    image_url: "/placeholder.svg", 
    primary_color: "#B08968", 
    secondary_color: "#DDA15E",
    category: "Typography" 
  },
  { 
    id: "minimal", 
    name: "Minimal", 
    description: "Clean, simple designs",
    image_url: "/placeholder.svg", 
    primary_color: "#212529", 
    secondary_color: "#6C757D",
    category: "Minimal" 
  },
  { 
    id: "bold", 
    name: "Bold", 
    description: "Make a statement",
    image_url: "/placeholder.svg", 
    primary_color: "#D00000", 
    secondary_color: "#DC2F02",
    category: "Typography" 
  },
  { 
    id: "funny", 
    name: "Funny", 
    description: "Add humor to your style",
    image_url: "/placeholder.svg", 
    primary_color: "#FFC300", 
    secondary_color: "#FFD60A",
    category: "Artistic" 
  },
  { 
    id: "artistic", 
    name: "Artistic", 
    description: "Creative expression",
    image_url: "/placeholder.svg", 
    primary_color: "#06D6A0", 
    secondary_color: "#1B9AAA",
    category: "Artistic" 
  },
  { 
    id: "gaming", 
    name: "Gaming", 
    description: "For the gamers",
    image_url: "/placeholder.svg", 
    primary_color: "#7209B7", 
    secondary_color: "#3A0CA3",
    category: "Abstract" 
  },
  { 
    id: "tech", 
    name: "Technology", 
    description: "Digital innovation",
    image_url: "/placeholder.svg", 
    primary_color: "#4895EF", 
    secondary_color: "#4361EE",
    category: "Minimal" 
  },
  { 
    id: "animals", 
    name: "Animals", 
    description: "Wildlife inspired",
    image_url: "/placeholder.svg", 
    primary_color: "#588157", 
    secondary_color: "#3A5A40",
    category: "Nature" 
  },
  { 
    id: "food", 
    name: "Food", 
    description: "Culinary delights",
    image_url: "/placeholder.svg", 
    primary_color: "#E63946", 
    secondary_color: "#F1FAEE",
    category: "Artistic" 
  },
  { 
    id: "motivational", 
    name: "Motivational", 
    description: "Inspiring quotes & designs",
    image_url: "/placeholder.svg", 
    primary_color: "#1D3557", 
    secondary_color: "#457B9D",
    category: "Typography" 
  },
];

export default ThemeSelector;
