
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchThemes, fetchThemeCategories, trackThemeSelections } from "@/services/themesService";
// import { useAuth } from "@/context/AuthContext"; // Commented out for now
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
  // const { user } = useAuth(); // Commented out for now

  useEffect(() => {
    const loadThemesAndCategories = async () => {
      try {
        setLoading(true);

        // Skip access checks for now and focus on getting themes to display
        console.log("[ThemeSelector] Skipping access checks to ensure themes load");

        // Load categories and themes in parallel
        const [fetchedCategories, fetchedThemes] = await Promise.all([
          fetchThemeCategories(),
          fetchThemes()
        ]);

        console.log("[ThemeSelector] Received categories:", fetchedCategories);
        console.log("[ThemeSelector] Received themes count:", fetchedThemes.length);
        console.log("[ThemeSelector] Themes sample:", fetchedThemes.slice(0, 2));

        setCategories(fetchedCategories);
        setThemes(fetchedThemes);
        setError(null);

        console.log("%c[ThemeSelector] THEMES LOADED SUCCESSFULLY!", "background: #2196F3; color: white; padding: 4px; border-radius: 4px; font-weight: bold;");
      } catch (err) {
        console.error("Error loading themes or categories:", err);
        setError("Failed to load themes. Please try again.");
        // Use fallback themes if loading fails
        console.log("%c[ThemeSelector] USING FALLBACK THEMES DUE TO ERROR", "background: #FF9800; color: white; padding: 4px; border-radius: 4px; font-weight: bold;");
        console.log("[ThemeSelector] Fallback themes count:", FALLBACK_THEMES.length);
        console.log("[ThemeSelector] Fallback themes sample:", FALLBACK_THEMES.slice(0, 2));
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
    // Log only the theme being toggled, not the entire component state
    console.log(`[ThemeSelector] Toggling theme: ${themeId}`);

    setSelectedThemes(prev => {
      let newSelection: string[];

      if (prev.includes(themeId)) {
        // Remove theme
        newSelection = prev.filter(id => id !== themeId);
        console.log(`[ThemeSelector] Removed theme: ${themeId}. New selection count: ${newSelection.length}`);
      } else {
        // Limit selection to maximum 3 themes
        if (prev.length >= 3) {
          toast({
            title: "Maximum themes selected",
            description: "You can select up to 3 themes. Remove a theme to add another.",
            variant: "default"
          });
          newSelection = prev;
          console.log(`[ThemeSelector] Maximum themes reached (3). Selection unchanged.`);
        } else {
          // Add theme
          newSelection = [...prev, themeId];
          console.log(`[ThemeSelector] Added theme: ${themeId}. New selection count: ${newSelection.length}`);
        }
      }

      return newSelection;
    });
  };

  const handleContinue = async () => {
    console.log("[ThemeSelector] Continue button clicked");

    if (selectedThemes.length === 0) {
      toast({
        title: "No theme selected",
        description: "Using default minimal theme instead.",
      });

      // Use minimal theme as default if available
      const minimalTheme = themes.find(t => t.name.toLowerCase() === "minimal");
      const defaultThemeId = minimalTheme ? minimalTheme.id : themes[0]?.id;

      if (defaultThemeId) {
        console.log(`[ThemeSelector] Using default theme: ${defaultThemeId}`);
        // Track theme selection
        await trackThemeSelections([defaultThemeId]);
        onThemesSelected([defaultThemeId]);
      } else {
        console.log(`[ThemeSelector] No default theme found, using 'minimal'`);
        onThemesSelected(["minimal"]);
      }
    } else {
      console.log(`[ThemeSelector] Using selected themes: ${selectedThemes.join(', ')}`);
      // Track theme selection
      await trackThemeSelections(selectedThemes);

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
