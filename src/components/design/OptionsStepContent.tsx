
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, ShoppingCart } from "lucide-react";
import TShirtOptions from "@/components/design/TShirtOptions";
import { TShirtOptions as TShirtOptionsType } from "@/lib/types";

interface OptionsStepContentProps {
  tshirtOptions: TShirtOptionsType;
  onOptionsChange: (options: TShirtOptionsType) => void;
  onSaveDesign: () => void;
  onAddToCart: () => void;
  onNavigateStep: (step: string) => void;
}

const OptionsStepContent = ({
  tshirtOptions,
  onOptionsChange,
  onSaveDesign,
  onAddToCart,
  onNavigateStep,
}: OptionsStepContentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select T-Shirt Options</h2>
          <p className="text-gray-600 mb-6">
            Choose the color, size, and quantity for your custom t-shirt.
          </p>
          
          <TShirtOptions 
            onOptionsChange={onOptionsChange}
            defaultOptions={tshirtOptions}
          />
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => onNavigateStep("design")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Design
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={onSaveDesign}
                className="border-brand-green text-brand-green hover:text-brand-darkGreen"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Design
              </Button>
              <Button
                onClick={onAddToCart}
                className="bg-brand-green hover:bg-brand-darkGreen"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="font-medium">Custom T-Shirt Design</span>
              <span className="font-medium">$29.99</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Color:</span>
              <div 
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: tshirtOptions.color }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Size:</span>
              <span>{tshirtOptions.size}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Quantity:</span>
              <span>{tshirtOptions.quantity}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Item Total:</span>
              <span>${(29.99 * tshirtOptions.quantity).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Shipping:</span>
              <span>$5.99</span>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t font-medium">
              <span>Total:</span>
              <span>${(29.99 * tshirtOptions.quantity + 5.99).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsStepContent;
