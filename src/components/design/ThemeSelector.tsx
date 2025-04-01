
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Theme } from "@/lib/types";
import { Check } from "lucide-react";

// Added by lovable: Sample themes to be replaced with API data
const SAMPLE_THEMES: Theme[] = [
  { id: "travel", name: "Travel", image_url: "/placeholder.svg" },
  { id: "music", name: "Music", image_url: "/placeholder.svg" },
  { id: "sports", name: "Sports", image_url: "/placeholder.svg" },
  { id: "nature", name: "Nature", image_url: "/placeholder.svg" },
  { id: "abstract", name: "Abstract", image_url: "/placeholder.svg" },
  { id: "vintage", name: "Vintage", image_url: "/placeholder.svg" },
  { id: "minimal", name: "Minimal", image_url: "/placeholder.svg" },
  { id: "bold", name: "Bold", image_url: "/placeholder.svg" },
  { id: "funny", name: "Funny", image_url: "/placeholder.svg" },
  { id: "artistic", name: "Artistic", image_url: "/placeholder.svg" },
  { id: "gaming", name: "Gaming", image_url: "/placeholder.svg" },
  { id: "tech", name: "Technology", image_url: "/placeholder.svg" },
  { id: "animals", name: "Animals", image_url: "/placeholder.svg" },
  { id: "food", name: "Food", image_url: "/placeholder.svg" },
  { id: "motivational", name: "Motivational", image_url: "/placeholder.svg" },
];

interface ThemeSelectorProps {
  onThemesSelected: (themes: string[]) => void;
}

const ThemeSelector = ({ onThemesSelected }: ThemeSelectorProps) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  const toggleTheme = (themeId: string) => {
    setSelectedThemes(prev => {
      if (prev.includes(themeId)) {
        return prev.filter(id => id !== themeId);
      } else {
        return [...prev, themeId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedThemes.length === 0) {
      // If no themes selected, just use a default one
      onThemesSelected(["minimal"]);
    } else {
      onThemesSelected(selectedThemes);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Choose Your Design Themes</h2>
        <p className="text-gray-600 mb-6">
          Select one or more themes that best match the style you're looking for.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {SAMPLE_THEMES.map((theme) => (
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
                <div className="aspect-square relative mb-2 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={theme.image_url || "/placeholder.svg"} 
                    alt={theme.name} 
                    className="w-full h-full object-cover"
                  />
                  {selectedThemes.includes(theme.id) && (
                    <div className="absolute inset-0 bg-brand-green bg-opacity-30 flex items-center justify-center">
                      <Check className="text-white" size={24} />
                    </div>
                  )}
                </div>
                <p className="text-center font-medium">{theme.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleContinue}
            className="bg-brand-green hover:bg-brand-darkGreen"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
