import React from "react";

interface CanvasToolbarProps {
  onAddText: () => void;
  onAddCircle: () => void;
  onAddRectangle: () => void;
  onDeleteSelected: () => void;
  onChangeColor: (color: string) => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onAddText,
  onAddCircle,
  onAddRectangle,
  onDeleteSelected,
  onChangeColor
}) => {
  // Available colors for the color picker
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000'];
  
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      <button 
        onClick={onAddText}
        className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-darkGreen transition-colors"
      >
        Add Text
      </button>
      <button 
        onClick={onAddCircle}
        className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-darkGreen transition-colors"
      >
        Add Circle
      </button>
      <button 
        onClick={onAddRectangle}
        className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-darkGreen transition-colors"
      >
        Add Rectangle
      </button>
      <button 
        onClick={onDeleteSelected}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Delete Selected
      </button>
      <div className="flex items-center gap-2">
        <span>Color:</span>
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
  );
};

export default CanvasToolbar;
