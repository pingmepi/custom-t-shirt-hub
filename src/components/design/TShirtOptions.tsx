
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TShirtOptions as TShirtOptionsType } from "@/lib/types";

const COLORS = [
  { name: "White", value: "#ffffff", border: true },
  { name: "Black", value: "#000000" },
  { name: "Navy", value: "#0a192f" },
  { name: "Red", value: "#e11d48" },
  { name: "Green", value: "#10b981" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Yellow", value: "#eab308" },
  { name: "Purple", value: "#8b5cf6" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

interface TShirtOptionsProps {
  onOptionsChange: (options: TShirtOptionsType) => void;
  defaultOptions?: TShirtOptionsType;
}

const TShirtOptions = ({ onOptionsChange, defaultOptions }: TShirtOptionsProps) => {
  const [options, setOptions] = useState<TShirtOptionsType>(
    defaultOptions || {
      color: "#ffffff",
      size: "M",
      quantity: 1,
    }
  );

  const handleColorChange = (color: string) => {
    const newOptions = { ...options, color };
    setOptions(newOptions);
    onOptionsChange(newOptions);
  };

  const handleSizeChange = (size: TShirtOptionsType["size"]) => {
    const newOptions = { ...options, size };
    setOptions(newOptions);
    onOptionsChange(newOptions);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value, 10);
    if (quantity > 0) {
      const newOptions = { ...options, quantity };
      setOptions(newOptions);
      onOptionsChange(newOptions);
    }
  };

  const incrementQuantity = () => {
    const newOptions = { ...options, quantity: options.quantity + 1 };
    setOptions(newOptions);
    onOptionsChange(newOptions);
  };

  const decrementQuantity = () => {
    if (options.quantity > 1) {
      const newOptions = { ...options, quantity: options.quantity - 1 };
      setOptions(newOptions);
      onOptionsChange(newOptions);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium mb-2 block">Select Color</Label>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                options.color === color.value ? "ring-2 ring-brand-green ring-offset-2" : ""
              } ${color.border ? "border border-gray-300" : ""}`}
              style={{ backgroundColor: color.value }}
              aria-label={`${color.name} color`}
            >
              {options.color === color.value && (
                <span className={`text-${color.value === "#ffffff" || color.value === "#eab308" ? "black" : "white"}`}>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-lg font-medium mb-2 block">Select Size</Label>
        <RadioGroup
          value={options.size}
          onValueChange={(value) => handleSizeChange(value as TShirtOptionsType["size"])}
          className="flex flex-wrap gap-3"
        >
          {SIZES.map((size) => (
            <div key={size} className="flex items-center">
              <RadioGroupItem
                value={size}
                id={`size-${size}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`size-${size}`}
                className="h-10 px-4 flex items-center justify-center rounded-md border border-gray-300
                          peer-data-[state=checked]:border-brand-green peer-data-[state=checked]:bg-brand-lightGreen 
                          peer-data-[state=checked]:text-brand-darkGreen cursor-pointer hover:bg-gray-50"
              >
                {size}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-lg font-medium mb-2 block">Quantity</Label>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            disabled={options.quantity <= 1}
            className="h-10 w-10 rounded-r-none"
          >
            -
          </Button>
          <Input
            type="number"
            min="1"
            value={options.quantity}
            onChange={handleQuantityChange}
            className="h-10 rounded-none text-center w-20"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            className="h-10 w-10 rounded-l-none"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TShirtOptions;
