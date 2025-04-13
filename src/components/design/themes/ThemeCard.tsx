
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Theme } from "@/lib/types";

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: (themeId: string) => void;
}

const ThemeCard = ({ theme, isSelected, onSelect }: ThemeCardProps) => {
  // Only log on first render, not on every re-render
  const handleSelect = () => {
    onSelect(theme.id);
  };

  return (
    <Card
      key={theme.id}
      className={`cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-brand-green'
          : 'hover:shadow-md'
      }`}
      onClick={handleSelect}
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
          {isSelected && (
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
  );
};

export default ThemeCard;
