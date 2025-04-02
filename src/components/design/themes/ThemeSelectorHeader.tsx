
import { Palette } from "lucide-react";

const ThemeSelectorHeader = () => {
  return (
    <>
      <div className="flex items-center mb-2">
        <Palette className="h-5 w-5 text-brand-green mr-2" />
        <h2 className="text-xl font-semibold">Choose Your Design Themes</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Select up to 3 themes that best match the style you're looking for.
      </p>
    </>
  );
};

export default ThemeSelectorHeader;
