
import { Button } from "@/components/ui/button";

interface ThemeSelectorFooterProps {
  selectedThemesCount: number;
  onContinue: () => void;
  isLoading: boolean;
}

const ThemeSelectorFooter = ({
  selectedThemesCount,
  onContinue,
  isLoading
}: ThemeSelectorFooterProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        {selectedThemesCount === 0 ? (
          <span>No themes selected</span>
        ) : (
          <span><b>{selectedThemesCount}</b> theme{selectedThemesCount !== 1 ? 's' : ''} selected</span>
        )}
      </div>
      <Button
        onClick={() => {
          console.log("[ThemeSelectorFooter] Continue button clicked");
          onContinue();
        }}
        className="bg-brand-green hover:bg-brand-darkGreen"
        disabled={isLoading}
      >
        Continue
      </Button>
    </div>
  );
};

export default ThemeSelectorFooter;
