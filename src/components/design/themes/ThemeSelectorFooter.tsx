
import { Button } from "@/components/ui/button";

interface ThemeSelectorFooterProps {
  selectedThemesCount: number;
  onContinue: () => void;
  isLoading: boolean;
  forceTransition?: () => void; // Optional callback to force transition
}

const ThemeSelectorFooter = ({
  selectedThemesCount,
  onContinue,
  isLoading,
  forceTransition
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
          try {
            // Add a try-catch to catch any errors that might occur
            console.log("[ThemeSelectorFooter] About to call onContinue");
            onContinue();
            console.log("[ThemeSelectorFooter] onContinue function called successfully");

            // Only trigger the transition when the continue button is explicitly clicked
            if (forceTransition) {
              console.log("[ThemeSelectorFooter] Forcing transition via callback");
              forceTransition();
            }

            // Dispatch a custom event to signal that the continue button was clicked
            const event = new CustomEvent('theme-continue-clicked');
            document.dispatchEvent(event);
            console.log("[ThemeSelectorFooter] Dispatched custom event 'theme-continue-clicked'");
          } catch (error) {
            console.error("[ThemeSelectorFooter] Error in onContinue:", error);
          }
        }}
        className="bg-brand-green hover:bg-brand-darkGreen"
        disabled={isLoading}
        data-testid="theme-continue-button"
      >
        Continue
      </Button>
    </div>
  );
};

export default ThemeSelectorFooter;
