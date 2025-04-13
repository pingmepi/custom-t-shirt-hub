
import * as React from "react";
import ThemeCard from "./ThemeCard";
import { Theme } from "@/lib/types";

interface ThemeGridProps {
  themes: Theme[];
  selectedThemes: string[];
  onToggleTheme: (themeId: string) => void;
}

const ThemeGrid = ({ themes, selectedThemes, onToggleTheme }: ThemeGridProps) => {
  // Only log once when themes change
  React.useEffect(() => {
    console.log("[ThemeGrid] Themes updated, count:", themes.length);

    // Log if there are no themes to render
    if (themes.length === 0) {
      console.log("%c[ThemeGrid] WARNING: No themes to render!", "background: #F44336; color: white; padding: 4px; border-radius: 4px; font-weight: bold;");
    }
  }, [themes.length]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
      {themes.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          isSelected={selectedThemes.includes(theme.id)}
          onSelect={onToggleTheme}
        />
      ))}
    </div>
  );
};

export default ThemeGrid;
