
import React, { useRef } from "react";
import { Image, Text, Circle, Square, Trash2, PaintBucket } from "lucide-react";

interface CanvasToolbarProps {
  onAddText: () => void;
  onAddCircle: () => void;
  onAddRectangle: () => void;
  onAddImage: (file: File) => void;
  onDeleteSelected: () => void;
  onChangeColor: (color: string) => void;
  onChangeTshirtColor: (color: string) => void;
  currentTshirtColor: string;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onAddText,
  onAddCircle,
  onAddRectangle,
  onAddImage,
  onDeleteSelected,
  onChangeColor,
  onChangeTshirtColor,
  currentTshirtColor
}) => {
  // Available colors for the color picker
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000'];
  
  // Available t-shirt colors
  const tshirtColors = [
    { name: "White", value: "#ffffff", border: true },
    { name: "Black", value: "#000000" },
    { name: "Navy", value: "#0a192f" },
    { name: "Red", value: "#e11d48" },
    { name: "Green", value: "#10b981" },
    { name: "Blue", value: "#3b82f6" },
  ];
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAddImage(e.target.files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <button 
          onClick={onAddText}
          className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-darkGreen transition-colors flex items-center gap-1"
        >
          <Text size={16} />
          Add Text
        </button>
        <button 
          onClick={onAddCircle}
          className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-darkGreen transition-colors flex items-center gap-1"
        >
          <Circle size={16} />
          Circle
        </button>
        <button 
          onClick={onAddRectangle}
          className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-darkGreen transition-colors flex items-center gap-1"
        >
          <Square size={16} />
          Rectangle
        </button>
        <button 
          onClick={handleImageButtonClick}
          className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-darkGreen transition-colors flex items-center gap-1"
        >
          <Image size={16} />
          Add Image
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*" 
        />
        <button 
          onClick={onDeleteSelected}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-1"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Element Color:</span>
          <div className="flex items-center gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onChangeColor(color)}
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium flex items-center">
            <PaintBucket size={16} className="mr-1" />
            T-shirt Color:
          </span>
          <div className="flex items-center gap-1">
            {tshirtColors.map((color) => (
              <button
                key={color.value}
                onClick={() => onChangeTshirtColor(color.value)}
                className={`w-6 h-6 rounded-full ${
                  currentTshirtColor === color.value ? "ring-2 ring-brand-green ring-offset-1" : ""
                } ${color.border ? "border border-gray-300" : ""}`}
                style={{ backgroundColor: color.value }}
                aria-label={`T-shirt color ${color.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasToolbar;
