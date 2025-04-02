
import ThemeCard from "./ThemeCard";
import { Theme } from "@/lib/types";

interface ThemeGridProps {
  themes: Theme[];
  selectedThemes: string[];
  onToggleTheme: (themeId: string) => void;
}

const ThemeGrid = ({ themes, selectedThemes, onToggleTheme }: ThemeGridProps) => {
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
