import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchThemes, fetchThemeCategories, trackThemeSelections } from "@/services/themesService";
import { useAuth } from "@/hooks/useAuth";
import { Theme } from "@/lib/types";

import ThemeGrid from "./themes/ThemeGrid";
import CategoryFilter from "./themes/CategoryFilter";
import ThemeSelectorHeader from "./themes/ThemeSelectorHeader";
import ThemeSelectorFooter from "./themes/ThemeSelectorFooter";
import LoadingState from "./themes/LoadingState";
import ErrorState from "./themes/ErrorState";
import { FALLBACK_THEMES } from "./themes/fallbackThemes";

interface ThemeSelectorProps {
  onThemesSelected: (themes: string[]) => void;
}

const ThemeSelector = ({ onThemesSelected }: ThemeSelectorProps) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
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
        setError(null);
      } catch (err) {
        console.error("Error loading themes or categories:", err);
        setError("Failed to load themes. Please try again.");
        // Use fallback themes if loading fails
        setThemes(FALLBACK_THEMES);
        
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
      if (activeCategory === 'All') {
        // If "All" is selected, we can use the themes we already have
        return;
      }
      
      try {
        setLoading(true);
        const fetchedThemes = await fetchThemes(activeCategory);
        setThemes(fetchedThemes);
        setError(null);
      } catch (err) {
        console.error(`Error loading themes for category ${activeCategory}:`, err);
        // Keep existing themes instead of showing an error
      } finally {
        setLoading(false);
      }
    };

    loadFilteredThemes();
  }, [activeCategory]);

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

  const handleRetry = () => window.location.reload();

  if (loading) {
    return <LoadingState />;
  }

  if (error && themes.length === 0) {
    return <ErrorState errorMessage={error} onRetry={handleRetry} />;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <ThemeSelectorHeader />

        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <ThemeGrid 
          themes={themes}
          selectedThemes={selectedThemes}
          onToggleTheme={toggleTheme}
        />

        <ThemeSelectorFooter 
          selectedThemesCount={selectedThemes.length}
          onContinue={handleContinue}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default ThemeSelector;
